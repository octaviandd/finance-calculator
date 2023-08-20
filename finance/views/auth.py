from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from ..serializers import UserSerializer
from django.db.models.signals import post_save
from ..models import Profile, YearlyPeriod, MonthlyPeriod, User
from rest_framework.permissions import AllowAny
import calendar
import datetime

# AUTH ROUTES #

@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.create_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )
        return Response(UserSerializer(user).data, status=201)
    else:
        return Response(serializer.errors, status=400)
    
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if(created):
        profile = Profile.objects.create(user=instance)
    
        yearly_period = YearlyPeriod.objects.create(title=datetime.now().year)
        profile.periods.add(yearly_period)

        for index, month in enumerate(calendar.month_name[1:], 1):
            _, last_day = calendar.monthrange(datetime.now().year, index)
            from_date = datetime(datetime.now().year, index, 1).date()
            to_date = datetime(datetime.now().year, index, last_day).date()
            monthly_period = MonthlyPeriod.objects.create(title = month, from_date = from_date, to_date = to_date)
            default_expenses = ['Food', 'Gifts', 'Health/medical', 'Home', 'Transportation', 'Personal', 'Pets', 'Utilities', 'Travel', 'Debt']
            default_incomes = ['Savings', 'Paychecks', 'Bonus', 'Interest', 'Gifts', 'Other']

            yearly_period.monthly_periods.add(monthly_period)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    User = get_user_model()

    try:
        user = User.objects.get(email = email)
    except User.DoesNotExist:
        return Response({"error": "Invalid credentials"} , status = 400)

    if not user.check_password(password):
        return Response({"error": "Invalid credentials"} , status = 400)

    token, _ = Token.objects.get_or_create(user = user)
    return Response({'token' : token.key}, status = 200)

# AUTH ROUTES #