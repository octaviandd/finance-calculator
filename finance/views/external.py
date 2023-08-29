from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
import freecurrencyapi
from dotenv import load_dotenv


load_dotenv(".env")


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_currency_exchange(request):
    client = freecurrencyapi.Client(os.getenv("FREE_CURRENCY_API"))
    result = client.latest(base_currency="GBP", currencies=["EUR", "USD"])

    return Response(result, status=200)
