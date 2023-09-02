from django.db import models


class Currency(models.Model):
    title = models.CharField(max_length=50)
    symbol = models.CharField(max_length=50)
    rate = models.FloatField(default=1)
    code = models.CharField(max_length=50)
