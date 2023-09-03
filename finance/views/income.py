from jsonschema import ValidationError
from psycopg import IntegrityError
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from ..serializers import CategorySerializer, IncomeSerializer
from ..models import Category, Income


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_incomes(request):
    categories = Category.objects.all()
    currency = request.session.get("currency")
    serializer = CategorySerializer(
        categories, context={"currency": currency}, many=True
    )
    return Response(serializer.data, status=200)


@api_view(["POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def create_income(request, id):
    category_id = request.data.get("category")
    title = request.data.get("title")
    amount = request.data.get("amount")
    date = request.data.get("date")

    category = Category.objects.get(pk=category_id)

    try:
        expense = Income.objects.create(
            title=title, amount=amount, date=date, category=category
        )
    except (IntegrityError, ValidationError, AttributeError) as e:
        raise e

    serializer = IncomeSerializer(expense)
    return Response(serializer.data, 200)


@api_view(["DELETE"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def delete_income(request, id):
    expenseId = request.data

    try:
        expense = Income.objects.get(id=expenseId)
        expense.delete()
    except Income.DoesNotExist as e:
        return Response({"error": "Income does not exist"}, status=404)

    serializer = IncomeSerializer(expense)
    return Response(serializer.data, status=200)
