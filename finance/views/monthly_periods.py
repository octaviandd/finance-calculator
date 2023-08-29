from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from ..serializers import MonthlyPeriodSerializer
from ..models import MonthlyPeriod


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_monthly_period(request, id):
    monthly_period = MonthlyPeriod.objects.get(id=id)
    serializer = MonthlyPeriodSerializer(monthly_period, many=False)
    return Response(serializer.data, status=200)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edit_monthly_period(request, id):
    yearly_period = MonthlyPeriod.objects.get(id=id)
    serializer = MonthlyPeriodSerializer(yearly_period, many=False)
    return Response(serializer.data, status=200)


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_monthly_starting_balance(request, id):
    print(request.data)
    start_balance = request.data.get("amount")
    monthly_period = MonthlyPeriod.objects.get(pk=id)

    try:
        monthly_period.start_balance = start_balance
        monthly_period.save()
    except (IntegrityError, ValidationError, AttributeError) as e:
        raise e

    return Response({"message": "Start balance updated."}, status=200)
