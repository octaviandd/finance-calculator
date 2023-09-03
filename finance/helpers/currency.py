import os
import freecurrencyapi
from dotenv import load_dotenv
from ..models.currency import Currency

load_dotenv(".env")


class CurrencyConvertor:
    def set_exchange_rate(self, request, currency_id):
        self.update_currencies()
        currency = Currency.objects.get(id=currency_id)
        request.session["currency"] = {
            "id": currency.id,
            "title": currency.title,
            "label": currency.label,
            "symbol": currency.symbol,
            "rate": currency.rate,
            "code": currency.code,
        }

        request.session.save()

    def update_currencies(self):
        base_currency = "GBP"
        currencies = ["EUR", "USD"]

        try:
            client = freecurrencyapi.Client(os.getenv("FREE_CURRENCY_API"))
            result = client.latest(base_currency=base_currency, currencies=currencies)
            Currency.objects.filter(code=result["data"])
            for currency, rate in result["data"].items():
                Currency.objects.filter(code=currency.lower()).update(
                    rate=round(rate, 2)
                )
            return result
        except Exception as e:
            print(f"Error fetching exchange rates: {e}")
            return None
