from django.db import models
from .yearly_period import YearlyPeriod
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    periods = models.ManyToManyField(YearlyPeriod, related_name="yearly_periods_set")
