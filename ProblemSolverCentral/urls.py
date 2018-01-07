"""ProblemSolverCentral URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic.base import RedirectView
from rest_framework import routers

from authentication.views import SignInAuthenticate, Logout, CheckEmailExist, \
    AllUsersViewSet, CreateSuperUser

router = routers.DefaultRouter()
router.register(r'all_user_accounts', AllUsersViewSet)
urlpatterns = [
    url(r'^$', RedirectView.as_view(url='social_network/')),
    url(r'^social_network/', include('SocialImpactNetwork.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^sign_up/$', AllUsersViewSet.as_view({'post': 'create'}), name='sign_up'),
    url(r'^check_email_exist/$', CheckEmailExist.as_view(), name='check_email_exist'),
    url(r'^user_account/$', AllUsersViewSet.as_view({'post': 'retrieve'}), name='user_account'),
    url(r'^update_user_account/$', AllUsersViewSet.as_view({'post': 'update'}), name='update_user_account'),
    url(r'^sign_in_authenticate/$', SignInAuthenticate.as_view(), name='sign_in_authenticate'),
    url(r'^log_out/$', Logout.as_view(), name='log_out'),
    url(r'^change_role/$', CreateSuperUser.as_view(), name='change_user_role'),

]
urlpatterns += router.urls

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
