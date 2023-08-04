from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=20)

class Expense(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    planned_amount = models.FloatField()
    actual_amount = models.FloatField()
    categories= models.ManyToManyField(Category, related_name="expenses_set")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Income(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    planned_amount = models.FloatField()
    actual_amount = models.FloatField()
    categories= models.ManyToManyField(Category, related_name="incomes_set")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class MonthlyPeriod(models.Model):
    title = models.CharField(max_length=30)
    from_date = models.DateField(null=True)
    to_date = models.DateField(null=True)
    incomes = models.ManyToManyField(Income, related_name="period_incomes_set")
    expenses = models.ManyToManyField(Expense, related_name="period_expense_set")
    total_spend = models.FloatField(default=0)
    total_income = models.FloatField(default=0)
    total_savings = models.FloatField(default=0)
    total_saved_this_period = models.FloatField(default=0)
    start_balance = models.FloatField(default=0)
    end_balance = models.FloatField(default=0)


class YearlyPeriod(models.Model):
    title = models.CharField(max_length = 30)
    monthly_periods = models.ManyToManyField(MonthlyPeriod, related_name="period_months_set")
    
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    periods = models.ManyToManyField(YearlyPeriod, related_name="yearly_periods_set")
