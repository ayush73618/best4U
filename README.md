# Best4U

Best4U is a modular web application that brings calculators, productivity tools, document tools, and account-based features into one platform.

The repository contains:

- `best4u-FrontEnd`: Angular 22 single-page application.
- `best4u-backend`: Spring Boot modular monolith with JWT authentication, PostgreSQL persistence, and REST APIs.

## Current Architecture

```text
Angular frontend (localhost:4200)
          |
          | HTTP/JSON: http://localhost:8080/api
          v
Spring Boot backend (localhost:8080)
          |
          v
PostgreSQL database: best4u
```

The backend is intentionally one deployable application rather than multiple microservices. Its feature areas are organized into modules such as authentication, products, todos, notes, and habits.

## Features

- Angular standalone application with lazy-loaded feature routes.
- Financial calculators: EMI, SIP, PPF, SWP, RD, and FD.
- Work tools: todos, notes, and habits.
- Document tools and file-upload support.
- User registration and login with BCrypt password hashing.
- Stateless JWT authentication.
- User-owned work data protected by the authenticated user ID.
- Shared API response envelope: `{ success, message, data }`.
- PostgreSQL persistence through Spring Data JPA.

Some platform areas are still under development. Check the source and `ARCHITECTURE.md` before treating a route as production-ready.

## Prerequisites

Install the following before running the project:

- Git
- Node.js compatible with the Angular 22 toolchain and npm
- Java 17 or newer
- Maven 3.9 or newer
- PostgreSQL 14 or newer

Verify the tools:

```bash
git --version
node --version
npm --version
java --version
mvn --version
psql --version
```

## Database Setup

Create a PostgreSQL database named `best4u`:

```sql
CREATE DATABASE best4u;
```

The current local configuration expects:

| Setting  | Local value |
| -------- | ----------- |
| Host     | `localhost` |
| Port     | `5432`      |
| Database | `best4u`    |
| Username | `postgres`  |
| Password | `postgres`  |

Change the backend configuration or use environment variables when your PostgreSQL credentials differ. Never use these sample values in a production deployment.

## Run Locally

Open two terminals from the repository root.

### 1. Start the backend

```bash
cd best4u-backend
mvn spring-boot:run
```

The backend starts on `http://localhost:8080` and uses `/api` as its context path. For example:

- `POST http://localhost:8080/api/auth/register`
- `POST http://localhost:8080/api/auth/login`
- `GET http://localhost:8080/api/products`
- `GET http://localhost:8080/api/work/todos`

The backend uses `spring.jpa.hibernate.ddl-auto=update` for local development, so JPA creates or updates tables from the entities. Use migrations such as Flyway or Liquibase before a serious production deployment.

### 2. Start the frontend

```bash
cd best4u-FrontEnd
npm install
npm start
```

Open <http://localhost:4200>.

The frontend development environment currently points to `http://localhost:8080/api`. The authentication interceptor adds the JWT bearer token automatically after login.

## Useful Commands

### Frontend

Run these from `best4u-FrontEnd`:

```bash
npm start       # Development server
npm run build   # Production build
npm test        # Unit tests
npm run watch   # Development watch build
```

The production build is written to `best4u-FrontEnd/dist/`.

### Backend

Run these from `best4u-backend`:

```bash
mvn spring-boot:run  # Start the API
mvn test             # Run backend tests
mvn clean package    # Build the executable JAR
java -jar target/best4u-backend-0.0.1-SNAPSHOT.jar
```

## Configuration and Secrets

The checked-in backend properties contain development defaults. Before deploying publicly, replace the database password and JWT secret through environment variables or an external secrets manager.

Spring Boot environment variable equivalents include:

```text
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
BEST4U_JWT_SECRET
BEST4U_JWT_EXPIRATION_MS
```

For PowerShell, an example local override is:

```powershell
$env:SPRING_DATASOURCE_PASSWORD = "your-local-password"
$env:BEST4U_JWT_SECRET = "a-long-random-production-secret"
mvn spring-boot:run
```

Do not commit `.env` files, private keys, database dumps, generated build output, or real credentials. The root `.gitignore` covers the common frontend, backend, IDE, build, log, and environment files.

## Project Structure

```text
best4U/
├── README.md
├── ARCHITECTURE.md
├── .gitignore
├── best4u-FrontEnd/
│   ├── package.json
│   ├── angular.json
│   └── src/app/
│       ├── core/        # Auth, guards, interceptors, models, shared services
│       ├── features/    # Home, auth, money, work, docs, and tools
│       ├── layout/      # Header, sidebar, and category navigation
│       └── shared/      # Reusable components and utilities
└── best4u-backend/
    ├── pom.xml
    └── src/main/java/com/best4u/backend/
        ├── common/      # API response and exception handling
        ├── security/    # JWT and Spring Security configuration
        ├── user/        # Registration and login
        ├── product/     # Product API
        └── work/        # Todos, notes, and habits
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for the detailed request flows and design decisions.

## Before Opening a Pull Request

Run the checks that apply to your change:

```bash
cd best4u-FrontEnd
npm run build
npm test

cd ../best4u-backend
mvn test
mvn clean package
```

Also verify that:

- No credentials or private configuration are included in the diff.
- The frontend API URL matches the deployed backend URL.
- Database changes are backward-compatible or documented.
- Authentication and ownership checks are preserved for protected endpoints.
- `git status --short` does not show generated files such as `node_modules`, `dist`, or `target`.

## Publish the Repository on GitHub

Create an empty repository on GitHub first. Do not add a second README, `.gitignore`, or license there because these files already exist locally.

From `D:\best4U` in PowerShell:

```powershell
git init
git branch -M main
git add .
git status
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPOSITORY` with the GitHub account and repository name. Confirm the staged file list before committing, especially that no secrets or generated folders are present.

For future changes:

```powershell
git status
git add .
git commit -m "Describe the change"
git push
```

## Create a GitHub Release

A release should point to a reviewed Git tag. After the project is ready for a versioned release:

```powershell
git pull --ff-only
git tag -a v1.0.0 -m "Best4U v1.0.0"
git push origin v1.0.0
```

Then on GitHub:

1. Open the repository and select **Releases**.
2. Select **Draft a new release**.
3. Choose the `v1.0.0` tag.
4. Add release notes describing the user-visible features, setup requirements, known limitations, and database/configuration changes.
5. Publish the release.

Use semantic version tags such as `v1.0.0`, `v1.1.0`, or `v1.0.1`:

- Major: breaking API or user-facing changes.
- Minor: backward-compatible features.
- Patch: backward-compatible fixes.

For a deployable release, build both applications, publish the backend JAR through your hosting provider, and deploy the frontend `dist/best4u-frontend/` output through a static hosting provider. Configure production database credentials, JWT secrets, CORS origins, and the frontend API URL in the hosting environment rather than committing them.

## License

No license has been selected yet. Add a `LICENSE` file before distributing the project publicly or accepting external contributions.
