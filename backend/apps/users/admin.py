from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'username', 'is_seller', 'is_staff', 'created_at']
    list_filter = ['is_seller', 'is_staff', 'is_active']
    search_fields = ['email', 'username']
    ordering = ['-created_at']
    fieldsets = UserAdmin.fieldsets + (
        ('Extra', {'fields': ('phone', 'avatar', 'address', 'is_seller')}),
    )
