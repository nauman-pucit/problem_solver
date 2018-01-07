import json
import datetime

from allauth.socialaccount.models import SocialAccount
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.views.generic import View
from rest_framework import status
from rest_framework import views
from rest_framework import viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from django.shortcuts import render

from authentication.models import SocialUser
from authentication.serializers import SocialUserSerializer


class CheckEmailExist(views.APIView):
    """
    this class defines view which checks during signup that if email exists
    """

    def post(self, request):
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        if request.method == "POST":
            email = body['email']

        count = SocialUser.objects.filter(email=email).count()
        if count == 0:
            return HttpResponse(False)
        else:
            return HttpResponse(True)


class SignInAuthenticate(views.APIView):
    """
    This class handles request for signIn authentication
    """

    def post(self, request):
        """
            This function handles the request for authenticating the user
            :param request: request contains data information for a new user
            :return: returns "welcome" if user exists, "wrong username or password" if user does not exists and an
            error message is exception occures
            """

        if request.method == "POST":
            user_name = request.data['user_name']
            password = request.data['password']
            # auth = CustomUserAuth()
            user = authenticate(username=user_name, password=password)

            if user is not None:
                login(request, user)
                serialized = SocialUserSerializer(user)
                return Response(serialized.data)

            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'Username/password combination invalid.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)


class Logout(views.APIView):
    """
    this class is a view to logout a user
    """

    def post(self, request):
        """
        this method logout a user, clean all sassions associated wiith that user
        :param request:
        :return: in return it redirects to the index page of the application
        """
        if request.user:
            logout(request)
            return Response({}, status=status.HTTP_204_NO_CONTENT)


class AllUsersViewSet(viewsets.ModelViewSet):
    queryset = SocialUser.objects.all()
    serializer_class = SocialUserSerializer

    def create(self, request, *args, **kwargs):
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        if request.method == "POST":
            body['username'] = "username %s" % str(datetime.datetime.now())
            body['is_admin'] = False
            try:
                serializer = SocialUserSerializer(data=body)
                if serializer.is_valid():
                    user = serializer.save()
                    user.set_password(body['password'])
                    user.save()
                    user = authenticate(username=body['email'], password=body['password'])
                    if user is not None:
                        login(request, user)
                        return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
                else:
                    return Response({
                        'status': 'Bad request',
                        'message': 'Account could not be created with received data.'
                    }, status=status.HTTP_400_BAD_REQUEST)

            except Exception as e:
                return Response({
                    'status': 'Bad request',
                    'message': 'Account could not be created with received data.'
                }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        user = SocialUser.objects.get(id=request.user.id)
        request.data['anonymity'] = json.loads(request.data['anonymity'])
        request.data['moderation'] = json.loads(request.data['moderation'])
        request.data['is_admin'] = json.loads(request.data['is_admin'])
        serializer = self.serializer_class(data=request.data)
        user = serializer.update(user, request.data)
        if request.FILES:
            user.avatar = request.FILES['image']
            user.save()
        if request.data['current_password']:
            social_user = authenticate(username=request.user.email, password=request.data['current_password'])
            if social_user is not None:
                user.set_password(request.data['new_password'])
                user.save()
                serializer = SocialUserSerializer(user)
                return Response(serializer.data)
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'Username/password combination invalid.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            serializer = self.serializer_class(user)
            return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        if request.user.is_active:
            queryset = SocialUser.objects.all()
            user = get_object_or_404(queryset, id=request.user.id)
            serializer = SocialUserSerializer(user)
            return HttpResponse(json.dumps(serializer.data))
        else:
            return HttpResponse(json.dumps({'not_active': True}))


class CreateSuperUser(views.APIView):

    def post(self, request):
        user = SocialUser.objects.get(id=request.data['id'])
        user.is_admin = not user.is_admin
        user.save()
        return Response({"saved"})


def is_social_account(request):
    if SocialAccount.objects.filter(user_id=request.user.id).count() != 0:
        return HttpResponse(json.dumps({
            'is_social_account': True
        }))
    else:
        return HttpResponse(json.dumps({
            'is_social_account': False
        }))