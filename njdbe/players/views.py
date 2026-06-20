from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from .models import PlayerProfile, PlayerDocument
from .serializers import (PlayerProfileSerializer, PlayerProfileUpdateSerializer,
                           PlayerStatsAdminSerializer, PlayerDocumentSerializer,
                           PlayerDocumentAdminSerializer)
from accounts.permissions import IsAdminRole

class PlayerProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset           = PlayerProfile.objects.select_related('user').all()
    serializer_class   = PlayerProfileSerializer
    permission_classes = [permissions.AllowAny]

class MyProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    def get_object(self):
        profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        return profile
    def get_serializer_class(self):
        if self.request.method in ('PUT','PATCH'):
            return PlayerProfileUpdateSerializer
        return PlayerProfileSerializer

class AdminPlayerViewSet(viewsets.ModelViewSet):
    queryset           = PlayerProfile.objects.select_related('user').all()
    permission_classes = [IsAdminRole]
    def get_serializer_class(self):
        if self.request.method in ('PUT','PATCH'):
            return PlayerStatsAdminSerializer
        return PlayerProfileSerializer

class MyDocumentsView(generics.ListCreateAPIView):
    serializer_class   = PlayerDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        return PlayerDocument.objects.filter(player=profile)
    def perform_create(self, serializer):
        profile, _ = PlayerProfile.objects.get_or_create(user=self.request.user)
        serializer.save(player=profile)

class AdminDocumentViewSet(viewsets.ModelViewSet):
    queryset           = PlayerDocument.objects.select_related('player__user').all()
    serializer_class   = PlayerDocumentAdminSerializer
    permission_classes = [IsAdminRole]
    def update(self, request, *args, **kwargs):
        instance     = self.get_object()
        status_value = request.data.get('status')
        if status_value in ('pending','verified','rejected'):
            instance.status = status_value
            instance.save()
            return Response(self.get_serializer(instance).data)
        return Response({"detail":"Invalid status."}, status=status.HTTP_400_BAD_REQUEST)
