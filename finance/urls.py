from django.urls import path

from . import views

urlpatterns = [
    path("register", views.register, name="register"),
    path("login", views.login, name="login"),
    path('spreadsheets', views.get_periods, name="periods"),
    path('spreadsheets/<int:id>', views.get_period, name="period"),
    path('spreadsheets/<int:id>/edit', views.get_spreadsheet_data, name="spreadsheet_data")
]