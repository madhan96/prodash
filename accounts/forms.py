from django.contrib.auth.forms import AuthenticationForm

from django import forms


class UserLoginForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super(UserLoginForm, self).__init__(*args, **kwargs)

    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "class": "form-control form-text-box",
                "placeholder": "Username",
                "onkeypress": "resetField(this)",
                "autocomplete": "off",
            }
        )
    )
    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control form-text-box",
                "placeholder": "Password",
                "onkeypress": "resetField(this)",
                "autocomplete": "off",
            }
        )
    )

    def clean(self):
        cleaned_data = super().clean()
        print("cleaned here", cleaned_data)
        print(
            "user",
            super().get_user().username,
            "auth",
            super().get_user().is_authenticated,
        )
        return cleaned_data