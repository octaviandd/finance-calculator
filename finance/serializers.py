from django.contrib.auth.models import User
from django.forms import ValidationError
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from .models import YearlyPeriod, MonthlyPeriod, Expense, Income, Category


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise ValidationError("A user with that email already exists.")
        return value

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as exc:
            raise serializers.ValidationError(str(exc))
        return value

    def create(self, validated_data):
        user = User(
            username=validated_data["username"],
            email=validated_data["email"],
        )

        user.set_password(validated_data["password"])
        user.save()

        return user


class CategorySerializer(serializers.ModelSerializer):
    actual_amount = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "title", "planned_amount", "category_type", "actual_amount"]

    def actual_amount(self):
        return self.expenses_set


class IncomeSerializer(serializers.ModelSerializer):
    category = CategorySerializer(many=False, read_only=True)

    class Meta:
        model = Income
        fields = ["id", "title", "amount", "category", "date"]


class ExpenseSerializer(serializers.ModelSerializer):
    category = CategorySerializer(many=False, read_only=True)

    class Meta:
        model = Expense
        fields = ["id", "title", "amount", "category", "date"]


class MonthlyPeriodSerializer(serializers.ModelSerializer):
    monthly_total_planned_incomes_amount = serializers.SerializerMethodField()
    monthly_total_planned_expenses_amount = serializers.SerializerMethodField()
    monthly_total_actual_incomes_amount = serializers.SerializerMethodField()
    monthly_total_actual_expenses_amount = serializers.SerializerMethodField()
    monthly_saved_this_month = serializers.SerializerMethodField()
    monthly_end_balance = serializers.SerializerMethodField()
    income_categories = serializers.SerializerMethodField()
    expense_categories = serializers.SerializerMethodField()
    incomes = serializers.SerializerMethodField()
    expenses = serializers.SerializerMethodField()

    class Meta:
        model = MonthlyPeriod
        fields = [
            "id",
            "title",
            "from_date",
            "to_date",
            "expense_categories",
            "income_categories",
            "incomes",
            "expenses",
            "total_spend",
            "start_balance",
            "monthly_total_planned_incomes_amount",
            "monthly_total_actual_incomes_amount",
            "monthly_total_actual_expenses_amount",
            "monthly_total_planned_expenses_amount",
            "monthly_saved_this_month",
            "monthly_end_balance",
        ]

    def get_income_categories(self, obj):
        incomes_categories = obj.categories.filter(category_type="income")
        return CategorySerializer(incomes_categories, many=True).data

    def get_expense_categories(self, obj):
        expenses_categories = obj.categories.filter(category_type="expense")
        return CategorySerializer(expenses_categories, many=True).data

    def get_incomes(self, obj):
        incomes_categories = obj.categories.filter(category_type="income")
        incomes = []
        for income_category in incomes_categories:
            incomes.extend(list(income_category.incomes_set.all()))
        return IncomeSerializer(incomes, many=True).data

    def get_expenses(self, obj):
        expenses_categories = obj.categories.filter(category_type="expense")
        expenses = []
        for expense_category in expenses_categories:
            expenses.extend(list(expense_category.expenses_set.all()))
        return ExpenseSerializer(expenses, many=True).data

    def get_monthly_total_planned_incomes_amount(self, obj):
        return obj.monthly_total_planned_incomes_amount()

    def get_monthly_total_planned_expenses_amount(self, obj):
        return obj.monthly_total_planned_expenses_amount()

    def get_monthly_total_actual_incomes_amount(self, obj):
        return obj.monthly_total_actual_incomes_amount()

    def get_monthly_total_actual_expenses_amount(self, obj):
        return obj.monthly_total_actual_expenses_amount()

    def get_monthly_saved_this_month(self, obj):
        return obj.monthly_saved_this_month()

    def get_monthly_end_balance(self, obj):
        return obj.monthly_end_balance()


class YearlyPeriodSerializer(serializers.ModelSerializer):
    monthly_periods = MonthlyPeriodSerializer(many=True, read_only=True)

    class Meta:
        model = YearlyPeriod
        fields = ["id", "title", "monthly_periods"]
