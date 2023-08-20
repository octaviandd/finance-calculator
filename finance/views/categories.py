from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from ..serializers import CategorySerializer
from ..models import Category, MonthlyPeriod

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
def create_category(request):
    category_title = request.data.get('title')
    category_type = request.data.get('type')
    planned_amount = request.data.get('planned_amount') or 0


    if(Category.objects.filter(title = category_title).exists()):
        return Response({'error': 'The item already exists'}, 400)

    try:
        Category.objects.create(title = category_title, category_type = category_type, planned_amount = planned_amount)
    except(IntegrityError, ValidationError, AttributeError) as e: 
       raise e
    
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many = True)
    return Response(serializer.data, status = 200)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_category_planned_amount(request, id):
    planned_amount = request.data.get('amount')

    category = Category.objects.get(pk = id)
    try:
        category.planned_amount = planned_amount
        category.save()
    except (IntegrityError, ValidationError, AttributeError) as e:
        raise e

    return Response({"message": "Category planned amount updated"}, 200)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_category_expense(request, id):
    category_data = request.data.get('type')
    title = category_data.get('title')
    amount = category_data.get('amount')

    monthly_period = MonthlyPeriod.objects.get(pk = id)

    try:
        category = Category.objects.create(title=title, planned_amount = amount, category_type="expense")
        monthly_period.categories.add(category)
    except (IntegrityError, ValidationError, AttributeError) as e:
        raise e
    
    serializer = CategorySerializer(category)
    return Response(serializer.data, status = 200)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_category_income(request, id):
    income_data = request.data.get('type')
    title = income_data.get('title')
    amount = income_data.get('amount')

    monthly_period = MonthlyPeriod.objects.get(pk = id)

    try:
        category = Category.objects.create(title=title, planned_amount = amount, category_type="income")
        monthly_period.categories.add(category)
    except (IntegrityError, ValidationError, AttributeError) as e:
        raise e
    
    serializer = CategorySerializer(category)
    return Response(serializer.data, 200)