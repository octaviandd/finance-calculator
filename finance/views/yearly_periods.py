from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..serializers import YearlyPeriodSerializer
from ..models import Profile, YearlyPeriod, MonthlyPeriod
from django.db import IntegrityError
from django.core.exceptions import ValidationError
import calendar
from datetime import datetime


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_yearly_periods(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)
    yearly_periods = profile.periods.all()
    currency = request.session.get("currency")
    serializer = YearlyPeriodSerializer(
        yearly_periods, context={"currency": currency}, many=True
    )
    return Response(serializer.data, status=200)


@api_view(["POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def create_yearly_period(request):
    currency = request.session.get("currency")
    payload = request.data
    previous_year = payload.get("previousYear", None)
    user = request.user

    profile, _ = Profile.objects.get_or_create(user=user)
    year = int(previous_year) + 1
    try:
        yearly_period = YearlyPeriod.objects.create(title=str(year))
        for index, month in enumerate(calendar.month_name[1:], 1):
            _, last_day = calendar.monthrange(year, index)
            from_date = datetime(year, index, 1).date()
            to_date = datetime(year, index, last_day).date()
            monthly_period = MonthlyPeriod.objects.create(
                title=month, from_date=from_date, to_date=to_date
            )
            yearly_period.monthly_periods.add(monthly_period)

        profile.periods.add(yearly_period)
    except (IntegrityError, ValidationError, AttributeError) as e:
        raise e

    serializer = YearlyPeriodSerializer(yearly_period, context={"currency": currency}, many = False)
    return Response(serializer.data, status=200)
