from django.contrib import admin
from .models import PlayerProfile, PlayerDocument

class DocInline(admin.TabularInline):
    model = PlayerDocument
    extra = 0

@admin.register(PlayerProfile)
class PlayerProfileAdmin(admin.ModelAdmin):
    list_display = ('user','position','jersey_number','goals','assists')
    inlines      = [DocInline]

@admin.register(PlayerDocument)
class PlayerDocumentAdmin(admin.ModelAdmin):
    list_display = ('player','doc_type','status','uploaded_at')
