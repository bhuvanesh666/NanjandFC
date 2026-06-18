from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import MatchViewSet, MatchSummaryView, MatchPhotoViewSet

router = DefaultRouter()
router.register('photos', MatchPhotoViewSet, basename='match-photo')
router.register('', MatchViewSet, basename='match')

urlpatterns = [
    path('<int:match_id>/summary/', MatchSummaryView.as_view(), name='match-summary'),
] + router.urls
