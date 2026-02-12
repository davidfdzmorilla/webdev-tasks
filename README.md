# WebDev Tasks

A production-ready task management application built with Next.js 15, PostgreSQL, and Better-Auth.

## Features

- ✅ User authentication with Better-Auth (email/password)
- ✅ Create, read, update, delete tasks
- ✅ Task status management (todo, in_progress, done)
- ✅ Priority levels (low, medium, high)
- ✅ Categories and tags
- ✅ Due dates
- ✅ Responsive UI with Tailwind CSS 4
- ✅ TypeScript strict mode
- ✅ Docker containerized deployment
- ✅ Production-ready with SSL

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS 4
- **Backend**: Next.js Server Actions, Node.js 22
- **Database**: PostgreSQL 17 with Drizzle ORM 0.41.0
- **Auth**: Better-Auth 1.4.18 (email/password)
- **Deployment**: Docker, Docker Compose, Nginx, Let's Encrypt

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local

# Start PostgreSQL with Docker
docker compose up -d postgres

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

Visit http://localhost:3000

### Production Deployment

```bash
# Build and start with Docker
docker compose up -d --build
```

## Project Structure

```
webdev-tasks/
├── app/
│   ├── auth/              # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/         # Main task management page
│   └── api/
│       └── auth/          # Better-Auth routes
├── components/            # React components
│   ├── CreateTaskForm.tsx
│   ├── TaskList.tsx
│   └── SignOutButton.tsx
├── lib/
│   ├── auth.ts           # Better-Auth configuration
│   └── db/               # Database schema & client
│       ├── schema.ts
│       └── index.ts
├── docker-compose.yml
├── Dockerfile
└── drizzle.config.ts
```

## Database Schema

### Core Tables

- **users**: User accounts (Better-Auth)
  - `id`: text (primary key, Better-Auth generates custom IDs)
  - `email`: varchar(255) unique
  - `name`: varchar(255)
  - `email_verified`: boolean
  - `created_at`, `updated_at`: timestamp

- **sessions**: Active sessions
  - `id`: text (primary key)
  - `user_id`: text (FK → users.id)
  - `token`: text unique
  - `expires_at`: timestamp
  - `ip_address`, `user_agent`: text
  - `created_at`, `updated_at`: timestamp

- **accounts**: Authentication credentials
  - `id`: text (primary key)
  - `user_id`: text (FK → users.id)
  - `provider_id`: text (e.g., "credential")
  - `password`: text (hashed)
  - `created_at`, `updated_at`: timestamp

- **tasks**: User tasks
  - `id`: uuid (primary key)
  - `user_id`: text (FK → users.id)
  - `title`: varchar(255)
  - `description`: text
  - `status`: varchar(50) (todo, in_progress, done)
  - `priority`: varchar(50) (low, medium, high)
  - `due_date`: timestamp
  - `created_at`, `updated_at`: timestamp

- **categories**: Task categories
  - `id`: uuid (primary key)
  - `user_id`: text (FK → users.id)
  - `name`: varchar(100)
  - `color`: varchar(7) (hex color)

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://webdev_user:webdev_pass@localhost:5432/webdev_tasks

# Better-Auth
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

## Development Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:generate      # Generate migrations
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Drizzle Studio

# Docker
docker compose up -d          # Start all services
docker compose down           # Stop all services
docker compose logs -f app    # View logs
```

## API Endpoints

### Authentication (Better-Auth)

- `POST /api/auth/sign-up/email` - Register new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "User Name"
  }
  ```

- `POST /api/auth/sign-in/email` - Login
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/sign-out` - Logout
  ```json
  {}
  ```

- `GET /api/auth/get-session` - Get current session

### Tasks (Server Actions)

Tasks are managed via Next.js Server Actions in the dashboard.

## Deployment

Deployed at: **https://tasks.davidfdzmorilla.dev**

### Infrastructure

- **Host**: Hetzner CX32 VPS (Ubuntu 24.04 ARM64)
- **Reverse Proxy**: Nginx with Let's Encrypt SSL
- **CDN**: Cloudflare (proxied, SSL/TLS Full)
- **Container**: Docker multi-stage build
- **Database**: PostgreSQL 17 in Docker

### Docker Compose

```yaml
services:
  app:
    build: .
    ports:
      - "3004:3000"
    depends_on:
      - postgres

  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: webdev_user
      POSTGRES_PASSWORD: webdev_pass
      POSTGRES_DB: webdev_tasks
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

## Better-Auth Configuration Notes

**Critical**: This project uses Better-Auth 1.4.18 which requires:

1. **Drizzle ORM Version**: Must use `drizzle-orm@0.41.0` (not 0.45.x)
2. **ID Types**: All Better-Auth tables use `text` IDs, not UUIDs
3. **Required Fields**:
   - `accounts.password`: For email/password auth
   - `accounts.updated_at`: Timestamp field
   - `sessions.token`: Unique session token
   - `sessions.ip_address`, `sessions.user_agent`: Optional tracking
   - `sessions.created_at`, `sessions.updated_at`: Timestamps

### Schema Example

```typescript
export const users = pgTable('users', {
  id: text('id').primaryKey(),  // text, not uuid!
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  emailVerified: boolean('email_verified').default(false),
  // ...
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  password: text('password'),  // Required for email/password
  // ...
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  token: text('token').notNull().unique(),  // Required
  // ...
});
```

## Quality Gates

✅ All passing:
- TypeScript strict mode: Zero errors
- ESLint: Zero warnings
- Production build: Success
- Docker build: Success
- Authentication: Fully functional (registration, login, logout)

## Known Issues & Solutions

### Issue: "Content-Type application/x-www-form-urlencoded is not allowed"

**Solution**: Use JSON for Better-Auth endpoints. The logout button uses a client component with `fetch()` and `Content-Type: application/json`.

### Issue: "The field 'X' does not exist in the schema"

**Solution**: Ensure all Better-Auth required fields are present in your Drizzle schema. Run `pnpm db:push` after schema changes.

### Issue: "invalid input syntax for type uuid"

**Solution**: Better-Auth generates text IDs, not UUIDs. All ID fields in auth tables must be `text`, not `uuid`.

## License

MIT

## Author

David Fernández ([@davidfdzmorilla](https://github.com/davidfdzmorilla))

## Links

- **Live App**: https://tasks.davidfdzmorilla.dev
- **GitHub**: https://github.com/davidfdzmorilla/webdev-tasks
- **Portfolio**: https://webdev.davidfdzmorilla.dev
