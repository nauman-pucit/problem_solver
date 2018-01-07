from authentication.models import SocialUser


class CustomUserAuth(object):

    def authenticate(self, username=None, password=None):
        try:
            user = SocialUser.objects.get(email= username)
            # if user.password == password:
            if user.check_password(password):
                return user


        except SocialUser.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            user = SocialUser.objects.get(pk=user_id)
            if user.is_active:
                return user

        except SocialUser.DoesNotExist:
            return None