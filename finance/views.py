from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, YearlyPeriodSerializer, CategorySerializer , MonthlyPeriodSerializer, ExpenseSerializer
from .models import Expense, Income, Category, YearlyPeriod, Profile, MonthlyPeriod
from django.db import IntegrityError
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from datetime import datetime
from dotenv import load_dotenv
import freecurrencyapi
import json
import os
import calendar

load_dotenv('.env')


def create_default_expenses_categories():
    default_expenses = ['Food', 'Gifts', 'Health/medical', 'Home', 'Transportation', 'Personal', 'Pets', 'Utilities', 'Travel', 'Debt']

def create_default_incomes_categories():
    default_incomes = ['Savings', 'Paychecks', 'Bonus', 'Interest', 'Gifts', 'Other']



# AUTH ROUTES #

@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.create_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )
        return Response(UserSerializer(user).data, status=201)
    else:
        return Response(serializer.errors, status=400)
    
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if(created):
        profile = Profile.objects.create(user=instance)
    
        yearly_period = YearlyPeriod.objects.create(title=datetime.now().year)
        profile.periods.add(yearly_period)

        for index, month in enumerate(calendar.month_name[1:], 1):
            _, last_day = calendar.monthrange(datetime.now().year, index)
            from_date = datetime(datetime.now().year, index, 1).date()
            to_date = datetime(datetime.now().year, index, last_day).date()
            monthly_period = MonthlyPeriod.objects.create(title = month, from_date = from_date, to_date = to_date)
            default_expenses = ['Food', 'Gifts', 'Health/medical', 'Home', 'Transportation', 'Personal', 'Pets', 'Utilities', 'Travel', 'Debt']
            default_incomes = ['Savings', 'Paychecks', 'Bonus', 'Interest', 'Gifts', 'Other']

            yearly_period.monthly_periods.add(monthly_period)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    User = get_user_model()

    try:
        user = User.objects.get(email = email)
    except User.DoesNotExist:
        return Response({"error": "Invalid credentials"} , status = 400)

    if not user.check_password(password):
        return Response({"error": "Invalid credentials"} , status = 400)

    token, _ = Token.objects.get_or_create(user = user)
    return Response({'token' : token.key}, status = 200)

# AUTH ROUTES #

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_yearly_periods(request):
    profile, _ = Profile.objects.get_or_create(user = request.user)
    yearly_periods = profile.periods.all()
    serializer = YearlyPeriodSerializer(yearly_periods, many = True)
    return Response(serializer.data, status = 200)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_yearly_period(request, id):
    yearly_period = YearlyPeriod.objects.get(id = id)
    serializer = YearlyPeriodSerializer(yearly_period, many = False)
    return Response(serializer.data, status = 200)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_yearly_period(request):
    payload = json.loads(request.body.decode('utf-8'))
    previous_year = payload.get('previousYear', None)
    user = request.user

    profile, _ = Profile.objects.get_or_create(user = user)
    year = int(previous_year) + 1
    try:
        yearly_period = YearlyPeriod.objects.create(title=str(year))
        for index, month in enumerate(calendar.month_name[1:], 1):
            _, last_day = calendar.monthrange(year, index)
            from_date = datetime(year, index, 1).date()
            to_date = datetime(year, index, last_day).date()
            monthly_period = MonthlyPeriod.objects.create(title = month, from_date = from_date, to_date = to_date)
            yearly_period.monthly_periods.add(monthly_period)
        
        profile.periods.add(yearly_period)
    except (IntegrityError, ValidationError, AttributeError) as e:
        raise e
    
    serializer = YearlyPeriodSerializer(yearly_period)
    return Response(serializer.data, status = 200)



@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_monthly_period(request, id):
    yearly_period = MonthlyPeriod.objects.get(id = id)
    serializer = MonthlyPeriodSerializer(yearly_period, many = False)
    return Response(serializer.data, status = 200)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edit_monthly_period(request, id):
    yearly_period = MonthlyPeriod.objects.get(id = id)
    serializer = MonthlyPeriodSerializer(yearly_period, many = False)
    return Response(serializer.data, status = 200)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_monthly_period_expense(request, id):
    expense_data = request.data.get('type')
    title = expense_data.get('title')
    amount = expense_data.get('amount')
    date = expense_data.get('date')

    monthly_period = MonthlyPeriod.objects.get(pk = id)
    category = Category.objects.get(pk = 1)

    try:
        expense = Expense.objects.create(actual_amount = amount, date = date, category = category, title = title)
        monthly_period.expenses.add(expense)
    except (IntegrityError, ValidationError, AttributeError) as e:
        raise e
    
    serializer = ExpenseSerializer(expense)
    return Response(serializer.data, status = 200)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_monthly_period_income(request, id):
    income_data = request.data.get('type')
    title = income_data.get('title')
    amount = income_data.get('amount')
    category = income_data.get('category')
    date = income_data.get('date')

    monthly_period = MonthlyPeriod.objects.get(pk = id)
    category = Category.objects.get(pk = 1)

    try:
        income = Income.objects.create(actual_amount = amount, date = date, category = category, title = title)
        monthly_period.incomes.add(income)
    except (IntegrityError, ValidationError, AttributeError) as e:
        raise e
    
    return Response({"message": 'Expense created'}, status = 200)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_monthly_starting_balance(request, id):
    start_balance = request.data.get('start_balance')
    monthly_period = MonthlyPeriod.objects.get(pk = id)

    try:
        monthly_period.start_balance = start_balance
        monthly_period.save()
    except (IntegrityError, ValidationError, AttributeError) as e:
        raise e
    
    return Response({"message": 'Start balance updated.'}, status = 200)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many = True)
    return Response(serializer.data, status = 200)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_currency_exchange(request):
    currency = request.data.get('currency')
    client = freecurrencyapi.Client(os.getenv('FREE_CURRENCY_API'))

    result = client.latest(base_currency=currency, currencies=['EUR', 'USD', 'GBP'])

    return Response(result, status = 200)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_expense_planned_amount(request, id):
    planned_amount = request.data.get('amount')

    expense = Expense.objects.get(pk = id)
    try:
        expense.planned_amount = planned_amount
        expense.save()
    except (IntegrityError, ValidationError, AttributeError) as e:
        raise e

    return Response({"message": "Expense planned amount updated"}, 200)
   
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_income_planned_amount(request, id):
    planned_amount = request.data.get('amount')

    income = Income.objects.get(pk = id)
    try:
        income.planned_amount = planned_amount
        income.save()
    except (IntegrityError, ValidationError, AttributeError) as e:
        raise e

    return Response({"message": "income planned amount updated"}, 200)
   