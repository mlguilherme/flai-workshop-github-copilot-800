from django.db import models


class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    age = models.IntegerField()

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.name


class Team(models.Model):
    name = models.CharField(max_length=100)
    members = models.TextField(default='[]')  # JSON list of user emails

    class Meta:
        db_table = 'teams'

    def __str__(self):
        return self.name


class Activity(models.Model):
    user = models.CharField(max_length=100)  # references User email
    activity_type = models.CharField(max_length=100)
    duration = models.FloatField()  # in minutes
    date = models.DateField()

    class Meta:
        db_table = 'activities'

    def __str__(self):
        return f"{self.user} - {self.activity_type}"


class Leaderboard(models.Model):
    user = models.CharField(max_length=100)  # references User email
    score = models.IntegerField()

    class Meta:
        db_table = 'leaderboard'

    def __str__(self):
        return f"{self.user}: {self.score}"


class Workout(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    exercises = models.TextField(default='[]')  # JSON list of exercises

    class Meta:
        db_table = 'workouts'

    def __str__(self):
        return self.name
