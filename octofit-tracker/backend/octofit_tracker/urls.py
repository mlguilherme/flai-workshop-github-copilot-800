import os
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from octofit_tracker.views import (
    UserViewSet, TeamViewSet, ActivityViewSet,
    LeaderboardViewSet, WorkoutViewSet, api_root
)

# Build the base URL for the API using the Codespaces environment variable so
# that all self-describing links resolve correctly via the GitHub proxy.
CODESPACE_NAME = os.environ.get('CODESPACE_NAME')
API_BASE_URL = (
    f"https://{CODESPACE_NAME}-8000.app.github.dev"
    if CODESPACE_NAME
    else "http://localhost:8000"
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'activities', ActivityViewSet)
router.register(r'leaderboard', LeaderboardViewSet)
router.register(r'workouts', WorkoutViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/', include(router.urls)),
]
