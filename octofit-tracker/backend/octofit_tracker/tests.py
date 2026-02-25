from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import User, Team, Activity, Leaderboard, Workout
import datetime


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            username='testuser',
            email='testuser@example.com',
            password='password123'
        )

    def test_user_creation(self):
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'testuser@example.com')

    def test_user_str(self):
        self.assertEqual(str(self.user), 'testuser')


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name='Team Alpha',
            members=['testuser']
        )

    def test_team_creation(self):
        self.assertEqual(self.team.name, 'Team Alpha')
        self.assertIn('testuser', self.team.members)

    def test_team_str(self):
        self.assertEqual(str(self.team), 'Team Alpha')


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user='testuser',
            activity_type='Running',
            duration=30.0,
            date=datetime.date.today()
        )

    def test_activity_creation(self):
        self.assertEqual(self.activity.user, 'testuser')
        self.assertEqual(self.activity.activity_type, 'Running')
        self.assertEqual(self.activity.duration, 30.0)

    def test_activity_str(self):
        self.assertIn('testuser', str(self.activity))
        self.assertIn('Running', str(self.activity))


class LeaderboardModelTest(TestCase):
    def setUp(self):
        self.entry = Leaderboard.objects.create(
            user='testuser',
            score=100
        )

    def test_leaderboard_creation(self):
        self.assertEqual(self.entry.user, 'testuser')
        self.assertEqual(self.entry.score, 100)

    def test_leaderboard_str(self):
        self.assertIn('testuser', str(self.entry))
        self.assertIn('100', str(self.entry))


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Morning Routine',
            description='A quick morning workout',
            exercises=['push-ups', 'sit-ups', 'squats']
        )

    def test_workout_creation(self):
        self.assertEqual(self.workout.name, 'Morning Routine')
        self.assertIn('push-ups', self.workout.exercises)

    def test_workout_str(self):
        self.assertEqual(str(self.workout), 'Morning Routine')


class UserAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            username='apiuser',
            email='apiuser@example.com',
            password='password123'
        )

    def test_list_users(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        data = {'username': 'newuser', 'email': 'new@example.com', 'password': 'pass'}
        response = self.client.post('/api/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_user(self):
        response = self.client.get(f'/api/users/{self.user.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TeamAPITest(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(name='API Team', members=[])

    def test_list_teams(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_team(self):
        data = {'name': 'New Team', 'members': []}
        response = self.client.post('/api/teams/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ActivityAPITest(APITestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user='apiuser', activity_type='Cycling',
            duration=45.0, date=datetime.date.today()
        )

    def test_list_activities(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LeaderboardAPITest(APITestCase):
    def setUp(self):
        self.entry = Leaderboard.objects.create(user='apiuser', score=200)

    def test_list_leaderboard(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutAPITest(APITestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='API Workout', description='Test workout', exercises=[]
        )

    def test_list_workouts(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class APIRootTest(APITestCase):
    def test_api_root(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('leaderboard', response.data)
        self.assertIn('workouts', response.data)

    def test_root_redirect(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
