from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from django.dispatch import receiver
from django.contrib.auth import authenticate, login
from ..serializers import UserSerializer
from django.db.models.signals import post_save
from ..models import Profile, YearlyPeriod, MonthlyPeriod, User
from rest_framework.permissions import AllowAny
import calendar
from datetime import datetime, date
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.contrib.auth.models import User
from ..models.currency import Currency

# AUTH ROUTES #


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def custom_register(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if User.objects.filter(username=username).exists():
        return Response({"message": "Username already taken."}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({"message": "Email already taken."}, status=400)
    
    currency = Currency.objects.get(id=1)
    request.session["currency"] = {
        "id": currency.id,
        "title": currency.title,
        "label": currency.label,
        "symbol": currency.symbol,
        "rate": currency.rate,
        "code": currency.code,
    }

    User.objects.create_user(username, email, password)

    return Response({"message": "User registered successfully."}, status=201)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        profile = Profile.objects.create(user=instance)

        yearly_period = YearlyPeriod.objects.create(title=datetime.now().year)
        profile.periods.add(yearly_period)

        for index, month in enumerate(calendar.month_name[1:], 1):
            _, last_day = calendar.monthrange(datetime.now().year, index)
            from_date = date(datetime.now().year, index, 1)
            to_date = date(datetime.now().year, index, last_day)
            monthly_period = MonthlyPeriod.objects.create(
                title=month, from_date=from_date, to_date=to_date
            )
            default_expenses = [
                "Food",
                "Gifts",
                "Health/medical",
                "Home",
                "Transportation",
                "Personal",
                "Pets",
                "Utilities",
                "Travel",
                "Debt",
            ]
            default_incomes = [
                "Savings",
                "Paychecks",
                "Bonus",
                "Interest",
                "Gifts",
                "Other",
            ]

            yearly_period.monthly_periods.add(monthly_period)


@api_view(["POST"])
@permission_classes([AllowAny])
def custom_login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return Response({"status": "logged in"}, status=200)

    return Response({"error": "Invalid credentials"}, status=400)


@api_view(["POST"])
@permission_classes([AllowAny])
def logout(request):
    logout(request)
    return Response({"status": "logged out"}, status=200)


@api_view(["POST"])
@permission_classes([AllowAny])
def get_csrf_token(request):
    token = get_token(request)
    return Response({"csrfToken": token})


@api_view(["GET"])
@permission_classes([AllowAny])
def get_user(request):
    print(request.user.is_authenticated)
    if request.user.is_authenticated:
        serializer = UserSerializer(request.user)
        return Response(serializer.data, 200)

    return Response({"message": "User is not authenticated"}, 401)


# AUTH ROUTES #
