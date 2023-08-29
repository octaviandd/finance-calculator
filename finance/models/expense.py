from django.db import models
from . import Category
from django.core.exceptions import ValidationError


class Expense(models.Model):
    title = models.CharField(max_length=50)
    amount = models.FloatField(default=0)
    category = models.ForeignKey(
        Category, related_name="expenses_set", on_delete=models.CASCADE, null=True
    )
    date = models.DateTimeField(null=True)

    def clean(self):
        if self.category.category_type != "expense":
            raise ValidationError("The category must be of type expense.")
