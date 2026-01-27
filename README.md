# Footy

An online footwear store built with Next.js and FastAPI.

## Overview

Footy is a full-stack e-commerce platform for purchasing footwear. It features a modern, responsive frontend with a robust backend API, supporting the complete shopping experience from browsing to checkout.

## Features

- **Product Catalog**: Browse footwear by category (Sneakers, Running, Boots)
- **Search & Filtering**: Find products by name, brand, size, price, and more
- **User Accounts**: Registration, login, and profile management
- **Shopping Cart**: Persistent cart that survives login and page refresh
- **Checkout Flow**: Streamlined purchase process with order confirmation
- **Order History**: View past orders and order details
- **Wishlist**: Save products for later
- **Admin Panel**: Manage products, categories, and orders

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Material UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy (async)
- **Migrations**: Alembic
- **Caching**: Redis
- **Task Queue**: Celery
- **Authentication**: JWT with RBAC

## Project Structure

```
project/
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js pages and routes
│   │   ├── components/    # Reusable React components
│   │   ├── stores/        # Zustand state stores
│   │   ├── lib/           # Utilities and API client
│   │   ├── hooks/         # Custom React hooks
│   │   └── types/         # TypeScript type definitions
│   └── public/            # Static assets
├── backend/               # FastAPI backend application
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   └── db/           # Database configuration
│   └── alembic/          # Database migrations
└── docs/                  # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- Redis

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Install dependencies:
   ```bash
   pip install -e .
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database and Redis credentials
   ```

5. Run database migrations:
   ```bash
   alembic upgrade head
   ```

6. Seed the database (optional):
   ```bash
   python -m app.db.seed
   ```

7. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API URL
   ```

4. Start the development server:
   ```bash
   bun run dev
   ```

The application will be available at `http://localhost:3000`.

## API Documentation

Once the backend is running, API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
bun run test
```

## Default Accounts

After seeding the database, the following accounts are available:

| Role  | Email            | Password  |
|-------|------------------|-----------|
| Admin | admin@footy.com  | admin123  |
| User  | user@footy.com   | user1234  |

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/footy
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)
```
# API URL must include the full path including /api/v1
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## License

This project is proprietary software.
