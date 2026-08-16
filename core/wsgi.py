import os
from django.core.wsgi import get_wsgi_application
from django.contrib.auth import get_user_model

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_wsgi_application()

# Garante a criação ou atualização do superusuário no Render
try:
    User = get_user_model()
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    else:
        # esse codigo garante Se já existir, garante que a senha está correta
        admin_user = User.objects.get(username='admin')
        admin_user.set_password('1234')
        admin_user.is_superuser = True
        admin_user.is_staff = True
        admin_user.save()
except Exception:
    pass