from django.db import models
from .category import Category


class MonthlyPeriod(models.Model):
    title = models.CharField(max_length=30)
    from_date = models.DateField(null=True)
    to_date = models.DateField(null=True)
    categories = models.ManyToManyField(Category, related_name="monthly_categories")
    total_spend = models.FloatField(default=0)
    start_balance = models.FloatField(default=0)

    def monthly_total_planned_expenses_amount(self):
        return (
            self.categories.filter(category_type="expense").aggregate(
                total=models.Sum("planned_amount")
            )["total"]
            or 0
        )

    def monthly_total_planned_incomes_amount(self):
        return (
            self.categories.filter(category_type="income").aggregate(
                total=models.Sum("planned_amount")
            )["total"]
            or 0
        )

    def monthly_total_actual_expenses_amount(self):
        total = 0
        for category in self.categories.filter(category_type="expense"):
            total += category.actual_amount()
        return total

    def monthly_total_actual_incomes_amount(self):
        total = 0
        for category in self.categories.filter(category_type="income"):
            total += category.actual_amount()
        return total

    def monthly_saved_this_month(self):
        return (
            self.monthly_total_actual_incomes_amount()
            - self.monthly_total_actual_expenses_amount()
        )

    def monthly_end_balance(self):
        return self.start_balance + self.monthly_saved_this_month()
