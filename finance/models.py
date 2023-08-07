from django.db import models
from django.contrib.auth.models import User
from django.db.models import Sum

class Category(models.Model):
    title = models.CharField(max_length=50)

class Expense(models.Model):
    title = models.CharField(max_length=50)
    planned_amount = models.FloatField(default=0)
    actual_amount = models.FloatField(default=0)
    category = models.ForeignKey(Category, related_name="expenses_set", on_delete=models.CASCADE, null = True)
    date = models.DateTimeField(null = True)

class Income(models.Model):
    title = models.CharField(max_length=50)
    planned_amount = models.FloatField(default=0)
    actual_amount = models.FloatField(default=0)
    category = models.ForeignKey(Category, related_name="incomes_set", on_delete=models.CASCADE, null = True)
    date = models.DateTimeField(null = True)

class MonthlyPeriod(models.Model):
    title = models.CharField(max_length=30)
    from_date = models.DateField(null=True)
    to_date = models.DateField(null=True)
    incomes = models.ManyToManyField(Income, related_name="period_incomes_set")
    expenses = models.ManyToManyField(Expense, related_name="period_expense_set")
    total_spend = models.FloatField(default=0)
    start_balance = models.FloatField(default=0)


    def monthly_total_planned_incomes(self):
        return self.incomes.aggregate(total = Sum('planned_amount'))['total'] or 0
    
    def monthly_total_actual_incomes(self):
        return self.incomes.aggregate(total = Sum('actual_amount'))['total'] or 0
    
    def monthly_total_planned_expenses(self):
        return self.expenses.aggregate(total = Sum('planned_amount'))['total'] or 0
    
    def monthly_total_actual_expenses(self):
        return self.expenses.aggregate(total = Sum('actual_amount'))['total'] or 0
    
    def monthly_saved_this_month(self):
        return self.monthly_total_actual_incomes() - self.monthly_total_actual_expenses()

    def monthly_end_balance(self):
        return self.start_balance + self.monthly_saved_this_month()


class YearlyPeriod(models.Model):
    title = models.CharField(max_length = 30)
    monthly_periods = models.ManyToManyField(MonthlyPeriod, related_name="period_months_set")

    # def total_monthly_expenses(self):
    #     self.monthly_periods.aggregate()
    
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    periods = models.ManyToManyField(YearlyPeriod, related_name="yearly_periods_set")
