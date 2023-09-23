from django.urls import path

from .views import (
    categories,
    monthly_periods,
    yearly_periods,
    auth,
    currency,
    income,
    expense,
)

urlpatterns = [
    path("register", auth.custom_register, name="register"),
    path("login", auth.custom_login, name="login"),
    path("logout", auth.custom_logout, name="logout"),
    path("csrf", auth.get_csrf_token, name="csrf"),
    path("user", auth.get_user, name="user"),
    path("yearly-periods", yearly_periods.get_yearly_periods, name="yearly_periods"),
    path(
        "yearly-period-create",
        yearly_periods.create_yearly_period,
        name="create_yearly_periods",
    ),
    path(
        "monthly-period/<int:id>/",
        monthly_periods.get_monthly_period,
        name="monthly_period",
    ),
    path(
        "monthly-period/<int:id>/edit",
        monthly_periods.get_monthly_period,
        name="monthly_period_edit",
    ),
    path(
        "monthly-period/<int:id>/update-starting-balance",
        monthly_periods.update_monthly_starting_balance,
        name="monthly_starting_balance",
    ),
    path("monthly-period/<int:id>/save-incomes", income.create_income, name="create"),
    path(
        "monthly-period/<int:id>/delete-incomes",
        income.delete_income,
        name="delete_income",
    ),
    path(
        "monthly-period/<int:id>/save-expenses",
        expense.create_expense,
        name="create_expense",
    ),
    path(
        "monthly-period/<int:id>/delete-expenses",
        expense.delete_expense,
        name="delete_expense",
    ),
    path(
        "category/<int:id>/update-planned-amount",
        categories.update_category_planned_amount,
        name="update_category_planned_amount",
    ),
    path("categories", categories.get_categories, name="categories"),
    path(
        "monthly-period/<int:id>/create-category",
        categories.create_category,
        name="create-category",
    ),
    path(
        "monthly-period/<int:id>/delete-category",
        categories.delete_category,
        name="delete-category",
    ),
    path(
        "set-currency",
        currency.set_currency,
        name="get_currencies",
    ),
    path(
        "get-currencies",
        currency.get_currencies,
        name="set_currency",
    ),
]
