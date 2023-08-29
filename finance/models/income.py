from django.core.exceptions import ValidationError
from . import Category
from django.db import models


class Income(models.Model):
    title = models.CharField(max_length=50)
    amount = models.FloatField(default=0)
    category = models.ForeignKey(
        Category, related_name="incomes_set", on_delete=models.CASCADE, null=True
    )
    date = models.DateTimeField(null=True)

    def clean(self):
        if self.category.category_type != "income":
            raise ValidationError("The category must be of type expense.")
