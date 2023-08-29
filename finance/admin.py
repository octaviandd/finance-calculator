from django.contrib import admin
from .models import Expense, Income, Category, YearlyPeriod, MonthlyPeriod, Profile

# Register your models here.

admin.site.register(Expense)
admin.site.register(Income)
admin.site.register(Category)
admin.site.register(Profile)
admin.site.register(YearlyPeriod)
admin.site.register(MonthlyPeriod)
