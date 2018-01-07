import json

from channels import Group
from channels.sessions import channel_session
from SocialImpactNetwork.models import LoungeArea, Chat
from SocialImpactNetwork.serializers import ChatSerializer
from authentication.models import SocialUser


@channel_session
def ws_connect(message):
    prefix, label = message['path'].strip('/').split('/')
    room = LoungeArea.objects.get(id=label)
    message.reply_channel.send({"accept": True})
    Group('chat-' + str(label)).add(message.reply_channel)
    message.channel_session['room'] = room.id


@channel_session
def ws_receive(message):
    label = message.channel_session['room']
    room = LoungeArea.objects.get(id=label)
    data = json.loads(message['text'])
    serializer = ChatSerializer(data={'message': data['message']})
    if serializer.is_valid():
        user = SocialUser.objects.get(email=data['email'])
        serializer.save(lounge_area=room, sent_by=user)
    # m = room.messages.create(handle=data['handle'], message=data['message'])
    Group('chat-'+str(label)).send({'text': json.dumps(serializer.data)})


@channel_session
def ws_disconnect(message):
    label = message.channel_session['room']
    message.reply_channel.send({"close": True})
    Group('chat-'+str(label)).discard(message.reply_channel)