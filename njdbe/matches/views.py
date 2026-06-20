from rest_framework import viewsets, generics
from .models import Match, MatchSummary, MatchPhoto
from .serializers import MatchSerializer, MatchSummarySerializer, MatchPhotoSerializer
from accounts.permissions import IsAdminOrReadOnly, IsAdminRole

class MatchViewSet(viewsets.ModelViewSet):
    serializer_class   = MatchSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = Match.objects.select_related('summary').prefetch_related('photos').all().order_by('date')
        s  = self.request.query_params.get('status')
        search = self.request.query_params.get('search')
        if s in ('upcoming', 'played'):
            qs = qs.filter(status=s)
        if search:
            qs = qs.filter(opponent__icontains=search)
        return qs

class MatchSummaryView(generics.RetrieveUpdateAPIView):
    serializer_class   = MatchSummarySerializer
    permission_classes = [IsAdminRole]
    lookup_field       = 'match_id'

    def get_object(self):
        summary, _ = MatchSummary.objects.get_or_create(match_id=self.kwargs['match_id'])
        return summary

class MatchPhotoViewSet(viewsets.ModelViewSet):
    serializer_class   = MatchPhotoSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = MatchPhoto.objects.select_related('match', 'uploaded_by').all().order_by('-uploaded_at')
        m  = self.request.query_params.get('match')
        if m:
            qs = qs.filter(match_id=m)
        return qs

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


