from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from ..helpers.currency import CurrencyConvertor
from dotenv import load_dotenv


@api_view(["POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_currency_exchange(request):
    currencyId = request.data
    currency_convertor = CurrencyConvertor()
    values = currency_convertor.fetch_exchange_rates()

    return Response(values, status=200)
