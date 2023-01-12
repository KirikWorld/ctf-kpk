import os, sys
from django.core.wsgi import get_wsgi_application

site_user_root_dir = '/home/k/kuleshm3/ctf-room/public_html'
sys.path.insert(0, os.path.join(site_user_root_dir, 'backend'))
sys.path.insert(1, os.path.join(site_user_root_dir, 'venv/lib/python3.11/site-packages'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_wsgi_application()
