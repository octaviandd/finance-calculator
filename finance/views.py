from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, YearlyPeriodSerializer, CategorySerializer , MonthlyPeriodSerializer
from .models import Expense, Income, Category, YearlyPeriod, Profile, MonthlyPeriod
from django.db import IntegrityError
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from datetime import datetime
import json
import calendar

# AUTH ROUTES #

@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.create_user(
            first_name=serializer.validated_data['first_name'],
            last_name=serializer.validated_data['last_name'],
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
        raise Response({"error": "Invalid credentials"} , status = 400)

    if not user.check_password(password):
        raise Response({"error": "Invalid credentials"} , status = 400)

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
    title = request.data.get('title')
    amount = request.data.get('planned_amount')
    category = request.data.get('category')
    description = request.data.get('target')
    user = request.user

    try:
        Expense.objects.create(user = user, planned_amount = amount, category = category, description = description, title = title)
    except (IntegrityError, ValidationError, AttributeError) as e:
        raise e
    
    return Response({"message": 'Expense created'}, status = 200)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_monthly_period_income(id, request):
    title = request.data.get('title')
    amount = request.data.get('amount')
    category = request.data.get('category')
    description = request.data.get('description')
    user = request.user

    try:
        Income.objects.create(user = user, amount = amount, category = category, description = description, title = title)
    except (IntegrityError, ValidationError, AttributeError) as e:
        raise e
    
    return Response({"message": 'Expense created'}, status = 200)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many = True)
    return Response(serializer.data, status = 200)
