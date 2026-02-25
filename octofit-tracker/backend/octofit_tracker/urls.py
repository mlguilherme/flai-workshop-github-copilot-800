import os
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from octofit_tracker.views import (
    UserViewSet, TeamViewSet, ActivityViewSet,
    LeaderboardViewSet, WorkoutViewSet, api_root
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'activities', ActivityViewSet)
router.register(r'leaderboard', LeaderboardViewSet)
router.register(r'workouts', WorkoutViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='api-root'),
    path('api/', api_root, name='api-root-prefix'),
    path('api/', include(router.urls)),
]
