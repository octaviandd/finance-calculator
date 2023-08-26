from django.db import models
from django.contrib.auth.models import User
from django.db.models import Sum
from django.core.exceptions import ValidationError

CATEGORY_TYPE_CHOICES = (
    ('income', 'Income'),
    ('expense', 'Expense'),
)
class Category(models.Model):
    title = models.CharField(max_length=50)
    planned_amount = models.FloatField(default=0)
    category_type = models.CharField(max_length=10, choices=CATEGORY_TYPE_CHOICES, default='income')

    def actual_amount(self):
        return self.expenses_set.aggregate(total = Sum('amount'))['total'] or 0

class Expense(models.Model):
    title = models.CharField(max_length=50)
    amount = models.FloatField(default=0)
    category = models.ForeignKey(Category, related_name="expenses_set", on_delete=models.CASCADE, null = True)
    date = models.DateTimeField(null = True)

    def clean(self):
        if(self.category.category_type != 'expense'):
            raise ValidationError('The category must be of type expense.')

class Income(models.Model):
    title = models.CharField(max_length=50)
    amount = models.FloatField(default=0)
    category = models.ForeignKey(Category, related_name="incomes_set", on_delete=models.CASCADE, null = True)
    date = models.DateTimeField(null = True)

    def clean(self):
        if(self.category.category_type != 'income'):
            raise ValidationError('The category must be of type expense.')

class MonthlyPeriod(models.Model):
    title = models.CharField(max_length=30)
    from_date = models.DateField(null=True)
    to_date = models.DateField(null=True)
    categories = models.ManyToManyField(Category, related_name='monthly_categories')
    total_spend = models.FloatField(default=0)
    start_balance = models.FloatField(default=0)

    def monthly_total_planned_expenses_amount(self):
        return self.categories.filter(category_type='expense').aggregate(total = Sum('planned_amount'))['total'] or 0
    
    def monthly_total_planned_incomes_amount(self):
        return self.categories.filter(category_type='income').aggregate(total = Sum('planned_amount'))['total'] or 0
    
    def monthly_total_actual_expenses_amount(self):
        total = 0
        for category in self.categories.filter(category_type = 'expense'):
            total += category.expenses_set.aggregate(total = Sum('amount'))['total'] or 0
        return total
    
    def monthly_total_actual_incomes_amount(self):
        total = 0
        for category in self.categories.filter(category_type = 'expense'):
            total += category.incomes_set.aggregate(total = Sum('amount'))['total'] or 0
        return total
    
    def monthly_saved_this_month(self):
        return self.monthly_total_actual_incomes_amount() - self.monthly_total_actual_expenses_amount()

    def monthly_end_balance(self):
        return self.start_balance + self.monthly_saved_this_month()


class YearlyPeriod(models.Model):
    title = models.CharField(max_length = 30)
    monthly_periods = models.ManyToManyField(MonthlyPeriod, related_name="period_months_set")

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    periods = models.ManyToManyField(YearlyPeriod, related_name="yearly_periods_set")
