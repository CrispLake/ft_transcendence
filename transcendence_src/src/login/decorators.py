from functools import wraps
from django.utils import timezone
from .models import Account

def update_last_activity(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if request.user.is_authenticated:
            try:
                account = Account.objects.get(user=request.user)
                account.last_activity = timezone.now()
                account.save()
            except Account.DoesNotExist:
                pass
        return view_func(request, *args, **kwargs)
    return _wrapped_view