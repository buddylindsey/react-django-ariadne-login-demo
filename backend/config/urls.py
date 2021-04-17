"""reactlogindemo URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required


from django.utils.decorators import method_decorator
from django.contrib.auth.mixins import LoginRequiredMixin
from ariadne.contrib.django.views import GraphQLView
from ariadne.contrib.tracing.apollotracing import ApolloTracingExtensionSync
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseForbidden


from graph.schema import schema


@method_decorator(csrf_exempt, name="dispatch")
class BaseGraphQLView(LoginRequiredMixin, GraphQLView):
    extensions = [ApolloTracingExtensionSync]

    def handle_no_permission(self):
        return HttpResponseForbidden()


@login_required
def view(request):
    print(request)
    return HttpResponse("Hello World")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("test/", view),
    path("graphql/", BaseGraphQLView.as_view(schema=schema)),
    path("auth/", include("dj_rest_auth.urls")),
    path("auth/registration/", include("dj_rest_auth.registration.urls")),
]
