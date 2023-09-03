from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from ..serializers import MonthlyPeriodSerializer
from ..models import MonthlyPeriod


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_monthly_period(request, id):
    monthly_period = MonthlyPeriod.objects.get(id=id)
    currency = request.session.get("currency")
    serializer = MonthlyPeriodSerializer(
        monthly_period, context={"currency": currency}, many=False
    )
    return Response(serializer.data, status=200)


@api_view(["POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def update_monthly_starting_balance(request, id):
    currency = request.session.get("currency")
    start_balance = round(request.data.get("amount") / currency['rate'], 2)
    monthly_period = MonthlyPeriod.objects.get(pk=id)

    try:
        monthly_period.start_balance = start_balance
        monthly_period.save()
    except (IntegrityError, ValidationError, AttributeError) as e:
        raise e

    return Response({"message": "Start balance updated."}, status=200)
