from django.db import models


class YearlyPeriod(models.Model):
    title = models.CharField(max_length=30)
    monthly_periods = models.ManyToManyField(
        to="finance.monthlyperiod",
        related_name="period_months_set",
    )

    def __str__(self):
        return str(self.title)

    def total_saved(self):
        monthly_periods = self.monthly_periods.all()
        total = 0
        for monthly_period in monthly_periods:
            total += monthly_period.monthly_saved_this_month()
        return total
