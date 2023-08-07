from django.contrib.auth.models import User
from django.forms import ValidationError
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from .models import YearlyPeriod, MonthlyPeriod, Expense, Income, Category


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

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
            username=validated_data['username'],
            email=validated_data['email'],
        )
        
        user.set_password(validated_data['password'])
        user.save()

        return user
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title', 'description']

class IncomeSerializer(serializers.ModelSerializer): 
    category = CategorySerializer(many = False, read_only = True)
    class Meta:
        model = Income
        fields = ['id', 'title', 'description', 'planned_amount', 'actual_amount', 'category', 'date']

class ExpenseSerializer(serializers.ModelSerializer): 
    category = CategorySerializer(many = False, read_only = True)
    class Meta:
        model = Expense
        fields = ['id', 'title', 'description', 'planned_amount', 'actual_amount', 'category', 'date']
    

class MonthlyPeriodSerializer(serializers.ModelSerializer):
    incomes = IncomeSerializer(many=True, read_only=True)
    expenses = ExpenseSerializer(many=True, read_only=True)

    monthly_total_planned_incomes = serializers.SerializerMethodField()
    monthly_total_planned_expenses = serializers.SerializerMethodField()
    monthly_total_actual_incomes = serializers.SerializerMethodField()
    monthly_total_actual_expenses = serializers.SerializerMethodField()
    monthly_saved_this_month = serializers.SerializerMethodField()
    monthly_end_balance = serializers.SerializerMethodField()
    class Meta:
        model = MonthlyPeriod
        fields = ['id', 'title', 'from_date', 'to_date', 'incomes', 'expenses', 'total_spend', 'start_balance',
                  'monthly_total_planned_incomes', 'monthly_total_actual_incomes', 
                  'monthly_total_actual_expenses', 'monthly_total_planned_expenses',
                  'monthly_saved_this_month', 'monthly_end_balance']

    def get_monthly_total_planned_incomes(self, obj):
        return obj.monthly_total_planned_incomes()
    
    def get_monthly_total_planned_expenses(self, obj):
        return obj.monthly_total_planned_expenses()
    
    def get_monthly_total_actual_incomes(self, obj):
        return obj.monthly_total_actual_incomes()
    
    def get_monthly_total_actual_expenses(self, obj):
        return obj.monthly_total_actual_expenses()
    
    def get_monthly_saved_this_month(self, obj):
        return obj.monthly_saved_this_month()
    
    def get_monthly_end_balance(self, obj):
        return obj.monthly_end_balance()


class YearlyPeriodSerializer(serializers.ModelSerializer): 
    monthly_periods = MonthlyPeriodSerializer(many=True, read_only=True)

    class Meta:
        model = YearlyPeriod
        fields = ['id', 'title', 'monthly_periods']

