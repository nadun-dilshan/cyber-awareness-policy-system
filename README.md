# ShieldUp Project Documentation

## Overview
ShieldUp is a Cyber Awareness and Policy Management System designed to enhance cybersecurity awareness and streamline policy management for an organization. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js), the system provides a centralized platform for policy distribution, role-based awareness training, digital acknowledgements, incident reporting, compliance tracking, notifications, and audit logging. The system targets approximately 20 users, including admins and employees across departments such as Service, Finance, and Purchasing.

The project aligns with the requirements of the IE3072 - Information Security and Policy Management course, focusing on practical implementation of security policies and awareness training. The system is responsive, accessible on PCs, laptops, and tablets, and designed for high usability with an onboarding introduction.

## Project Requirements

### Functional Requirements
- **User Management**: Register and authenticate users with role-based access (Admin/Employee).
- **Policy Management**: Upload policies, assign to users, and track acknowledgements.
- **Training and Quizzes**: Provide role-based training modules with quizzes and track completion.
- **Compliance Tracking**: Generate reports on user compliance with policies and trainings.
- **Incident Reporting**: Allow users to report incidents with optional file attachments.
- **Notifications**: Deliver in-app and email notifications for policy updates and overdue actions.
- **Audit Logging**: Log critical actions (e.g., policy publication, acknowledgements) for accountability.

### Non-Functional Requirements
- **Performance**: Support ~20 concurrent users with acceptable response times.
- **Availability**: Target >99% uptime during work hours.
- **Usability**: Minimal training required; include onboarding introduction.
- **Scalability**: Expandable to accommodate staff growth using the MERN stack.
- **Reliability**: Implement regular backups and recovery procedures.
- **Maintainability**: Modular codebase with version control and documentation.
- **Portability**: Accessible on PCs, laptops, and tablets with responsive design.
- **Security**: Use JWT authentication, HTTPS, input validation, and rate limiting.

## System Design

### Architecture
- **Frontend**: React.js with Tailwind CSS for a responsive UI.
- **Backend**: Node.js with Express.js, MongoDB for data storage.
- **API**: RESTful API with JWT authentication and role-based access control.
- **Communication**: HTTPS with JSON data exchange.

### Data Model
- **User**: `{ username, password (hashed), role, department, onboardingCompleted }`
- **Policy**: `{ title, description, fileUrl, assignedTo, version, createdAt, acknowledgedBy }`
- **Training**: `{ title, content, department, quizzes, completedBy }`
- **Incident**: `{ title, description, fileUrl, status, createdAt }`
- **Notification**: `{ type, message, read, createdAt }`
- **AuditLog**: `{ userId, action, details, timestamp }`

### Technology Stack
- **Frontend**: React.js, Tailwind CSS, Axios, React Router, React Toastify.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Nodemailer.
- **Development Tools**: VS Code, Git, Postman (for API testing).
- **Deployment**: Vercel (frontend), Node server or Heroku (backend).

## Implementation Details

### Backend Implementation
- **API Endpoints**: RESTful endpoints for authentication, policy management, training, compliance, incidents, notifications, and audits.
- **Authentication**: JWT tokens with 1-hour expiration, role-based middleware.
- **File Handling**: Local storage in `/uploads` (consider S3/GridFS for production).
- **Security**: Input validation, rate limiting, audit logging.

### Frontend Implementation
- **Components**: Modular structure with Auth, Dashboard, Policy, Training, Incident, Compliance, Notification, and Audit components.
- **State Management**: Context API for user authentication and global state.
- **Routing**: React Router for navigation between login, onboarding, and dashboard views.
- **Styling**: Tailwind CSS for responsive and customizable UI.
- **Features**:
  - **Login/Register**: Form-based authentication with role assignment.
  - **Onboarding**: Introductory page for new users.
  - **Dashboard**: Employee view (policies, trainings, incidents) and Admin view (management panels).
  - **Policy Management**: Upload, list, and acknowledge policies.
  - **Training**: Display modules and handle quizzes.
  - **Compliance**: Display compliance reports.
  - **Incident Reporting**: Form for submissions and admin management.
  - **Notifications**: Bell icon with dropdown and read status.
  - **Audit Logs**: Table view of logged actions.

### API Documentation
- **Base URL**: `http://localhost:5001/api`
- **Authentication**: JWT token in `Authorization` header.
- **Endpoints**:
  - `/auth/register`: POST to create user (Admin only).
  - `/auth/login`: POST to authenticate and get token.
  - `/auth/onboarding`: POST to complete onboarding.
  - `/policies/upload`: POST to upload policy (Admin only).
  - `/policies`: GET assigned policies.
  - `/policies/acknowledge`: POST to acknowledge policy.
  - `/trainings`: POST to create training (Admin only), GET to fetch trainings.
  - `/trainings/quiz`: POST to submit quiz answers.
  - `/compliance`: GET compliance report (Admin only).
  - `/incidents`: POST to submit incident, GET all incidents (Admin only).
  - `/incidents/status`: PUT to update incident status (Admin only).
  - `/notifications`: GET user notifications.
  - `/notifications/read`: PUT to mark notification as read.
  - `/audits`: GET audit logs (Admin only).

## Testing
- **Unit Testing**: Jest and React Testing Library for component testing.
- **Integration Testing**: Postman for API endpoint testing.
- **Manual Testing**: Verify functionality across roles, responsiveness on different devices.
- **Security Testing**: Check for XSS, CSRF, and authentication bypass.

## Deployment
- **Frontend**: Build with `npm run build` and deploy to Vercel.
- **Backend**: Deploy to Heroku or a custom Node server with MongoDB Atlas.
- **Environment Variables**: Use `.env` for API URL, JWT secret, and SMTP credentials.
- **Domain**: Secure with HTTPS (e.g., via Let’s Encrypt).

## Future Enhancements
- **Real-Time Updates**: Implement WebSockets for notifications and incidents.
- **Advanced Analytics**: Add charts for compliance trends (e.g., using Recharts).
- **Mobile App**: Develop native iOS/Android apps using React Native.
- **Multi-Language Support**: Add internationalization with `react-i18next`.
- **Cloud Storage**: Integrate AWS S3 for file uploads.
- **User Feedback**: Add a feedback form for continuous improvement.

## Maintenance
- **Version Control**: Use Git with branches for features and fixes.
- **Backup**: Schedule MongoDB backups.
- **Updates**: Regularly update dependencies and monitor security patches.
- **Monitoring**: Use tools like New Relic or Sentry for performance and errors.

## Conclusion
ShieldUp provides a robust solution for cybersecurity awareness and policy management, meeting all specified requirements. The system is scalable, secure, and user-friendly, with potential for future enhancements to support organizational growth and evolving security needs.