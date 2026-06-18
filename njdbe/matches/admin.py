from django.contrib import admin
from .models import Match, MatchSummary, MatchPhoto


class MatchSummaryInline(admin.StackedInline):
    model = MatchSummary
    extra = 0


class MatchPhotoInline(admin.TabularInline):
    model = MatchPhoto
    extra = 0


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('opponent', 'date', 'venue', 'competition', 'status')
    list_filter = ('status', 'competition')
    inlines = [MatchSummaryInline, MatchPhotoInline]


@admin.register(MatchSummary)
class MatchSummaryAdmin(admin.ModelAdmin):
    list_display = ('match', 'home_score', 'away_score', 'man_of_the_match')


@admin.register(MatchPhoto)
class MatchPhotoAdmin(admin.ModelAdmin):
    list_display = ('match', 'uploaded_by', 'uploaded_at')
