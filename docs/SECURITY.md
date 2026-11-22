# MediVault Healthcare Security, Consent & HIPAA Alignment

MediVault is architected to satisfy healthcare privacy, data sovereignty, and auditability principles aligned with standards such as HIPAA (Health Insurance Portability and Accountability Act) and GDPR Health Data governance.

---

## 🛡️ 1. Core Security Principles

### Sovereign Patient Consent
1. **Zero Default Access**: A medical practitioner account has zero access to any patient's records upon registration.
2. **Explicit Authorization**: Access is only granted when the patient approves an incoming `DoctorAccessRequest` or manually issues an `AccessPermission`.
3. **Instant Revocation**: A patient can revoke access at any second. Revocation updates the status to `revoked`, which immediately blocks subsequent requests at the server middleware layer.

---

## 🔒 2. Multi-Tier Server-Side Route Guard Architecture

MediVault enforces authorization strictly on the Node.js API server. The client UI is treated as untrusted and is never used as a security boundary.

```
Incoming Request
      │
      ▼
┌───────────────┐
│   auth.js     │  <-- Verifies Bearer JWT token signature & validates user accountStatus
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  roleCheck.js │  <-- Ensures actor holds the required role ('patient', 'doctor', 'admin')
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ accessCheck.js│  <-- (If doctor accessing patient record) Checks active AccessPermission
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Controller &  │  <-- Executes business logic & records immutable entry in AuditLog
│ Audit Logging │
└───────────────┘
```

---

## 📜 3. Immutable Audit Logging

Every clinical record interaction is logged via `server/services/auditService.js`. Audit entries are write-only and cannot be altered or removed.

### Logged Events:
- `USER_LOGIN` / `USER_REGISTER`
- `ACCESS_REQUESTED`
- `ACCESS_GRANTED` / `ACCESS_REVOKED`
- `CLINICAL_RECORD_ACCESSED`
- `CONSULTATION_CREATED` / `CONSULTATION_AMENDED`
- `PRESCRIPTION_ISSUED`
- `LAB_REPORT_UPLOADED`
- `DOCTOR_VERIFIED` / `DOCTOR_REJECTED`
- `USER_SUSPENDED` / `USER_REACTIVATED`

Each audit entry captures:
- Actor User ID, Name, and Role
- Target Entity Model and Document ID
- Purpose / Justification
- Client Origin IP Address
- HTTP User-Agent
- Exact ISO Timestamp

---

## 🔑 4. Administrative Data Safeguards

- **No Blanket Medical Record Access**: MediVault administrators do not have unrestricted default browsing of patient health charts, medical conditions, or diagnostic consultations.
- **Administrative Functions are Restricted**: Administrators manage platform accounts, verify practitioner credentials, review system telemetry, and inspect security audit logs.
- **Credential Verification Governance**: Doctors registered on the platform are unverified by default and cannot issue prescriptions until vetted and approved by an administrator.

---

## 🔐 5. Cryptography & Storage Security

- **Password Hashing**: Industry-standard `bcryptjs` with salt rounds = 10. No plaintext passwords ever hit the database or logs.
- **Token Security**: JWT signed with secret keys, with expiration deadlines (`7d`), delivered via `Authorization: Bearer` and secure HttpOnly cookies in production.
- **Rate Limiting**: `express-rate-limit` prevents brute-force login attempts and API resource abuse.
- **No Sensitive Records in LocalStorage**: The patient's confidential clinical history is kept strictly in volatile memory during active authenticated sessions and is never cached in browser localStorage.
