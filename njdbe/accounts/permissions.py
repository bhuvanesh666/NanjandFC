from rest_framework import permissions


class IsAdminRole(permissions.BasePermission):
    """Allows access only to users with role='admin' (or is_staff)."""

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and (user.role == 'admin' or user.is_staff))


class IsAdminOrReadOnly(permissions.BasePermission):
    """Read for everyone, write only for admins."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = request.user
        return bool(user and user.is_authenticated and (user.role == 'admin' or user.is_staff))
