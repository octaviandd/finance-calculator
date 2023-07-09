from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, PeriodSerializer
from .models import Expense, Income, Category, Period
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny


@api_view(['POST'])
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


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_expense(request):
    title = request.data.get('title')
    amount = request.data.get('amount')
    category = request.data.get('category')
    description = request.data.get('description')
    user = request.user

    try:
        Expense.objects.create(user = user, amount = amount, category = category, description = description, title = title)
    except (IntegrityError, ValidationError, AttributeError) as e:
        raise e
    
    return Response({"message": 'Expense created'}, status = 200)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_income(request):
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
def get_periods(request):
    print(request)
    periods = Period.objects.all()
    serializer = PeriodSerializer(periods, many = True)
    return Response(serializer.data, status = 200)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_period(request, id):
    periods = Period.objects.get(id = id)
    serializer = PeriodSerializer(periods, many = False)
    return Response(serializer.data, status = 200)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_spreadsheet_data(request, id):
    user = request.user
    print(user)
    periods = Period.objects.get(id = id)
    serializer = PeriodSerializer(periods, many = False)
    return Response(serializer.data, status = 200)