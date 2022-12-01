from users.models import User

user=User.objects.create_user(username='User2', password='EtoParol123', group="IB-42", points=0, first_name="Lorem", last_name="Ipsum")
user.is_active=True
user.is_superuser=False
user.is_staff=False
user.save()

#or manage.py changepassword *username*
