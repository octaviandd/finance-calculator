from django.db import models

CATEGORY_TYPE_CHOICES = (
    ("income", "Income"),
    ("expense", "Expense"),
)


class Category(models.Model):
    title = models.CharField(max_length=50)
    planned_amount = models.FloatField(default=0)
    category_type = models.CharField(
        max_length=10, choices=CATEGORY_TYPE_CHOICES, default="income"
    )

    def actual_amount(self):
        if self.category_type == "income":
            return self.incomes_set.aggregate(total=models.Sum("amount"))["total"] or 0
        else:
            return self.expenses_set.aggregate(total=models.Sum("amount"))["total"] or 0
