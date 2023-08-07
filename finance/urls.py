from django.urls import path

from . import views

urlpatterns = [
    path("register", views.register, name="register"),
    path("login", views.login, name="login"),
    path('yearly-periods', views.get_yearly_periods, name="yearly_periods"),
    path('yearly-period-create', views.create_yearly_period, name="create_yearly_periods"),
    path('monthly-period/<int:id>/', views.get_monthly_period, name="monthly_period"),
    path('monthly-period/<int:id>/edit', views.edit_monthly_period, name="monthly_period_edit"),
    path('monthly-period/<int:id>/save-income', views.create_monthly_period_income, name="monthly_period_income"),
    path('monthly-period/<int:id>/save-expense', views.create_monthly_period_expense, name="monthly_period_expense"),
    path('monthly-period/<int:id>/update-starting-balance', views.update_monthly_starting_balance, name="monthly_starting_balance"),
    path('categories', views.get_categories, name="categories"),

    path('currency-exchange', views.get_currency_exchange, name="get_currency_exchange")
]