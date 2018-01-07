from rest_framework.serializers import ModelSerializer

from authentication.models import SocialUser


class SocialUserSerializer(ModelSerializer):
    class Meta:
        model = SocialUser
        fields = '__all__'

        def create(self, validated_data):
            return SocialUser.objects.create(**validated_data)


