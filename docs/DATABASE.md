# MediVault Database Architecture & Mongoose Schema Reference

MediVault uses MongoDB as its primary document database, structured via Mongoose ORM. The architecture enforces relational consistency while capitalizing on document flexibility for complex clinical data (e.g. structured prescriptions, laboratory parameters, and immutable audit trails).

---

## 🗄️ Collections Overview

```
                                      ┌──────────────┐
                                      │     User     │
                                      └──┬─────────┬─┘
                                         │         │
                 ┌───────────────────────┘         └────────────────────────┐
                 ▼                                                          ▼
        ┌──────────────────┐                                      ┌──────────────────┐
        │  PatientProfile  │                                      │  DoctorProfile   │
        └──┬─────────────┬─┘                                      └──┬─────────────┬─┘
           │             │                                           │             │
           │             │            ┌────────────────────┐         │             │
           │             └───────────►│  AccessPermission  │◄────────┘             │
           │                          └────────────────────┘                       │
           │                          ┌────────────────────┐                       │
           │                          │DoctorAccessRequest │◄──────────────────────┘
           │                          └────────────────────┘
           ├───────────────┬─────────────────┬──────────────────┬─────────────────┐
           ▼               ▼                 ▼                  ▼                 ▼
   ┌───────────────┐┌──────────────┐ ┌───────────────┐ ┌────────────────┐ ┌───────────────┐
   │ MedicalHistory││ Consultation │ │ Prescription  │ │LabReport/Vitals│ │  Appointment  │
   └───────────────┘└──────────────┘ └───────────────┘ └────────────────┘ └───────────────┘
```

---

## 1. Identity & Profile Schemas

### `User`
Stores system authentication identity, role credentials, and account status.
- `name`: String, required
- `email`: String, required, unique, lowercase
- `password`: String (bcrypt hashed)
- `role`: Enum: `['patient', 'doctor', 'admin']`
- `accountStatus`: Enum: `['active', 'suspended', 'pending']`
- `avatar`: String (URL or path)
- `timestamps`: `createdAt`, `updatedAt`

### `PatientProfile`
Stores patient demographic data, emergency contacts, and the unique healthcare identifier.
- `user`: ObjectId -> `User` (ref)
- `patientId`: String, unique (e.g. `MV-PAT-2026-0001`)
- `dateOfBirth`: Date
- `gender`: Enum: `['male', 'female', 'other', 'prefer_not_to_say']`
- `bloodGroup`: Enum: `['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']`
- `phone`: String
- `address`: String
- `emergencyContact`: Subdocument `{ name, relationship, phone }`

### `DoctorProfile`
Stores clinical qualifications, licensing, practice location, and administrative verification status.
- `user`: ObjectId -> `User` (ref)
- `doctorId`: String, unique (e.g. `MV-DOC-2026-0001`)
- `specialization`: String (e.g. `Cardiology`, `Neurology`, `General Medicine`)
- `qualifications`: String (e.g. `MD, FACC`)
- `registrationNumber`: String (Medical Council Licensure)
- `experienceYears`: Number
- `clinicName`: String
- `consultationAddress`: String
- `verificationStatus`: Enum: `['pending', 'verified', 'rejected']`
- `verifiedAt`: Date
- `verifiedBy`: ObjectId -> `User` (ref)

---

## 2. Clinical Records Schemas

### `Consultation`
Represents an encounter between an authorized doctor and a patient.
- `consultationId`: String, unique (e.g. `MV-CON-2026-0001`)
- `patient`: ObjectId -> `PatientProfile` (ref)
- `doctor`: ObjectId -> `DoctorProfile` (ref)
- `date`: Date
- `chiefComplaint`: String
- `symptoms`: [String]
- `clinicalObservations`: String
- `diagnoses`: Array of `{ icdCode, description, type: ['primary', 'secondary'] }`
- `treatmentPlan`: String
- `precautions`: [String]
- `recommendedTests`: [String]
- `followUpDate`: Date
- `status`: Enum: `['completed', 'in_progress', 'cancelled']`
- `amendments`: Array of `{ amendedAt, note, doctor: ObjectId }`

### `Prescription`
Immutable e-prescription issued by an authorized doctor.
- `prescriptionId`: String, unique (e.g. `MV-RX-2026-0001`)
- `patient`: ObjectId -> `PatientProfile` (ref)
- `doctor`: ObjectId -> `DoctorProfile` (ref)
- `consultation`: ObjectId -> `Consultation` (optional ref)
- `date`: Date
- `medicines`: Array of:
  - `name`: String
  - `genericName`: String
  - `dosage`: String (e.g. `50mg`)
  - `frequency`: String (e.g. `Twice daily (BD)`)
  - `duration`: String (e.g. `30 days`)
  - `instructions`: String (e.g. `Take after food`)
  - `refills`: Number
- `notes`: String
- `isActive`: Boolean

### `HealthMeasurement` (Vitals)
Chronological physiological observations.
- `patient`: ObjectId -> `PatientProfile` (ref)
- `recordedBy`: ObjectId -> `User` (ref)
- `recordedAt`: Date
- `bloodPressure`: `{ systolic: Number, diastolic: Number }`
- `heartRate`: Number (BPM)
- `weight`: Number (kg)
- `height`: Number (cm)
- `bmi`: Number
- `oxygenSaturation`: Number (SpO2 %)
- `temperature`: Number (°F)
- `bloodGlucose`: Number (mg/dL)

### `LabReport`
Diagnostic investigation documents and structured lab values.
- `reportId`: String, unique (e.g. `MV-REP-2026-0001`)
- `patient`: ObjectId -> `PatientProfile` (ref)
- `testName`: String
- `category`: Enum: `['hematology', 'biochemistry', 'radiology', 'pathology', 'cardiology', 'other']`
- `date`: Date
- `laboratoryName`: String
- `fileUrl`: String
- `parameters`: Array of `{ name, value, unit, referenceRange, flag: ['normal', 'high', 'low', 'critical'] }`
- `doctorNotes`: String

---

## 3. Consent & Governance Schemas

### `AccessPermission`
Represents explicit patient authorization granting a doctor access to their records.
- `patient`: ObjectId -> `PatientProfile` (ref)
- `doctor`: ObjectId -> `DoctorProfile` (ref)
- `status`: Enum: `['active', 'revoked', 'expired']`
- `scope`: Enum: `['all', 'prescriptions_only', 'reports_only', 'consultations_only']`
- `grantedAt`: Date
- `expiresAt`: Date
- `revokedAt`: Date

### `AuditLog`
Immutable system audit record tracking every clinical disclosure.
- `actor`: ObjectId -> `User` (ref)
- `actorName`: String
- `actorRole`: Enum: `['patient', 'doctor', 'admin', 'system']`
- `action`: String (e.g. `CLINICAL_RECORD_ACCESSED`, `ACCESS_GRANTED`, `PRESCRIPTION_ISSUED`)
- `targetType`: String
- `targetId`: ObjectId
- `purpose`: String
- `ipAddress`: String
- `userAgent`: String
- `timestamp`: Date
