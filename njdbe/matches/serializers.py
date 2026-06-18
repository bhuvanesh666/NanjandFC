from rest_framework import serializers
from .models import Match, MatchSummary, MatchPhoto


class MatchPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchPhoto
        fields = ['id', 'match', 'image', 'uploaded_by', 'uploaded_at']
        read_only_fields = ['uploaded_by', 'uploaded_at']


class MatchSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchSummary
        fields = [
            'id', 'home_score', 'away_score', 'scorers', 'assists',
            'yellow_cards', 'red_cards', 'substitutions', 'possession',
            'shots_on_target', 'fouls', 'man_of_the_match',
        ]


class MatchSerializer(serializers.ModelSerializer):
    summary = MatchSummarySerializer(read_only=True)
    photos = MatchPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Match
        fields = [
            'id', 'opponent', 'date', 'venue', 'competition', 'status',
            'summary', 'photos',
        ]
