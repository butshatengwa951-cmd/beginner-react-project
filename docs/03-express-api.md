# Express API and middleware

The React app should not connect directly to Google Sheets. The Express server is the trusted boundary between browser code and private service credentials.

## 1. Why have a backend?

The browser is controlled by the user. Any secret shipped to the browser can be inspected. A Google service-account private key must stay on the server.

The backend also:
- Verifies the Firebase ID token.
- Determines the owner UID from the verified token.
- Validates incoming data.
- Checks that the requested task belongs to the signed-in user.
- Talks to the Google Sheets API.

## 2. Start with server.js

server/src/server.js creates an Express app and registers middleware and routes.

~~~js
const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());
app.use("/api/tasks", taskRoutes);
~~~

Express comparison: think of app.use as registering middleware in request order. A request passes through middleware and then reaches a matching route. Middleware can inspect or change the request/response, end the response, or call next() to continue.

CORS tells browsers which origins may read responses. CORS is not authentication and does not stop command-line clients from sending requests.

express.json() parses JSON request bodies and assigns the parsed object to request.body.

## 3. HTTP methods and status codes

| Method | Meaning in this app |
|---|---|
| GET | Read tasks |
| POST | Create a task |
| PATCH | Change selected fields on a task |
| DELETE | Delete a task |

Common response codes:
- 200: request succeeded.
- 201: a new task was created.
- 400: invalid input.
- 401: missing or invalid authentication.
- 404: task does not exist for this user.
- 500: unexpected server failure.

## 4. Middleware and Firebase Admin

server/src/middleware/requireAuth.js runs before the task route handlers.

It:
1. Reads the Authorization header.
2. Requires the Bearer scheme.
3. Extracts the ID token.
4. Calls verifyIdToken() using Firebase Admin.
5. Stores the verified UID on request.user.
6. Calls next() so the route can continue.

The UID is taken from the verified token, not from request.body.userId. This prevents a user from changing a request body to impersonate another account.

## 5. Route handlers

server/src/routes/taskRoutes.js defines the task endpoints. Each handler receives request, response and next.

- request.params.id contains the URL parameter.
- request.body contains submitted JSON.
- request.user is added by requireAuth.
- response.status(...).json(...) sends a JSON response.
- next(error) forwards unexpected errors to the central error handler.

Notice how POST creates a task using request.user.uid. The client does not choose its own owner UID.

## 6. Configuration

The backend reads values from server/.env using dotenv. Variables are not prefixed with VITE_ because they must remain server-side.

Firebase Admin and Google service-account private keys are sensitive credentials. Keep server/.env out of version control and never paste private keys into chat or commit them to GitHub.

## 7. Try it

Before connecting Sheets, test the health route in a browser:

http://localhost:4000/api/health

It should return a small JSON object. The health route is intentionally public; the task routes are not.
