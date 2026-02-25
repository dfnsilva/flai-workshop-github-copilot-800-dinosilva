from django.db import models


class User(models.Model):
    username = models.CharField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255, blank=True, default='')
    last_name = models.CharField(max_length=255, blank=True, default='')
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username


class Team(models.Model):
    name = models.CharField(max_length=255, unique=True)
    members = models.JSONField(default=list)

    class Meta:
        db_table = 'teams'

    def __str__(self):
        return self.name


class Activity(models.Model):
    user = models.CharField(max_length=255)
    activity_type = models.CharField(max_length=255)
    duration = models.FloatField()
    date = models.DateField()

    class Meta:
        db_table = 'activities'

    def __str__(self):
        return f"{self.user} - {self.activity_type}"


class Leaderboard(models.Model):
    user = models.CharField(max_length=255)
    score = models.IntegerField(default=0)
    calories = models.FloatField(default=0.0)

    class Meta:
        db_table = 'leaderboard'

    def __str__(self):
        return f"{self.user} - {self.score}"


class Workout(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    exercises = models.JSONField(default=list)

    class Meta:
        db_table = 'workouts'

    def __str__(self):
        return self.name
