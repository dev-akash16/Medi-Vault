# MediVault REST API Reference

Base URL: `http://localhost:5001/api`

---

## 🔐 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register/patient` | Register new patient account | No |
| `POST` | `/auth/register/doctor` | Register new doctor account (pending verification) | No |
| `POST` | `/auth/login` | Authenticate user & return JWT token + cookie | No |
| `POST` | `/auth/logout` | Clear session cookie & invalidate state | Yes |
| `GET` | `/auth/me` | Fetch active user session & profile | Yes |
| `POST` | `/auth/forgot-password` | Issue password reset request | No |

### Request: Register Patient
```json
POST /api/auth/register/patient
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!",
  "phone": "+1 555-0199",
  "dateOfBirth": "1990-05-15",
  "gender": "female",
  "bloodGroup": "O+",
  "address": "456 Health Way, Boston, MA"
}
```

---

## 👤 2. Patient Profile & Clinical History (`/api/patients`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/patients/profile` | Get patient personal profile | Patient |
| `PUT` | `/patients/profile` | Update demographics & emergency contact | Patient |
| `GET` | `/patients/history` | Get patient medical history dossier | Patient / Authorized Doctor |
| `PUT` | `/patients/history` | Update patient background history | Patient / Authorized Doctor |
| `GET` | `/patients/conditions` | List diagnosed medical conditions | Patient / Authorized Doctor |
| `GET` | `/patients/allergies` | List diagnosed allergies & severity | Patient / Authorized Doctor |
| `POST` | `/patients/allergies` | Record new allergy | Patient / Authorized Doctor |
| `DELETE` | `/patients/allergies/:id`| Remove allergy record | Patient / Authorized Doctor |

---

## 🩺 3. Consultations (`/api/consultations`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/consultations` | Record new clinical consultation encounter | Authorized Doctor |
| `GET` | `/consultations/patient/:patientId` | List patient's past consultations | Patient / Authorized Doctor |
| `GET` | `/consultations/:id` | Get detailed consultation record | Patient / Authorized Doctor |
| `PATCH`| `/consultations/:id/amend` | Add formal clinical amendment | Authoring Doctor |

---

## 💊 4. Prescriptions (`/api/prescriptions`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/prescriptions` | Issue new structured e-prescription | Authorized Doctor |
| `GET` | `/prescriptions/patient/:patientId` | Get patient's prescriptions | Patient / Authorized Doctor |
| `GET` | `/prescriptions/:id` | Get single prescription details | Patient / Authorized Doctor |
| `GET` | `/prescriptions/active` | Get patient's currently active medicines | Patient |

---

## 🧪 5. Lab Reports (`/api/reports`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/reports/upload` | Upload report with optional PDF attachment | Patient / Authorized Doctor |
| `GET` | `/reports/patient/:patientId` | List laboratory reports | Patient / Authorized Doctor |
| `GET` | `/reports/:id` | Get report parameters & file link | Patient / Authorized Doctor |

---

## 📊 6. Health Vitals & Measurements (`/api/vitals`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/vitals` | Log new physiological measurement | Patient / Authorized Doctor |
| `GET` | `/vitals/patient/:patientId` | Get historical measurements | Patient / Authorized Doctor |
| `GET` | `/vitals/patient/:patientId/summary`| Get latest vitals & trend analytics | Patient / Authorized Doctor |

---

## 📅 7. Appointments (`/api/appointments`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/appointments` | Schedule clinical appointment | Patient / Doctor |
| `GET` | `/appointments` | List user's appointments | Patient / Doctor |
| `PATCH`| `/appointments/:id/status` | Update appointment status (confirmed, completed, cancelled) | Patient / Doctor |

---

## 🔑 8. Doctor Access Consent & Permissions (`/api/access`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/access/request` | Doctor requests access to patient records | Verified Doctor |
| `GET` | `/access/requests` | List access requests for user | Patient / Doctor |
| `POST` | `/access/requests/:requestId/respond` | Patient approves or rejects request | Patient |
| `GET` | `/access/permissions` | Patient lists active doctor permissions | Patient |
| `DELETE`| `/access/permissions/:id/revoke` | Patient immediately revokes doctor access | Patient |

---

## 🔍 9. Search & Verification (`/api/search`, `/api/doctors`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/search/global` | Global search across records | Authenticated |
| `GET` | `/doctors/search` | Search verified doctors by specialty/name | Authenticated |
| `GET` | `/doctors/profile` | Get doctor's professional profile | Doctor |
| `PUT` | `/doctors/profile` | Update doctor's clinic info & qualifications | Doctor |
| `GET` | `/doctors/patients` | List patients who authorized this doctor | Doctor |

---

## 🛡️ 10. Admin Governance & Audit (`/api/admin`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/admin/dashboard` | Platform metrics & account statistics | Admin |
| `GET` | `/admin/users` | List platform users with filter & search | Admin |
| `PATCH`| `/admin/users/:userId/status` | Suspend or reactivate user account | Admin |
| `GET` | `/admin/doctors/pending` | List doctors awaiting license verification | Admin |
| `POST` | `/admin/doctors/:doctorId/verify`| Approve or reject doctor credentials | Admin |
| `GET` | `/admin/audit-logs` | Retrieve immutable system audit journal | Admin |

---

## 🤖 11. AI Clinical Assistant (`/api/ai`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/ai/summarize-history` | Generate clinical summary of patient timeline | Authorized Doctor |
| `POST` | `/ai/check-interactions` | Check drug-drug interactions for medications | Authorized Doctor |
