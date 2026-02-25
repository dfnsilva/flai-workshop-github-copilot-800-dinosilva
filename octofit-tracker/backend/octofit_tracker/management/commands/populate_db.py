from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Clear existing data
        self.stdout.write('Clearing existing data...')
        Workout.objects.all().delete()
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Team.objects.all().delete()
        User.objects.all().delete()

        # Create superhero users
        self.stdout.write('Creating users...')
        users_data = [
            {'username': 'ironman', 'email': 'ironman@avengers.com', 'password': 'tony1234'},
            {'username': 'spiderman', 'email': 'spiderman@avengers.com', 'password': 'peter1234'},
            {'username': 'blackwidow', 'email': 'blackwidow@avengers.com', 'password': 'natasha1234'},
            {'username': 'batman', 'email': 'batman@dc.com', 'password': 'bruce1234'},
            {'username': 'superman', 'email': 'superman@dc.com', 'password': 'clark1234'},
            {'username': 'wonderwoman', 'email': 'wonderwoman@dc.com', 'password': 'diana1234'},
        ]
        users = {}
        for ud in users_data:
            u = User.objects.create(**ud)
            users[ud['username']] = u
            self.stdout.write(f'  Created user: {ud["username"]}')

        # Create teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            members=['ironman', 'spiderman', 'blackwidow']
        )
        team_dc = Team.objects.create(
            name='Team DC',
            members=['batman', 'superman', 'wonderwoman']
        )
        self.stdout.write('  Created Team Marvel and Team DC')

        # Create activities
        self.stdout.write('Creating activities...')
        activities_data = [
            {'user': 'ironman', 'activity_type': 'Flight Training', 'duration': 60.0, 'date': date(2024, 1, 10)},
            {'user': 'spiderman', 'activity_type': 'Web Slinging', 'duration': 45.0, 'date': date(2024, 1, 11)},
            {'user': 'blackwidow', 'activity_type': 'Martial Arts', 'duration': 90.0, 'date': date(2024, 1, 12)},
            {'user': 'batman', 'activity_type': 'Cape Gliding', 'duration': 55.0, 'date': date(2024, 1, 10)},
            {'user': 'superman', 'activity_type': 'Flying', 'duration': 120.0, 'date': date(2024, 1, 11)},
            {'user': 'wonderwoman', 'activity_type': 'Lasso Training', 'duration': 75.0, 'date': date(2024, 1, 12)},
        ]
        for ad in activities_data:
            Activity.objects.create(**ad)
            self.stdout.write(f'  Created activity for: {ad["user"]}')

        # Create leaderboard entries
        self.stdout.write('Creating leaderboard...')
        leaderboard_data = [
            {'user': 'ironman', 'score': 950},
            {'user': 'spiderman', 'score': 870},
            {'user': 'blackwidow', 'score': 920},
            {'user': 'batman', 'score': 980},
            {'user': 'superman', 'score': 1000},
            {'user': 'wonderwoman', 'score': 960},
        ]
        for ld in leaderboard_data:
            Leaderboard.objects.create(**ld)
            self.stdout.write(f'  Created leaderboard entry for: {ld["user"]}')

        # Create workouts
        self.stdout.write('Creating workouts...')
        workouts_data = [
            {
                'name': 'Avengers Endurance Blast',
                'description': 'High-intensity workout inspired by the Avengers\' training regime.',
                'exercises': ['100 push-ups', '100 sit-ups', '100 squats', '10km run']
            },
            {
                'name': 'Iron Man Power Suit Circuit',
                'description': 'Build strength like Tony Stark with this full-body circuit.',
                'exercises': ['Bench press 5x10', 'Overhead press 5x10', 'Deadlift 5x5', 'Plank 3x60s']
            },
            {
                'name': 'DC Heroes Agility Course',
                'description': 'Agility and speed training inspired by DC heroes.',
                'exercises': ['Sprint intervals 10x100m', 'Ladder drills 5 sets', 'Box jumps 5x10', 'Burpees 3x20']
            },
            {
                'name': 'Spider-Man Flexibility Routine',
                'description': 'Improve flexibility and body control like Spider-Man.',
                'exercises': ['Dynamic stretching 10min', 'Yoga flow 20min', 'Balance exercises 15min']
            },
        ]
        for wd in workouts_data:
            Workout.objects.create(**wd)
            self.stdout.write(f'  Created workout: {wd["name"]}')

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))
