# Android App Backend API

A secure and scalable NestJS backend API for Android application with user authentication, role-based access control, and database management.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Docker Setup](#docker-setup)
- [Running the Application](#running-the-application)
- [Database Migrations](#database-migrations)
- [API Documentation](#api-documentation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- 🔐 JWT-based authentication with refresh tokens
- 👥 User management with role-based access control
- 🛡️ Security features (Helmet, Rate Limiting, CORS)
- 📊 PostgreSQL database with TypeORM
- 🐳 Docker containerization
- 📚 Swagger API documentation
- 🔄 Database migrations
- 🎯 Input validation with class-validator
- 📝 Comprehensive error handling

## 🛠 Tech Stack

- **Framework**: NestJS 11
- **Database**: PostgreSQL 15
- **ORM**: TypeORM 0.3
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose
- **Database Admin**: pgAdmin 4

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v8 or higher) - Comes with Node.js
- **Docker** (v20 or higher) - [Download](https://www.docker.com/products/docker-desktop/)
- **Docker Compose** (v2 or higher) - Usually comes with Docker Desktop

### Verify Installation

```bash
node --version
npm --version
docker --version
docker-compose --version
```

## 📥 Installation

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Configuration

The project already includes a `.env` file with default Docker settings. Review and modify if needed:

```env
# Application
NODE_ENV=development
PORT=3000

# Database Configuration (Docker)
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres123
DB_NAME=admin_panel
DB_SSL=false
TYPEORM_LOGGING=true

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_refresh_secret_change_this_in_production
JWT_REFRESH_EXPIRES_IN=7d

# Frontend Configuration
FRONTEND_URL=http://localhost:3001

# PgAdmin (Optional)
PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin123
```

**⚠️ Important**: Change the JWT secrets in production!

## 🐳 Docker Setup

### Understanding the Docker Compose Configuration

The project uses three main services:

1. **postgres**: PostgreSQL 15 database (Port 5434)
2. **backend**: NestJS application (Port 3000)
3. **pgadmin**: Database management UI (Port 5050)

### Step 1: Build Docker Images

Build all Docker images defined in docker-compose.yml:

```bash
docker-compose build
```

This will:
- Pull the base images (Node.js 18, PostgreSQL 15, pgAdmin)
- Build the NestJS application image
- Set up all dependencies

### Step 2: Start All Services

Start all containers in detached mode:

```bash
docker-compose up -d
```

This command will:
- Create Docker volumes for persistent data
- Start PostgreSQL container and wait for it to be healthy
- Start the backend application container
- Start pgAdmin container
- Create a Docker network for inter-container communication

### Step 3: Verify Services are Running

Check the status of all containers:

```bash
docker-compose ps
```

You should see:
```
NAME                   STATUS              PORTS
android-api-backend    Up                  0.0.0.0:3000->3000/tcp
android-api-postgres   Up (healthy)        0.0.0.0:5434->5432/tcp
android-api-pgadmin    Up                  0.0.0.0:5050->80/tcp
```

### Step 4: View Logs

Monitor the backend application logs:

```bash
docker-compose logs -f backend
```

To view logs from all services:

```bash
docker-compose logs -f
```

Press `Ctrl+C` to exit log viewing.

## 🗄️ Database Migrations

Migrations must be run after the containers are up to create database tables.

### Run Migrations

Execute all pending migrations (automatically builds and runs inside Docker):

```bash
npm run migration:run
```

You should see output indicating successful migration:
```
Migration CreateUsersAndRoles1689774123456 has been executed successfully.
Migration CreateRefreshTokensTable1753360000037 has been executed successfully.
Migration CreateUserPermissions1753360000038 has been executed successfully.
Migration AddIsActiveToUsers1753400000000 has been executed successfully.
```

### Verify Migration Status

Check which migrations have been applied:

```bash
npm run migration:show
```

### Revert Migrations

If you need to undo the last migration:

```bash
npm run migration:revert
```

## 🌱 Database Seeding

After running migrations, seed the database with initial data including default roles and users.

### Run the Seed

Execute the Phase 1 seed file:

```bash
npm run seed:phase1
```

This will create:
- **Admin Role** and **User Role**
- **Default Admin Account**: admin@labverse.org / admin123
- **Default Test User**: user@labverse.org / user123

### Verify Seeding

You should see output like:
```
🌱 Starting Phase 1 seed...
✅ Admin role created
✅ User role created  
✅ Admin user created
✅ Test user created
🎉 Phase 1 seed completed!
```

**⚠️ Note**: If roles/users already exist, the seed will skip creating duplicates.

### Default Credentials

Use these credentials to test the API:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@labverse.org | admin123 |
| User | user@labverse.org | user123 |

**⚠️ Important**: Change these passwords in production!

## 🚀 Running the Application

### Complete Startup Sequence

Here's the complete sequence to start from scratch:

```bash
# 1. Build Docker images
npm run docker:build

# 2. Start all services
npm run docker:dev

# 3. Wait for services to be ready (about 10-15 seconds)
# Check logs to confirm backend is running
npm run docker:logs

# 4. Run database migrations (automatically builds inside Docker)
npm run migration:run

# 5. Seed the database with initial data
npm run seed:phase1

# 6. Verify application is running
curl http://localhost:3000
```

### Quick Start (After Initial Setup)

If you've already completed the initial setup:

```bash
# Start all services
npm run docker:dev

# View logs
npm run docker:logs
```

### Stop the Application

```bash
# Stop all containers (preserves data)
npm run docker:down

# Stop and remove volumes (deletes all data)
npm run docker:clean
```

### Restart Services

```bash
# Restart backend service
npm run docker:restart

# Or restart all services
npm run docker:down
npm run docker:dev
```

## 📚 API Documentation

Once the application is running, access the Swagger documentation:

**URL**: http://localhost:3000/api/docs

The Swagger UI provides:
- Interactive API testing
- Request/response schemas
- Authentication testing
- Complete API endpoint documentation

### Test the API

Test if the API is responding:

```bash
curl http://localhost:3000
```

Expected response:
```json
{
  "message": "LabVerse API is running!"
}
```

## 📜 Available Scripts

### Docker Scripts

```bash
# Start all services in detached mode
npm run docker:dev

# Stop all services
npm run docker:down

# View backend logs (follows logs in real-time)
npm run docker:logs

# Build Docker images
npm run docker:build

# Rebuild Docker images without cache
npm run docker:rebuild

# Remove all containers and volumes (clean slate)
npm run docker:clean

# Restart backend container
npm run docker:restart

# Check container status
npm run docker:ps
```

### Development Scripts

```bash
# Start development server (inside container)
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Migration Scripts

```bash
# Run all pending migrations (builds automatically)
npm run migration:run

# Revert the last migration
npm run migration:revert

# Show migration status
npm run migration:show

# Generate a new migration
npm run migration:generate -- <MigrationName>
```

### Seeding Scripts

```bash
# Run Phase 1 seed (creates roles and default users)
npm run seed:phase1
```

### Build Scripts

```bash
# Build inside Docker container
npm run build:docker

# Build locally
npm run build
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── common/              # Shared utilities, guards, interceptors
│   │   ├── decorators/      # Custom decorators
│   │   ├── filters/         # Exception filters
│   │   ├── guards/          # Auth guards
│   │   ├── interceptors/    # Response interceptors
│   │   ├── pipes/           # Validation pipes
│   │   └── utils/           # Utility functions
│   ├── config/              # Configuration files
│   │   ├── data-source.ts   # TypeORM data source
│   │   ├── database.config.ts
│   │   └── security.config.ts
│   ├── modules/
│   │   ├── auth/            # Authentication module
│   │   ├── users/           # User management module
│   │   └── roles/           # Role management module
│   ├── app.module.ts        # Root application module
│   ├── main.ts              # Application entry point
│   └── polyfills.ts         # Polyfills for compatibility
├── migrations/              # Database migration files
├── scripts/                 # Utility scripts
├── seeds/                   # Database seed files
├── dist/                    # Compiled output (generated)
├── uploads/                 # File upload directory
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile               # Docker image definition
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
├── nest-cli.json           # NestJS CLI configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Application port | `3000` |
| `DB_HOST` | Database host | `postgres` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres123` |
| `DB_NAME` | Database name | `admin_panel` |
| `JWT_SECRET` | JWT signing secret | ⚠️ Change in production |
| `JWT_EXPIRES_IN` | JWT token expiration | `1h` |
| `JWT_REFRESH_SECRET` | Refresh token secret | ⚠️ Change in production |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `7d` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:3001` |

## 🔍 Accessing Services

### Backend API
- **URL**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs

### PostgreSQL Database
- **Host**: localhost
- **Port**: 5434 (external), 5432 (internal)
- **Database**: admin_panel
- **Username**: postgres
- **Password**: postgres123

### pgAdmin (Database UI)
- **URL**: http://localhost:5050
- **Email**: admin@admin.com
- **Password**: admin123

#### Adding Server in pgAdmin:
1. Open http://localhost:5050
2. Login with credentials above
3. Right-click "Servers" → "Register" → "Server"
4. General tab: Name = "Android API DB"
5. Connection tab:
   - Host: `postgres` (Docker internal network)
   - Port: `5432`
   - Database: `admin_panel`
   - Username: `postgres`
   - Password: `postgres123`
6. Click "Save"

## 🐛 Troubleshooting

### Port Already in Use

If you see errors about ports being in use:

```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (Windows)
taskkill /PID <process_id> /F

# Or change the port in .env file
PORT=3001
```

### Database Connection Issues

```bash
# Check if PostgreSQL container is healthy
npm run docker:ps

# View PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Migration Errors

```bash
# Clean migrations table and start fresh
npm run docker:clean
npm run docker:dev
npm run migration:run
```

### Container Not Starting

```bash
# View detailed logs
npm run docker:logs

# Remove all containers and rebuild
npm run docker:clean
npm run docker:rebuild
npm run docker:dev
```

### Clean Start (Nuclear Option)

If everything is broken, start completely fresh:

```bash
# Stop and remove everything
npm run docker:clean

# Remove all Docker images
docker rmi $(docker images -q backend-backend)

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild and start
npm run docker:rebuild
npm run docker:dev

# Run migrations and seed
npm run migration:run
npm run seed:phase1
```

### Remove Compiled .js Files

If `.js` files appear in your source directory:

```bash
# Windows PowerShell
Get-ChildItem -Path ".\src" -Recurse -Include "*.js","*.js.map" | Where-Object { $_.Name -notlike "*eslintrc.js" } | Remove-Item -Force

# Linux/Mac
find src -name "*.js" -not -name ".eslintrc.js" -type f -delete
find src -name "*.js.map" -type f -delete
```

## 📞 Support

For issues and questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review Docker logs: `docker-compose logs -f`
3. Check application logs inside container: `docker-compose exec backend cat /app/logs/*.log`

## 📄 License

This project is licensed under the UNLICENSED License.

## 🙏 Acknowledgments

Built with:
- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
