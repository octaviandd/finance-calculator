from django.db import models
from . import MonthlyPeriod

class YearlyPeriod(models.Model):
    title = models.CharField(max_length = 30)
    monthly_periods = models.ManyToManyField(MonthlyPeriod, related_name="period_months_set")
