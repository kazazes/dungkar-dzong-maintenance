# Dungkar Estate Maintenance System

A web-based maintenance request management system for Dungkar Dzong, built with Nuxt 3, Prisma, and PostgreSQL.

## Features

- 📝 Submit maintenance requests with optional location mapping
- 🗺️ Interactive map selection using Google Maps
- 📸 Image upload support for both requests and resolutions
- 🔍 Admin dashboard for request management
- 🔐 Secure server-side admin authentication
- 🚀 Docker deployment with Traefik reverse proxy
- 🔒 Automatic HTTPS with Let's Encrypt
- ✅ End-to-end testing with Playwright

## Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TailwindCSS
- **Backend**: Nuxt Server (built-in), Prisma ORM
- **Database**: PostgreSQL 16
- **Container**: Docker, Docker Compose
- **Proxy**: Traefik 2.10
- **Maps**: Google Maps JavaScript API
- **Testing**: Playwright

## Prerequisites

- Node.js 18+ and Yarn
- Docker and Docker Compose
- Google Maps API Key
- Domain name (for production deployment)

## Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://dungkar:dungkar_secret@postgres:5432/dungkar_dzong_db"

# Google Maps
NUXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"

# Admin Authentication
NUXT_ADMIN_PASSWORD="your_secure_password"

# Deployment
DOMAIN="your-domain.com"
ACME_EMAIL="your-email@example.com"
APP_NAME="dungkar_dzong_app"
DB_NAME="dungkar_dzong_db"
POSTGRES_USER="dungkar"
POSTGRES_PASSWORD="dungkar_secret"
POSTGRES_DB="dungkar_dzong_db"
```

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/Druk-Gyalpo-s-Institute/dungkar-dzong-maintenance.git
cd dungkar-dzong-maintenance
```

2. Install dependencies:

```bash
yarn install
```

3. Start the development environment:

```bash
docker compose up -d postgres
yarn dev
```

## Testing

Run end-to-end tests with Playwright:

```bash
# Run tests
yarn test

# Run tests with UI
yarn test:ui

# Debug tests
yarn test:debug
```

## Production Deployment

1. Set up your server with Docker and Docker Compose.

2. Configure your DNS to point to your server.

3. Create required directories and set permissions:

```bash
sudo mkdir -p /etc/traefik/config /var/www/dungkar-dzong/uploads
sudo chown -R $USER:$USER /etc/traefik /var/www/dungkar-dzong
sudo chmod 600 /etc/traefik/acme.json
sudo chmod 755 /var/www/dungkar-dzong/uploads
```

4. Deploy using Docker Compose:

```bash
docker compose up -d
```

5. Run database migrations:

```bash
docker compose exec app yarn prisma migrate deploy
```

## Project Structure

```
├── components/          # Vue components
│   └── LocationMap.vue # Google Maps integration
├── pages/              # Application pages
│   ├── index.vue      # Maintenance request form
│   └── admin/         # Admin interface
├── server/            # API routes
│   └── api/          # Server endpoints
├── prisma/           # Database schema and migrations
├── tests/            # E2E tests
├── traefik/          # Traefik configuration
├── docker-compose.yml # Docker services configuration
├── Dockerfile        # Application container build
├── nuxt.config.ts    # Nuxt configuration
└── playwright.config.ts # Playwright test configuration
```

## Security Features

- Server-side password validation for admin login
- Secure cookie-based authentication
- Protected admin routes with middleware
- TLS 1.2+ with strong cipher suites
- Automatic HTTPS redirection
- Secure headers with Traefik
- Environment-based configuration

## Available Scripts

- `yarn dev`: Start development server
- `yarn build`: Build for production
- `yarn preview`: Preview production build
- `yarn test`: Run Playwright tests
- `yarn prisma generate`: Generate Prisma client
- `yarn prisma migrate dev`: Run database migrations
- `yarn prisma studio`: Open Prisma database UI

## Continuous Deployment

The project uses GitHub Actions for automated deployment:

1. Pushes to the `main` branch trigger automatic deployment
2. The workflow:
   - Connects to the VPS via SSH
   - Updates the application code
   - Rebuilds containers
   - Runs database migrations
   - Verifies the deployment

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request
