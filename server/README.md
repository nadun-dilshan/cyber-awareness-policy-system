# ShieldUp API Documentation

**Base URL**: `http://localhost:5000/api` (or your deployed URL in production).

**Authentication**: 
- Use JWT tokens obtained from `/auth/login`.
- Include `Authorization: Bearer <token>` in headers for protected routes.
- Tokens expire after 1 hour; implement token refresh in frontend if needed.

**Error Responses**:
- 400: Bad Request (invalid input).
- 401: Unauthorized (invalid/missing token).
- 403: Forbidden (insufficient role).
- 500: Internal Server Error.

**Security Notes**:
- Use HTTPS in production.
- Follow OWASP guidelines: input validation, rate limiting on login.
- Files are uploaded to `/uploads` (local); consider AWS S3 or GridFS for scalability.

**Non-Functional Alignment** (from Proposal):
- Performance: Supports ~20 concurrent users.
- Availability: Aim for >99% uptime during work hours.
- Usability: Onboarding introduction; minimal training required.
- Scalability: Expandable to accommodate staff growth (MERN allows horizontal scaling).
- Reliability: Regular backups and recovery procedures.
- Maintainability: Modular MERN codebase with version control and clear documentation.
- Portability: Accessible on PC, laptops, and tablets with responsive design.

## API Endpoints

### 1. Authentication & User Management
Handles user registration, login, and onboarding.

#### POST /auth/register
- **Description**: Register a new user (Admin only).
- **Access**: Admin.
- **Request Body** (JSON):
  ```json
  {
    "username": "string",
    "password": "string",
    "role": "admin" | "employee",
    "department": "service" | "finance" | "purchasing"
  }
  ```
- **Response**:
  - 201: `{"msg": "User registered"}`

**Frontend Implementation**:
- Use Axios or Fetch to send POST request from an admin panel form.
- Validate inputs (e.g., password length >8) on client-side with libraries like Yup/Formik.
- After success, refresh user list or show toast notification (use react-toastify).
- Protect route with role check: Use Context API or Redux to store user role and conditionally render the register form.

#### POST /auth/login
- **Description**: Authenticate user and get JWT.
- **Request Body** (JSON):
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  - 200:
    ```json
    {
      "token": "string",
      "user": {
        "id": "string",
        "role": "admin" | "employee",
        "onboardingCompleted": boolean,
        "department": "string"
      }
    }
    ```

**Frontend Implementation**:
- Create a Login component with form inputs.
- On submit, POST to endpoint, store token in localStorage or a secure state manager.
- Redirect based on onboarding: If !onboardingCompleted, go to /onboarding; else /dashboard.
- Handle errors: Show "Invalid credentials" message with a UI library (e.g., react-toastify).
- Use React Router for navigation.

#### POST /auth/onboarding
- **Description**: Complete onboarding introduction.
- **Access**: Authenticated user.
- **Request Body**: None.
- **Response**:
  - 200: `{"msg": "Onboarding completed"}`

**Frontend Implementation**:
- In OnboardingIntro component, display intro content (text/videos).
- Button to POST to endpoint on click.
- Update local user state (e.g., via Context/Redux) and redirect to /dashboard.
- Use useEffect to check if onboarding is needed on app load.

### 2. Policy Management
Manages policy uploads, assignments, and acknowledgements.

#### POST /policies/upload
- **Description**: Upload and assign policy (Admin only).
- **Access**: Admin.
- **Request**: Multipart/form-data.
  - `title`: string (required)
  - `description`: string (optional)
  - `file`: file (optional, PDF/doc)
  - `assignedTo`: string (JSON array of user IDs, e.g., `["id1", "id2"]`)
- **Response**:
  - 201:
    ```json
    {
      "_id": "mongoose_id",
      "title": "string",
      "description": "string",
      "fileUrl": "string",
      "assignedTo": ["mongoose_id"],
      "version": number,
      "createdAt": "date"
    }
    ```

**Frontend Implementation**:
- Admin panel form with inputs and file upload (use `<input type="file">`).
- Use FormData to append fields; POST with `axios({ method: 'post', data: formData })`.
- Fetch user list first (add a GET /users endpoint if needed) for assignment dropdown.
- On success, trigger notifications (handled backend-side); show success toast.

#### GET /policies
- **Description**: Get assigned policies for user.
- **Access**: Authenticated.
- **Response**:
  - 200: Array of policies.
    ```json
    [
      {
        "_id": "mongoose_id",
        "title": "string",
        "description": "string",
        "fileUrl": "string",
        "assignedTo": ["mongoose_id"],
        "version": number,
        "createdAt": "date"
      }
    ]
    ```

**Frontend Implementation**:
- In Employee Dashboard, use useEffect to GET policies.
- Display in list/table with title, description, and file download link (`<a href={fileUrl} download>`).
- For each policy, show acknowledge button if not acknowledged (check with backend).

#### POST /policies/acknowledge
- **Description**: Acknowledge a policy.
- **Access**: Authenticated.
- **Request Body** (JSON):
  ```json
  {
    "policyId": "mongoose_id",
    "signature": "string"
  }
  ```
- **Response**:
  - 200: `{"msg": "Policy acknowledged"}`

**Frontend Implementation**:
- Button next to each policy; on click, POST with policyId.
- Update UI to show "Acknowledged" status (refetch policies or update state).
- Timestamp handled backend.

### 3. Training & Quizzes
Role-based training modules with quizzes.

#### POST /trainings
- **Description**: Create training (Admin only).
- **Access**: Admin.
- **Request Body** (JSON):
  ```json
  {
    "title": "string",
    "content": "string",
    "department": "service" | "finance" | "purchasing",
    "quizzes": [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "answer": "string"
      }
    ]
  }
  ```
- **Response**:
  - 201: Training object.

**Frontend Implementation**:
- Admin form for training creation.
- Dynamic quiz fields (use array in state, add/remove questions with hooks).
- POST and refresh training list (GET /trainings).

#### GET /trainings
- **Description**: Get department-specific trainings.
- **Access**: Authenticated.
- **Response**:
  - 200: Array of trainings.
    ```json
    [
      {
        "_id": "mongoose_id",
        "title": "string",
        "content": "string",
        "department": "string",
        "quizzes": [{ "question": "string", "options": ["string"], "answer": "string" }]
      }
    ]
    ```

**Frontend Implementation**:
- In TrainingModule component, GET on mount with useEffect.
- Display lessons (embed content if URL with `<iframe>` or render text), then quiz form.

#### POST /trainings/quiz
- **Description**: Submit quiz answers.
- **Access**: Authenticated.
- **Request Body** (JSON):
  ```json
  {
    "trainingId": "mongoose_id",
    "answers": ["string", "string"]
  }
  ```
- **Response**:
  - 200:
    ```json
    {
      "score": number,
      "passed": boolean
    }
    ```

**Frontend Implementation**:
- Quiz component: Radio buttons for options (use state for selections).
- On submit, POST answers; show score/passed with react-toastify.
- Update progress in user profile (refetch user data or update state).

### 4. Compliance Tracking
Admin dashboard for compliance.

#### GET /compliance
- **Description**: Get compliance report (Admin only).
- **Access**: Admin.
- **Response**:
  - 200:
    ```json
    [
      {
        "user": "string",
        "compliant": boolean,
        "acks": number,
        "quizzesPassed": number
      }
    ]
    ```

**Frontend Implementation**:
- ComplianceDashboard: GET report, display in table or charts (use Recharts).
- Highlight non-compliant (red flags with conditional CSS).
- Refresh button for real-time updates (use useEffect with interval).

### 5. Incident Reporting
Submit and manage incidents.

#### POST /incidents
- **Description**: Submit incident.
- **Access**: Authenticated.
- **Request**: Multipart/form-data.
  - `title`: string (required)
  - `description`: string (required)
  - `file`: file (optional)
- **Response**:
  - 201:
    ```json
    {
      "_id": "mongoose_id",
      "title": "string",
      "description": "string",
      "fileUrl": "string",
      "status": "new",
      "createdAt": "date"
    }
    ```

**Frontend Implementation**:
- IncidentForm: Inputs and file upload (`<input type="file">`).
- POST with FormData; show success message with react-toastify.

#### GET /incidents
- **Description**: Get all incidents (Admin only).
- **Access**: Admin.
- **Response**:
  - 200: Array of incidents.
    ```json
    [
      {
        "_id": "mongoose_id",
        "title": "string",
        "description": "string",
        "fileUrl": "string",
        "status": "new" | "in-review" | "resolved",
        "createdAt": "date"
      }
    ]
    ```

**Frontend Implementation**:
- Admin list view with status filters (use dropdown or state).
- Display with download link for files.

#### PUT /incidents/status
- **Description**: Update incident status (Admin only).
- **Access**: Admin.
- **Request Body** (JSON):
  ```json
  {
    "id": "mongoose_id",
    "status": "in-review" | "resolved"
  }
  ```
- **Response**:
  - 200: Updated incident.

**Frontend Implementation**:
- Dropdown in incident list; on change, PUT and refetch list.

### 6. Notifications
In-app and email alerts.

#### GET /notifications
- **Description**: Get user notifications.
- **Access**: Authenticated.
- **Response**:
  - 200:
    ```json
    [
      {
        "_id": "mongoose_id",
        "type": "policy_update" | "overdue_ack" | "incident_update",
        "message": "string",
        "read": boolean,
        "createdAt": "date"
      }
    ]
    ```

**Frontend Implementation**:
- Notifications bell icon; GET unread count, display list (use badge).
- Use WebSockets (add Socket.io) for real-time if expanding; otherwise poll.

#### PUT /notifications/read
- **Description**: Mark as read.
- **Access**: Authenticated.
- **Request Body** (JSON):
  ```json
  {
    "id": "mongoose_id"
  }
  ```
- **Response**:
  - 200: `{"msg": "Marked as read"}`

**Frontend Implementation**:
- Click to mark; update UI (toggle read state).

### 7. Audit Logging
Secure logs for actions.

#### GET /audits
- **Description**: Get audit logs (Admin only).
- **Access**: Admin.
- **Response**:
  - 200:
    ```json
    [
      {
        "_id": "mongoose_id",
        "userId": "mongoose_id",
        "action": "string",
        "details": "string",
        "timestamp": "date"
      }
    ]
    ```

**Frontend Implementation**:
- Audit page: Table with filters (date/action, use state).
- Paginate if logs grow (use libraries like react-paginate).

## Frontend Implementation Guidelines
- **Framework**: React.js with Tailwind CSS for responsive UI.
- **Routing**: Use React Router for pages (e.g., /login, /dashboard, /admin/compliance).
- **State Management**: Use Context API or Redux for user/token/role.
- **API Calls**: Axios with baseURL from .env; add interceptors for token/auth errors (logout on 401).
- **Protected Routes**: Custom Route component checking token/role (e.g., with react-router-dom).
- **Forms**: Use React Hook Form for validation with libraries like Yup.
- **File Handling**: Display policy/incident files with `<a download>` or embed PDFs (`<object>` or `<iframe>`).
- **Notifications**: Integrate react-toastify for toasts; poll or WebSockets for in-app.
- **Dashboard**:
  - Employee: Policies list, trainings, incident form, profile/progress.
  - Admin: User management, policy/training upload, compliance reports, incidents, audits.
- **Onboarding**: Modal or page on first login (check onboardingCompleted).
- **Error Handling**: Global error boundary; show user-friendly messages (e.g., with react-error-boundary).
- **Testing**: Use Jest/React Testing Library for components; test API integrations with mocks.