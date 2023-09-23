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
from ..serializers import CategorySerializer, ExpenseSerializer
from ..models import Expense, Category


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
def create_expense(request, id):
    category_id = request.data.get("category")
    title = request.data.get("title")
    amount = float(request.data.get("amount")) or 0
    date = request.data.get("date")
    currency = request.session.get("currency")

    category = Category.objects.get(pk=category_id)

    try:
        expense = Expense.objects.create(
            title=title, amount=amount, date=date, category=category
        )
    except (IntegrityError, ValidationError, AttributeError) as e:
        raise e

    serializer = ExpenseSerializer(expense, context={"currency": currency}, many = False)
    return Response(serializer.data, status=200)


@api_view(["DELETE"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def delete_expense(request, id):
    expenseId = request.data

    try:
        expense = Expense.objects.get(id=expenseId)
        expense.delete()
    except Expense.DoesNotExist as e:
        return Response({"error": "Expense does not exist"}, status=404)

    serializer = ExpenseSerializer(expense, many = False)
    return Response(serializer.data, status=200)
