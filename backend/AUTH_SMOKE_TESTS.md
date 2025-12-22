# Auth smoke tests (curl)

Replace API_URL with your backend URL (e.g. http://localhost:5000/api)

1) Register

curl -X POST "${API_URL:-http://localhost:5000/api}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

2) Login

curl -X POST "${API_URL:-http://localhost:5000/api}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

Successful response will include a token in the `token` field and a `data.user` object.

3) Get current user (use token from login)

curl -X GET "${API_URL:-http://localhost:5000/api}/auth/me" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json"

4) Logout

curl -X POST "${API_URL:-http://localhost:5000/api}/auth/logout" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json"

Notes:
- The API sets an httpOnly cookie named `token` when issuing tokens. For browser flows you don't need to store tokens manually if your front-end uses cookies.
- The client code in this repo stores the token in localStorage; make sure to use the token value returned by the login endpoint when testing with curl.
