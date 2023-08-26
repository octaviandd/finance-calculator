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
def create_category(request, id):
    category_title = request.data['category']['title']
    category_type = request.data['categoryType']
    planned_amount = request.data['category']['amount'] or 0

    monthly_period = MonthlyPeriod.objects.get(id = id)

    if(Category.objects.filter(title = category_title).exists()):
        return Response({'error': 'The item already exists'}, 400)

    try:
        category = Category.objects.create(title = category_title, category_type = category_type, planned_amount = planned_amount)
        monthly_period.categories.add(category)
    except(IntegrityError, ValidationError, AttributeError) as e: 
       raise e
    
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many = True)
    return Response(serializer.data, status = 200)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_category(request, id):
    categoryId = request.data['categoryId']
    categoryType = request.data['categoryType']

    try:
        category = Category.objects.get(id = categoryId)
        category.delete()
    except(Category.DoesNotExist) as e: 
       return Response({'error': 'Category not found'}, status=404)
    
    categories = Category.objects.filter(category_type = categoryType)
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