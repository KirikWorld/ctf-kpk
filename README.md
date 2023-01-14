# ctf-kpk

### **On windows:**

Firstly you need to set up python environment in cmd (primary) ir powershell with commands:

`./venv/Scripts/activate.ps1` for powershell | `.\\venv\\Scripts\\activate.bat` for cmd ---> in backend directory

Then you can install libraries with `pip install -r requirements.txt` command

Change **database** in *settings.py* in *core* folder on development mode (use sqlite3)

Go to make migrations and apply database with next commands: `python manage.py makemigrations`, `python manage.py migrate`

Now lets create superuser - `python manage.py createsuperuser`

After all you can run frontend part of web app in *frontend* folder with `npm i`, `npm start`

> P.S. if python wont work use python3 or your python version like python3.x
>
> Working on python==3.6 and higher



### On linux or macos:

Install python, pip and venv. To pip run `python -m pip3`, to venv run `pip3 install virtualenv`

Next create virtual environmetn like on windows `python3 -m venv venv` and activate it with `source ./venv/bin/activate` in backend directory

Change **database** in *settings.py* in *core* folder on development mode (use sqlite3)

Go to make migrations and apply database with next commands: `python3 manage.py makemigrations`, `python3 manage.py migrate`

Now lets create superuser - `python3 manage.py createsuperuser`

After all you can run frontend part of web app in *frontend* folder with `npm i`, `npm start`
