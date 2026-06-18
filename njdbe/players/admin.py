from django.contrib import admin
from .models import PlayerProfile, PlayerDocument


class PlayerDocumentInline(admin.TabularInline):
    model = PlayerDocument
    extra = 0


@admin.register(PlayerProfile)
class PlayerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'position', 'jersey_number', 'goals', 'assists', 'matches_played')
    list_filter = ('position',)
    inlines = [PlayerDocumentInline]


@admin.register(PlayerDocument)
class PlayerDocumentAdmin(admin.ModelAdmin):
    list_display = ('player', 'doc_type', 'status', 'uploaded_at')
    list_filter = ('status', 'doc_type')
    actions = ['mark_verified', 'mark_rejected']

    def mark_verified(self, request, queryset):
        queryset.update(status='verified')
    mark_verified.short_description = "Mark selected documents as Verified"

    def mark_rejected(self, request, queryset):
        queryset.update(status='rejected')
    mark_rejected.short_description = "Mark selected documents as Rejected"
