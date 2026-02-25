import json
from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Workout.objects.all().delete()
        Team.objects.all().delete()
        User.objects.all().delete()

        self.stdout.write('Creating superhero users...')

        # Team Marvel superheroes
        marvel_heroes = [
            {'name': 'Tony Stark', 'email': 'ironman@marvel.com', 'age': 45},
            {'name': 'Peter Parker', 'email': 'spiderman@marvel.com', 'age': 22},
            {'name': 'Natasha Romanoff', 'email': 'blackwidow@marvel.com', 'age': 35},
            {'name': 'Steve Rogers', 'email': 'captain_america@marvel.com', 'age': 105},
            {'name': 'Thor Odinson', 'email': 'thor@marvel.com', 'age': 1500},
        ]

        # Team DC superheroes
        dc_heroes = [
            {'name': 'Bruce Wayne', 'email': 'batman@dc.com', 'age': 40},
            {'name': 'Clark Kent', 'email': 'superman@dc.com', 'age': 35},
            {'name': 'Diana Prince', 'email': 'wonderwoman@dc.com', 'age': 800},
            {'name': 'Barry Allen', 'email': 'flash@dc.com', 'age': 28},
            {'name': 'Hal Jordan', 'email': 'greenlantern@dc.com', 'age': 32},
        ]

        marvel_users = []
        for hero_data in marvel_heroes:
            user = User.objects.create(**hero_data)
            marvel_users.append(user)
            self.stdout.write(f'  Created user: {user.name}')

        dc_users = []
        for hero_data in dc_heroes:
            user = User.objects.create(**hero_data)
            dc_users.append(user)
            self.stdout.write(f'  Created user: {user.name}')

        self.stdout.write('Creating teams...')

        team_marvel = Team.objects.create(
            name='Team Marvel',
            members=json.dumps([u.email for u in marvel_users])
        )
        self.stdout.write(f'  Created team: {team_marvel.name}')

        team_dc = Team.objects.create(
            name='Team DC',
            members=json.dumps([u.email for u in dc_users])
        )
        self.stdout.write(f'  Created team: {team_dc.name}')

        self.stdout.write('Creating activities...')

        activities_data = [
            {'user': 'ironman@marvel.com', 'activity_type': 'Flying in Iron Man suit', 'duration': 60.0, 'date': date(2024, 1, 10)},
            {'user': 'spiderman@marvel.com', 'activity_type': 'Web-slinging across NYC', 'duration': 45.0, 'date': date(2024, 1, 11)},
            {'user': 'blackwidow@marvel.com', 'activity_type': 'Combat training', 'duration': 90.0, 'date': date(2024, 1, 12)},
            {'user': 'captain_america@marvel.com', 'activity_type': 'Shield throwing practice', 'duration': 75.0, 'date': date(2024, 1, 13)},
            {'user': 'thor@marvel.com', 'activity_type': 'Hammer wielding workout', 'duration': 120.0, 'date': date(2024, 1, 14)},
            {'user': 'batman@dc.com', 'activity_type': 'Gotham night patrol', 'duration': 180.0, 'date': date(2024, 1, 10)},
            {'user': 'superman@dc.com', 'activity_type': 'Flying over Metropolis', 'duration': 30.0, 'date': date(2024, 1, 11)},
            {'user': 'wonderwoman@dc.com', 'activity_type': 'Lasso of Truth training', 'duration': 60.0, 'date': date(2024, 1, 12)},
            {'user': 'flash@dc.com', 'activity_type': 'Speed force run', 'duration': 5.0, 'date': date(2024, 1, 13)},
            {'user': 'greenlantern@dc.com', 'activity_type': 'Power ring constructs', 'duration': 50.0, 'date': date(2024, 1, 14)},
        ]

        for act_data in activities_data:
            activity = Activity.objects.create(**act_data)
            self.stdout.write(f'  Created activity: {activity.activity_type} for {activity.user}')

        self.stdout.write('Creating leaderboard entries...')

        leaderboard_data = [
            {'user': 'thor@marvel.com', 'score': 950},
            {'user': 'batman@dc.com', 'score': 910},
            {'user': 'wonderwoman@dc.com', 'score': 880},
            {'user': 'captain_america@marvel.com', 'score': 860},
            {'user': 'superman@dc.com', 'score': 840},
            {'user': 'ironman@marvel.com', 'score': 820},
            {'user': 'blackwidow@marvel.com', 'score': 800},
            {'user': 'flash@dc.com', 'score': 790},
            {'user': 'spiderman@marvel.com', 'score': 750},
            {'user': 'greenlantern@dc.com', 'score': 700},
        ]

        for lb_data in leaderboard_data:
            entry = Leaderboard.objects.create(**lb_data)
            self.stdout.write(f'  Created leaderboard entry: {entry.user} -> {entry.score}')

        self.stdout.write('Creating workouts...')

        workouts_data = [
            {
                'name': 'Iron Man Endurance Circuit',
                'description': 'High-intensity endurance training inspired by Tony Stark\'s arc reactor powered suit.',
                'exercises': json.dumps([
                    {'name': 'Repulsor blast holds', 'sets': 3, 'reps': 15},
                    {'name': 'Suit-up sprint drills', 'sets': 4, 'reps': 10},
                    {'name': 'Core stabilization plank', 'sets': 3, 'duration_seconds': 60},
                ])
            },
            {
                'name': 'Spider-Man Agility Training',
                'description': 'Agility and flexibility workout inspired by Peter Parker\'s spider-like abilities.',
                'exercises': json.dumps([
                    {'name': 'Wall crawl simulation', 'sets': 3, 'reps': 12},
                    {'name': 'Web-swing squats', 'sets': 4, 'reps': 15},
                    {'name': 'Spider-sense reaction drills', 'sets': 3, 'reps': 20},
                ])
            },
            {
                'name': 'Batman Combat Conditioning',
                'description': 'Full-body combat conditioning from Bruce Wayne\'s training regimen.',
                'exercises': json.dumps([
                    {'name': 'Batarang throws (resistance band)', 'sets': 3, 'reps': 20},
                    {'name': 'Gotham obstacle course run', 'sets': 2, 'duration_minutes': 15},
                    {'name': 'Defensive grappling holds', 'sets': 4, 'reps': 10},
                ])
            },
            {
                'name': 'Wonder Woman Power Build',
                'description': 'Strength and power training inspired by Diana Prince\'s Amazonian warrior training.',
                'exercises': json.dumps([
                    {'name': 'Lasso pull rows', 'sets': 4, 'reps': 12},
                    {'name': 'Shield block press', 'sets': 3, 'reps': 15},
                    {'name': 'Amazonian warrior lunges', 'sets': 3, 'reps': 20},
                ])
            },
            {
                'name': 'Flash Speed Intervals',
                'description': 'High-speed interval training inspired by Barry Allen\'s speed force abilities.',
                'exercises': json.dumps([
                    {'name': 'Speed force sprints', 'sets': 10, 'duration_seconds': 30},
                    {'name': 'Treadmill acceleration bursts', 'sets': 5, 'duration_seconds': 60},
                    {'name': 'Reaction time drills', 'sets': 3, 'reps': 25},
                ])
            },
        ]

        for workout_data in workouts_data:
            workout = Workout.objects.create(**workout_data)
            self.stdout.write(f'  Created workout: {workout.name}')

        self.stdout.write(self.style.SUCCESS('\nDatabase populated successfully with superhero test data!'))
        self.stdout.write(f'  Users: {User.objects.count()}')
        self.stdout.write(f'  Teams: {Team.objects.count()}')
        self.stdout.write(f'  Activities: {Activity.objects.count()}')
        self.stdout.write(f'  Leaderboard entries: {Leaderboard.objects.count()}')
        self.stdout.write(f'  Workouts: {Workout.objects.count()}')
