"""octofit_tracker URL Configuration"""
import os
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from octofit_tracker.views import (
    api_root, UserViewSet, TeamViewSet, ActivityViewSet,
    LeaderboardViewSet, WorkoutViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'activities', ActivityViewSet)
router.register(r'leaderboard', LeaderboardViewSet)
router.register(r'workouts', WorkoutViewSet)

# Build the base URL using CODESPACE_NAME so all API links use the correct
# Codespace HTTPS URL rather than a hardcoded localhost address.
codespace_name = os.environ.get('CODESPACE_NAME')
if codespace_name:
    base_url = f"https://{codespace_name}-8000.app.github.dev"
else:
    base_url = "http://localhost:8000"

urlpatterns = [
    path('admin/', admin.site.urls),
    # Root and /api/ both serve the custom api_root that returns codespace-aware URLs
    path('', api_root, name='api-root'),
    path('api/', api_root, name='api-root-prefix'),
    # Router handles all /api/<resource>/ endpoints
    path('api/', include(router.urls)),
]
