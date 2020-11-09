from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings

# Create your models here.
class Project(models.Model):
    dept_choices = [
        ("PAINT", "Paint"),
        ("MATCH", "Match"),
        ("ROTO", "Roto"),
        ("COMP", "Comp"),
        ("3D", "3-d"),
        ("FX", "Fx"),
    ]
    project_name = models.CharField(unique=True, max_length=64)
    client = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()
    department = models.CharField(choices=dept_choices, max_length=50)


class Sequence(models.Model):
    statuses = [("YTS", "Yet to Start"), ("WIP", "Work in Progress"), ("FIN", "Final")]
    name = models.CharField(unique=True, max_length=64)
    description = models.CharField(max_length=300)
    status = models.CharField(choices=statuses, null=True, max_length=50)
    projects = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="sequences"
    )


class Shot(models.Model):
    statuses = [
        ("YTS", "Yet to Start"),
        ("WIP", "Work in Progress"),
        ("FIN", "Final"),
        ("FEED", "Correction"),
        ("REVW", "Review"),
        ("APPRVD", "Approved"),
        ("HLD", "Hold"),
        ("TB", "Taken Back"),
    ]
    shot_name = models.CharField(max_length=64)
    description = models.CharField(max_length=300)
    cut_in = models.DecimalField(max_digits=9, decimal_places=2)
    cut_out = models.DecimalField(max_digits=9, decimal_places=2)
    cut_frames = models.DecimalField(max_digits=9, decimal_places=2)
    client_bid = models.DurationField()
    client_duedate = models.DateField()
    status = models.CharField(choices=statuses, max_length=50)
    sequence = models.ForeignKey(
        Sequence, on_delete=models.CASCADE, related_name="shots"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["sequence", "shot_name"], name="unique_shot_for_project"
            )
        ]


class Task(models.Model):

    name = models.CharField(max_length=64)
    shots = models.ForeignKey(Shot, on_delete=models.CASCADE, related_name="task")
    start_date = models.DateField()
    Bid = models.DurationField()
    assigned_users = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="tasks"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["name", "shots"], name="unique_task_forshot"
            )
        ]


# Create your models here.
