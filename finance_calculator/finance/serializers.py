from django.contrib.auth.models import User
from django.forms import ValidationError
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from .models import Period, Expense, Income, Category


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
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
            first_name=validated_data.get('first_name', ""),
            last_name=validated_data.get('last_name', "")
        )
        
        user.set_password(validated_data['password'])
        user.save()

        return user
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model: Category
        fields = ['id', 'title', 'description']

class IncomeSerializer(serializers.ModelSerializer): 
    categories = CategorySerializer(many = True, read_only = True)
    class Meta:
        model = Income
        fields = ['id', 'title', 'description', 'planned_amount', 'actual_amount', 'categories', 'created_at', 'updated_at', 'user']

class ExpenseSerializer(serializers.ModelSerializer): 
    categories = CategorySerializer(many = True, read_only = True)
    class Meta:
        model = Expense
        fields = ['id', 'title', 'description', 'planned_amount', 'actual_amount', 'categories', 'created_at', 'updated_at', 'user']
    

class PeriodSerializer(serializers.ModelSerializer): 
    incomes = IncomeSerializer(many=True, read_only=True)
    expenses = ExpenseSerializer(many=True, read_only=True)

    class Meta:
        model = Period
        fields = ['id', 'title', 'total_spend', 'total_income', 'total_savings', 'total_saved_this_period', 'start_balance', 'end_balance', 'incomes', 'expenses']

