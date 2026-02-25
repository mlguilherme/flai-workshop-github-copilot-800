from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout
import json
from datetime import date


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            name='Tony Stark',
            email='ironman@marvel.com',
            age=45
        )

    def test_user_creation(self):
        self.assertEqual(self.user.name, 'Tony Stark')
        self.assertEqual(self.user.email, 'ironman@marvel.com')
        self.assertEqual(self.user.age, 45)

    def test_user_str(self):
        self.assertEqual(str(self.user), 'Tony Stark')


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name='Team Marvel',
            members=json.dumps(['ironman@marvel.com', 'spiderman@marvel.com'])
        )

    def test_team_creation(self):
        self.assertEqual(self.team.name, 'Team Marvel')

    def test_team_str(self):
        self.assertEqual(str(self.team), 'Team Marvel')


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user='ironman@marvel.com',
            activity_type='Flying in Iron Man suit',
            duration=60.0,
            date=date(2024, 1, 10)
        )

    def test_activity_creation(self):
        self.assertEqual(self.activity.user, 'ironman@marvel.com')
        self.assertEqual(self.activity.activity_type, 'Flying in Iron Man suit')
        self.assertEqual(self.activity.duration, 60.0)

    def test_activity_str(self):
        self.assertIn('ironman@marvel.com', str(self.activity))


class LeaderboardModelTest(TestCase):
    def setUp(self):
        self.entry = Leaderboard.objects.create(
            user='thor@marvel.com',
            score=950
        )

    def test_leaderboard_creation(self):
        self.assertEqual(self.entry.user, 'thor@marvel.com')
        self.assertEqual(self.entry.score, 950)

    def test_leaderboard_str(self):
        self.assertIn('thor@marvel.com', str(self.entry))
        self.assertIn('950', str(self.entry))


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Iron Man Endurance Circuit',
            description='High-intensity endurance training.',
            exercises=json.dumps([{'name': 'Repulsor blast holds', 'sets': 3, 'reps': 15}])
        )

    def test_workout_creation(self):
        self.assertEqual(self.workout.name, 'Iron Man Endurance Circuit')

    def test_workout_str(self):
        self.assertEqual(str(self.workout), 'Iron Man Endurance Circuit')


class UserAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            name='Bruce Wayne',
            email='batman@dc.com',
            age=40
        )

    def test_list_users(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user(self):
        response = self.client.get(f'/api/users/{self.user.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'batman@dc.com')

    def test_create_user(self):
        data = {'name': 'Clark Kent', 'email': 'superman@dc.com', 'age': 35}
        response = self.client.post('/api/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_user(self):
        response = self.client.delete(f'/api/users/{self.user.pk}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class TeamAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.team = Team.objects.create(
            name='Team DC',
            members=json.dumps(['batman@dc.com', 'superman@dc.com'])
        )

    def test_list_teams(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_team(self):
        response = self.client.get(f'/api/teams/{self.team.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Team DC')


class ActivityAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.activity = Activity.objects.create(
            user='batman@dc.com',
            activity_type='Gotham night patrol',
            duration=180.0,
            date=date(2024, 1, 10)
        )

    def test_list_activities(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_activity(self):
        response = self.client.get(f'/api/activities/{self.activity.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['activity_type'], 'Gotham night patrol')


class LeaderboardAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.entry = Leaderboard.objects.create(
            user='thor@marvel.com',
            score=950
        )

    def test_list_leaderboard(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_leaderboard_entry(self):
        response = self.client.get(f'/api/leaderboard/{self.entry.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['score'], 950)


class WorkoutAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.workout = Workout.objects.create(
            name='Batman Combat Conditioning',
            description='Full-body combat conditioning.',
            exercises=json.dumps([{'name': 'Batarang throws', 'sets': 3, 'reps': 20}])
        )

    def test_list_workouts(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_workout(self):
        response = self.client.get(f'/api/workouts/{self.workout.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Batman Combat Conditioning')


class ApiRootTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_api_root(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_api_root_prefix(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
