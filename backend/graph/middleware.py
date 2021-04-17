from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import AnonymousUser


from dj_rest_auth.jwt_auth import JWTCookieAuthentication


class JWTAuthMiddleware(JWTCookieAuthentication, MiddlewareMixin):
    def __call__(self, request):
        if hasattr(request, "user") and not isinstance(request.user, AnonymousUser):
            return self.get_response(request)

        auth_user = self.authenticate(request)
        if isinstance(auth_user, tuple):
            request.user = auth_user[0]
        elif auth_user:
            request.user = auth_user
        else:
            request.user = AnonymousUser()
        return self.get_response(request)
