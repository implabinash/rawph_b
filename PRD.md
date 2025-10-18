## 1. Overview

- **Product:** Rawph Backend API
- **Version:** 1.0 (MVP)
- **Last Updated:** October 18, 2025
- **Owner:** Abinash Sahoo

### 1.1 Purpose

This document outlines the backend architecture, features, and technical specifications for Rawph's MVP - a collaborative learning platform enabling students to study together remotely through synchronized video watching, voice chat, and collaborative whiteboarding.

## 2. System Architecture

### 2.1 Tech Stack Recommendations

- **API Framework:** Hono
- **Database:** SQLite (D1)
- **Real-time:** Durable Objects
- **Authentication:** Session Based
- **OAuth:** Google OAuth 2.0

### 2.2 Architecture Pattern

- RESTful API for CRUD operations
- WebSocket server for real-time study session features

## 3. Database Schema

### 3.1 Users Table

```sql
users
├── id (UUID, Primary Key)
├── email (String, Unique, Required)
├── password (String, Nullable)
├── name (String, Required)
├── profile_picture (String, Nullable)
├── invite_code (String, Unique)
├── invited_by (UUID, Foreign Key -> users.id)
├── invites_remaining (Integer, Default: 2)
├── created_at (Timestamp)
├── updated_at (Timestamp)
└── last_login (Timestamp, Nullable)
```

### 3.2 Auth Sessions Table

```sql
auth_sessions
├── id (UUID, Primary Key)
├── token (String, Unique, Required)
├── user_id (UUID, Foreign Key -> users.id)
├── expires_at (Timestamp)
├── created_at (Timestamp)
└── updated_at (Timestamp)
```

### 3.3 Invites Table

```sql
invites
├── id (UUID, Primary Key)
├── code (String, Unique, Required, Index)
├── created_by (UUID, Foreign Key -> users.id)
├── used_by (UUID, Foreign Key -> users.id, Nullable)
├── is_used (Boolean, Default: false)
├── used_at (Timestamp, Nullable)
├── created_at (Timestamp)
└── updated_at (Timestamp)
```

### 3.4 Waitlist Table

```sql
waitlist
├── id (UUID, Primary Key)
├── email (String, Unique, Required)
├── name (String, Required)
├── created_at (Timestamp)
└── updated_at (Timestamp)
```

### 3.5 Study Sessions Table

```sql
study_sessions
├── id (UUID, Primary Key)
├── session_code (String, Unique, Required, Index)
├── created_by (UUID, Foreign Key -> users.id, Required)
├── participant_id (UUID, Foreign Key -> users.id, Nullable)
├── status (Enum: 'active', 'completed', 'abandoned', Default: 'active')
├── started_at (Timestamp, Required)
├── ended_at (Timestamp, Nullable)
├── duration_minutes (Integer, Nullable)
├── created_at (Timestamp)
└── updated_at (Timestamp)
```

### 3.6 YouTube Videos Table

```sql
session_videos
├── id (UUID, Primary Key)
├── session_id (UUID, Foreign Key -> study_sessions.id, Required)
├── youtube_url (String, Required)
├── added_by (UUID, Foreign Key -> users.id, Required)
├── added_at (Timestamp, Required)
└── removed_at (Timestamp, Nullable)
```

## 4. API Endpoints

Common Response Format

```json
{
    "success": "boolean",
    "data": {},
    "error": {},
    "message": "string"
}
```

### 4.1 Authentication Routes

#### POST `/api/auth/signup`

**Purpose:** Register new user with email/password

**Request Body:**

```json
{
    "email": "steve@jobs.com",
    "password": "steve@jobs",
    "name": "Steve Jobs"
}
```

**Responses:**

- `201`: Account created successfully
- `400`: Invalid invite code or invite already used
- `409`: Email already exists
- `422`: Validation errors
