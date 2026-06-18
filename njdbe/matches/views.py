from rest_framework import viewsets, permissions, generics
from .models import Match, MatchSummary, MatchPhoto
from .serializers import MatchSerializer, MatchSummarySerializer, MatchPhotoSerializer
from accounts.permissions import IsAdminOrReadOnly, IsAdminRole


class MatchViewSet(viewsets.ModelViewSet):
    """
    Public read access to all matches.
    Admin can create/update/delete matches.
    Filter by ?status=upcoming or ?status=played
    """
    queryset = Match.objects.all().order_by('date')
    serializer_class = MatchSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        if status_param in ('upcoming', 'played'):
            qs = qs.filter(status=status_param)
        return qs


class MatchSummaryView(generics.RetrieveUpdateAPIView):
    """Admin: create/update the summary for a given match (match_id)."""
    queryset = MatchSummary.objects.all()
    serializer_class = MatchSummarySerializer
    permission_classes = [IsAdminRole]
    lookup_field = 'match_id'

    def get_object(self):
        match_id = self.kwargs['match_id']
        summary, _ = MatchSummary.objects.get_or_create(match_id=match_id)
        return summary


class MatchPhotoViewSet(viewsets.ModelViewSet):
    """List/upload/delete photos for matches. ?match=<id> to filter."""
    queryset = MatchPhoto.objects.all().order_by('-uploaded_at')
    serializer_class = MatchPhotoSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        match_id = self.request.query_params.get('match')
        if match_id:
            qs = qs.filter(match_id=match_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
