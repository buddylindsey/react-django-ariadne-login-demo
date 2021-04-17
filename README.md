# Demo of getting React frontend and a Django backend with Login working.

The frontend was started from `create-react-app`. The backend was created from standard django creation.

## Setup and Run

You need to cd into the both `frontend`, and `backend` and initialize them.

For the frontend:

```
cd frontend
npm install
npm run start
```

For the backend:

```
cd backend
python -m venv .venv --prompt=backend
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 9000
```
