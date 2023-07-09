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
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Income(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    planned_amount = models.FloatField()
    actual_amount = models.FloatField()
    categories= models.ManyToManyField(Category, related_name="incomes_set")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Period(models.Model):
    title = models.CharField(max_length = 30)
    total_spend = models.FloatField()
    total_income = models.FloatField()
    total_savings = models.FloatField()
    total_saved_this_period = models.FloatField()
    start_balance = models.FloatField()
    end_balance = models.FloatField()
    incomes = models.ManyToManyField(Income, related_name="period_incomes_set")
    expenses = models.ManyToManyField(Expense, related_name="period_expense_set")
