from rest_framework import serializers
from .models import PlayerProfile, PlayerDocument
from accounts.serializers import UserSerializer


class PlayerDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerDocument
        fields = ['id', 'doc_type', 'file', 'status', 'uploaded_at']
        read_only_fields = ['status', 'uploaded_at']


class PlayerDocumentAdminSerializer(serializers.ModelSerializer):
    player = serializers.SerializerMethodField()

    class Meta:
        model = PlayerDocument
        fields = ['id', 'player', 'doc_type', 'file', 'status', 'uploaded_at']
        read_only_fields = ['uploaded_at']

    def get_player(self, obj):
        return {
            'id': obj.player.id,
            'user': {'username': obj.player.user.username},
        }


class PlayerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    documents = PlayerDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = PlayerProfile
        fields = [
            'id', 'user', 'photo', 'position', 'jersey_number', 'dob', 'bio',
            'goals', 'assists', 'matches_played', 'yellow_cards', 'red_cards',
            'documents',
        ]


class PlayerProfileUpdateSerializer(serializers.ModelSerializer):
    """Used by a player to update their own profile info."""
    class Meta:
        model = PlayerProfile
        fields = ['photo', 'position', 'jersey_number', 'dob', 'bio']


class PlayerStatsAdminSerializer(serializers.ModelSerializer):
    """Used by admin to update a player's stats and verification info."""
    class Meta:
        model = PlayerProfile
        fields = [
            'id', 'photo', 'position', 'jersey_number', 'dob', 'bio',
            'goals', 'assists', 'matches_played', 'yellow_cards', 'red_cards',
        ]
