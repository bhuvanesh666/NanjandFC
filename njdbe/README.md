# Nanjanad Football Club - Backend (Django + DRF)

## Setup

```bash
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

python manage.py runserver
```

Backend runs at: http://127.0.0.1:8000/
Admin panel: http://127.0.0.1:8000/admin/

## API Endpoints

### Auth (accounts)
- POST /api/accounts/register/
- POST /api/accounts/login/        (returns access & refresh JWT)
- POST /api/accounts/login/refresh/
- GET/PUT /api/accounts/profile/
- POST /api/accounts/change-password/

### Players
- GET /api/players/all/                  (public list of all players)
- GET /api/players/all/<id>/
- GET/PUT /api/players/me/                (logged-in player's profile)
- GET/POST /api/players/me/documents/     (upload Aadhar/PAN/License)
- /api/players/admin/manage/              (admin CRUD - players & stats)
- /api/players/admin/documents/           (admin - verify/reject docs)

### Matches
- /api/matches/                 (?status=upcoming or ?status=played)
- GET/PUT /api/matches/<id>/summary/
- /api/matches/photos/          (?match=<id>)

### Gallery
- /api/gallery/albums/          (?year=2024)
- /api/gallery/images/          (?album=<id>)

### News
- /api/news/

## Notes
- AUTH_USER_MODEL is a custom User with `role` (admin/player/visitor) and `phone`.
- Use JWT access token in header: `Authorization: Bearer <token>`
- Media files (photos/docs) served at /media/ in DEBUG mode.
- Edit `.env` to set SECRET_KEY before production use.
