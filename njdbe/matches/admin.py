from django.contrib import admin
from .models import Match, MatchSummary, MatchPhoto

class SummaryInline(admin.StackedInline):
    model = MatchSummary
    extra = 0

class PhotoInline(admin.TabularInline):
    model = MatchPhoto
    extra = 0

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('opponent','date','venue','status')
    inlines      = [SummaryInline, PhotoInline]

@admin.register(MatchSummary)
class MatchSummaryAdmin(admin.ModelAdmin):
    list_display = ('match','home_score','away_score')

@admin.register(MatchPhoto)
class MatchPhotoAdmin(admin.ModelAdmin):
    list_display = ('match','uploaded_at')
