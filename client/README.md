# ShieldUp Frontend Folder Structure

```
shieldup-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── Modal.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Onboarding.jsx
│   │   ├── dashboard/
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── EmployeeDashboard.jsx
│   │   ├── policies/
│   │   │   ├── PolicyList.jsx
│   │   │   ├── PolicyUpload.jsx
│   │   │   └── PolicyAcknowledge.jsx
│   │   ├── training/
│   │   │   ├── TrainingList.jsx
│   │   │   ├── TrainingCreate.jsx
│   │   │   ├── TrainingView.jsx
│   │   │   └── QuizTake.jsx
│   │   ├── compliance/
│   │   │   └── ComplianceReport.jsx
│   │   ├── incidents/
│   │   │   ├── IncidentList.jsx
│   │   │   ├── IncidentReport.jsx
│   │   │   └── IncidentManage.jsx
│   │   ├── notifications/
│   │   │   └── NotificationList.jsx
│   │   └── audit/
│   │       └── AuditLogs.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useApi.js
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   ├── auth.js
│   │   └── constants.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Key Features Implementation:

### 1. Authentication & User Management
- Secure login/register forms
- JWT token handling
- Role-based access control
- Onboarding introduction for new users

### 2. Policy Management
- Admin: Upload and assign policies to departments
- Employee: View assigned policies and acknowledge with e-signature
- Version tracking and history

### 3. Training & Assessment System
- Role-based training content
- Interactive quizzes with auto-scoring
- Progress tracking and completion status

### 4. Compliance Dashboard
- Real-time compliance statistics
- Visual reports showing compliant/non-compliant employees
- Department-wise breakdown

### 5. Incident Reporting
- Employee incident submission with file attachments
- Admin incident management and status updates
- Real-time notifications

### 6. Notification System
- In-app notifications for policy updates
- Email notifications integration
- Mark as read functionality

### 7. Audit Logging
- Comprehensive activity tracking
- Admin-only access to audit logs
- Tamper-resistant logging display

## Tech Stack:
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **State Management**: React Context + useState/useReducer
- **Form Handling**: Native React forms with validation