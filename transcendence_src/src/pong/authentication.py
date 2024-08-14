from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed

class MultiTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        tokens = request.headers.get('Authorization', '').replace('Token ', '').split(',')
        if not tokens:
            return None

        for token in tokens:
            token = token.strip()
            if not token:
                continue
            try:
                user, _ = self.authenticate_credentials(token)
                return (user, token)
            except AuthenticationFailed:
                continue
        return None
