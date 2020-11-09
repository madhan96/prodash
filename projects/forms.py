from django import forms
from .models import Project, Sequence, Shot, Task
from django.db.models import Avg, Count, Min, Sum
from datetime import timedelta
from django.core.exceptions import ValidationError


class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = "__all__"


class SequenceForm(forms.ModelForm):
    class Meta:
        model = Sequence
        fields = "__all__"


class ShotForm(forms.ModelForm):
    class Meta:
        model = Shot
        fields = "__all__"


class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = "__all__"


class MultiTestform(TaskForm):
    def __init__(self, *args, **kwargs):
        super(MultiTestform, self).__init__(*args, **kwargs)
        # self.parent_shot=refer_shot
        # self.fields["assigned_users"] = forms.ModelMultipleChoiceField(
        #     queryset=User.objects.exclude(
        #         id__in=Shot.objects.get(id=3).assigned_users.values_list(
        #             "id", flat=True
        #         )
        #     )
        # )

    def clean(self):
        super(MultiTestform, self).clean()
        shot_id = self.data["shots"]
        bid_time = self.data["Bid"]
        filled_bid = (
            Shot.objects.filter(pk=shot_id)
            .annotate(total_bid=Sum("task__Bid"))[0]
            .total_bid
        )

        avaiable_bid = Shot.objects.get(pk=shot_id).client_bid
        if timedelta(bid_time) > avaiable_bid - filled_bid:
            raise ValidationError(
                "Invalid value:Bid should be less than %s" % (avaiable_bid - filled_bid)
            )

