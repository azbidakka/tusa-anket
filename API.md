# TUSA Anket Sistemi - API Dokümantasyonu

## Base URL
```
Development: http://localhost:3000/api
Production: https://anket.tusahastanesi.com/api
```

## Authentication

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@tusahastanesi.com",
  "password": "TusaAdmin2024!"
}

Response:
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "admin1",
    "email": "admin@tusahastanesi.com",
    "role": "admin"
  }
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response:
{
  "token": "eyJhbGc..."
}
```

## Surveys (Admin)

### List Surveys
```http
GET /surveys
Authorization: Bearer {token}

Response:
[
  {
    "id": "survey1",
    "name": "Ayaktan Hasta Anketi",
    "slug": "ayaktan-hasta",
    "is_active": true,
    "questions": [...]
  }
]
```

### Get Survey
```http
GET /surveys/:id
Authorization: Bearer {token}
```

### Create Survey
```http
POST /surveys
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Yeni Anket",
  "slug": "yeni-anket",
  "description": "Açıklama",
  "is_active": true,
  "require_unique_token": true,
  "questions": [...]
}
```

### Update Survey
```http
PUT /surveys/:id
Authorization: Bearer {token}
Content-Type: application/json
```

### Delete Survey
```http
DELETE /surveys/:id
Authorization: Bearer {token}
```

## Links (Admin)

### Create Link
```http
POST /links
Authorization: Bearer {token}
Content-Type: application/json

{
  "template_id": "survey1",
  "label": "SMS Kampanyası",
  "channel": "SMS",
  "expires_at": "2024-12-31T23:59:59Z",
  "utm_source": "sms",
  "utm_campaign": "winter2024",
  "unique": true
}

Response:
{
  "id": "link1",
  "url": "https://anket.tusahastanesi.com/s/ayaktan-hasta?token=abc123",
  "token": "abc123",
  ...
}
```

### Generate QR Code
```http
POST /links/qr
Authorization: Bearer {token}
Content-Type: application/json

{
  "url": "https://anket.tusahastanesi.com/s/ayaktan-hasta?token=abc123"
}

Response:
{
  "qrCode": "data:image/png;base64,iVBORw0KGgo..."
}
```

### List Links
```http
GET /links?template_id=survey1
Authorization: Bearer {token}
```

## Responses (Admin)

### List Responses
```http
GET /responses?template_id=survey1&start_date=2024-01-01&end_date=2024-12-31
Authorization: Bearer {token}

Query Parameters:
- template_id: Filter by survey
- start_date: ISO date
- end_date: ISO date
- department: Filter by department
- doctor: Filter by doctor
- channel: Filter by channel (SMS, WhatsApp, E-posta, QR)
```

### Get Response Detail
```http
GET /responses/:id
Authorization: Bearer {token}

Response:
{
  "id": "resp1",
  "template_id": "survey1",
  "submitted_at": "2024-01-15T10:30:00Z",
  "channel": "SMS",
  "nps": 9,
  "overall_score": 4.5,
  "items": [
    {
      "question_id": "q1",
      "value": 5
    }
  ]
}
```

### Dashboard Stats
```http
GET /responses/stats/dashboard
Authorization: Bearer {token}

Response:
{
  "totalResponses": 150,
  "changePercent": 12.5,
  "avgSatisfaction": 4.2,
  "avgNPS": 8.5
}
```

## Public Routes

### Get Survey Form
```http
GET /public/survey/:slug?token=abc123

Response:
{
  "id": "survey1",
  "name": "Ayaktan Hasta Anketi",
  "description": "...",
  "sections": [...],
  "questions": [...]
}
```

### Submit Survey
```http
POST /public/survey/:slug/submit
Content-Type: application/json

{
  "token": "abc123",
  "kvkk_consent": true,
  "answers": {
    "q1": 5,
    "q2": 4,
    "q3": "Çok memnun kaldım",
    "q9": 9
  },
  "department": "Kardiyoloji",
  "doctor": "Dr. Ahmet Yılmaz",
  "patient_type": "Ayaktan"
}

Response:
{
  "success": true,
  "id": "resp1"
}
```

## Settings (Admin)

### Get Settings
```http
GET /settings
Authorization: Bearer {token}
```

### Update Settings
```http
PUT /settings
Authorization: Bearer {token}
Content-Type: application/json

{
  "organization_name": "TUSA Hospital",
  "logo_url": "https://...",
  "require_unique_token": true,
  "enable_sms_otp": false
}
```

### List Departments
```http
GET /settings/departments
Authorization: Bearer {token}
```

### List Doctors
```http
GET /settings/doctors
Authorization: Bearer {token}
```

## Error Responses

```json
{
  "error": "Hata mesajı"
}
```

### Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Rate Limiting

- Survey submission: 5 requests per 24 hours per IP
- Other endpoints: No limit (admin authenticated)

## CORS

Allowed origins:
- Development: http://localhost:5173
- Production: https://anket.tusahastanesi.com
