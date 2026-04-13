# Honalu Backend — NestJS API

REST API for the Honalu Navodayan Matrimonial platform.

## Tech Stack

- **NestJS** — TypeScript backend framework
- **PostgreSQL** — Relational database
- **TypeORM** — ORM with auto-migrations (dev) and manual migrations (prod)
- **Passport + JWT** — Authentication
- **class-validator** — Request validation

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ running locally (or use Docker)

### Quick Start with Docker (PostgreSQL only)

```bash
docker run --name honalu-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=honalu -p 5432:5432 -d postgres:15
```

### Install & Run

```bash
cp .env.example .env        # edit DATABASE_URL if needed
npm install
npm run start:dev            # http://localhost:3000/api
```

## API Endpoints

### Auth
| Method | Endpoint           | Description          | Auth |
|--------|--------------------|----------------------|------|
| POST   | `/api/auth/register` | Register new user   | No   |
| POST   | `/api/auth/login`    | Login, get JWT      | No   |
| GET    | `/api/auth/me`       | Get current user    | Yes  |

### Profiles
| Method | Endpoint              | Description                    | Auth |
|--------|-----------------------|--------------------------------|------|
| POST   | `/api/profiles`       | Create profile                 | Yes  |
| GET    | `/api/profiles`       | List/search profiles (paginated) | Yes |
| GET    | `/api/profiles/me`    | Get my profile                 | Yes  |
| GET    | `/api/profiles/:id`   | Get profile by ID              | Yes  |
| PUT    | `/api/profiles/:id`   | Update profile                 | Yes  |
| DELETE | `/api/profiles/:id`   | Delete profile                 | Yes  |

### Filters
| Method | Endpoint        | Description                      | Auth |
|--------|-----------------|----------------------------------|------|
| GET    | `/api/filters`  | Get filter dropdown values       | Yes  |

### Connections
| Method | Endpoint                  | Description              | Auth |
|--------|---------------------------|--------------------------|------|
| POST   | `/api/connections`        | Send interest request    | Yes  |
| GET    | `/api/connections/received` | Received requests      | Yes  |
| GET    | `/api/connections/sent`     | Sent requests          | Yes  |
| PATCH  | `/api/connections/:id`    | Accept/reject/cancel     | Yes  |

## Search/Filter Query Parameters

`GET /api/profiles?gender=Female&religion=Hindu&city=Bengaluru&page=1&limit=20`

Supported: `gender`, `maritalStatus`, `religion`, `caste`, `motherTongue`, `country`, `city`, `education`, `ageMin`, `ageMax`, `page`, `limit`

## Deployment

### Railway (recommended)

1. Push to GitHub
2. Connect repo in [Railway](https://railway.app)
3. Add PostgreSQL service
4. Set env vars: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`, `CORS_ORIGINS`
5. Railway auto-detects and deploys

### Docker

```bash
docker build -t honalu-api .
docker run -p 3000:3000 --env-file .env honalu-api
```
