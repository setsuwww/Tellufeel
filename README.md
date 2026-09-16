# Confession App

My first fullstack development training project, built to explore and practice the complete software development lifecycle — from choosing the technology stack and designing the system, to UI/UX, development, testing, optimization, CI/CD, build, and production deployment.

Confession App is a simple platform where users can create a personal confession message and privately share it with someone special through a unique link.

## Development Process

This project was developed as a practical exploration of:

- Technology Selection
- System Design
- UI/UX Design
- Frontend Development
- Backend & API Integration
- Database Design
- Authentication & Authorization
- Security & Data Protection
- Unit & End-to-End Testing
- Performance & Optimization
- CI/CD
- Production Build & Deployment

## Tech Stack

### Frontend

- Vue 3
- Vite
- Tailwind CSS

### Backend & Database

- PostgreSQL
- Supabase
- Supabase Edge Functions
- Row Level Security (RLS)

### Testing

- Vitest
- Cypress
- Postman

### Development & Deployment

- Git
- GitHub
- GitHub Actions
- Vercel
- ESLint

## Main Features

- Create a personal confession
- Generate a unique recipient link
- Send confession privately to the intended recipient
- Recipient can respond with `MAU` or `NGGA_MAU`
- Recipient can provide a reason when rejecting
- Creator can view their confession responses
- Token-based recipient access
- Protected creator data with Supabase RLS
- Automated unit and E2E testing
- CI/CD pipeline for code quality and production readiness

## Architecture

```text
Vue 3 + Vite
      │
      ├── Vue Router
      ├── Tailwind CSS
      └── Services
            │
            ▼
      Supabase
      ├── PostgreSQL
      ├── Authentication
      ├── RLS
      └── Edge Functions
            │
            ▼
       Production
         Vercel
