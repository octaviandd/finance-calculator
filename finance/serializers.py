from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import YearlyPeriod, MonthlyPeriod, Expense, Income, Category, Currency


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}


class CategorySerializer(serializers.ModelSerializer):
    actual_amount = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "title", "planned_amount", "category_type", "actual_amount"]

    def actual_amount(self, obj):
        currency = self.context.get("currency", None)
        return round(obj.actual_amount() * currency['rate'], 2)


class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ["id", "title", "amount", "category", "date"]


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ["id", "title", "amount", "category", "date"]


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = ["id", "title", "symbol", "code", "rate"]


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

    def _convert_to_currency(self, amount):
        currency = self.context.get("currency", None)
        if(currency is None):
            return round(amount, 2)
        return round(amount * currency['rate'], 2)

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
        return self._convert_to_currency(obj.monthly_total_planned_incomes_amount())

    def get_monthly_total_planned_expenses_amount(self, obj):
        return self._convert_to_currency(obj.monthly_total_planned_expenses_amount())

    def get_monthly_total_actual_incomes_amount(self, obj):
        return self._convert_to_currency(obj.monthly_total_actual_incomes_amount())

    def get_monthly_total_actual_expenses_amount(self, obj):
        return self._convert_to_currency(obj.monthly_total_actual_expenses_amount())

    def get_monthly_saved_this_month(self, obj):
        return self._convert_to_currency(obj.monthly_saved_this_month())

    def get_monthly_end_balance(self, obj):
        return self._convert_to_currency(obj.monthly_end_balance())


class YearlyPeriodSerializer(serializers.ModelSerializer):
    monthly_periods = MonthlyPeriodSerializer(many=True, read_only=True)
    total_saved = serializers.SerializerMethodField()

    class Meta:
        model = YearlyPeriod
        fields = ["id", "title", "monthly_periods", "total_saved"]

    def get_total_saved(self, obj):
        currency = self.context.get("currency", None)
        return round(obj.total_saved() * currency['rate'], 2)
