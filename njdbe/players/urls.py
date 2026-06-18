from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    PlayerProfileViewSet,
    MyProfileView,
    AdminPlayerViewSet,
    MyDocumentsView,
    AdminDocumentViewSet,
)

router = DefaultRouter()
router.register('all', PlayerProfileViewSet, basename='player-public')
router.register('admin/manage', AdminPlayerViewSet, basename='player-admin')
router.register('admin/documents', AdminDocumentViewSet, basename='document-admin')

urlpatterns = [
    path('me/', MyProfileView.as_view(), name='my-profile'),
    path('me/documents/', MyDocumentsView.as_view(), name='my-documents'),
] + router.urls
