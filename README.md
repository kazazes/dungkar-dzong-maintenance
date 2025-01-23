# Dungkar Dzong Maintenance System

A web-based maintenance request management system for Dungkar Dzong, built with Nuxt 3, Prisma, and PostgreSQL.

## Features

- 📝 Submit maintenance requests with location mapping
- 🗺️ Interactive map selection using Google Maps
- 📸 Image upload support for both requests and resolutions
- 🔍 Admin dashboard for request management
- 📱 Responsive design for all devices
- 🔐 Secure admin authentication

## Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TailwindCSS
- **Backend**: Nuxt Server (built-in), Prisma ORM
- **Database**: PostgreSQL 16
- **Container**: Docker
- **Maps**: Google Maps JavaScript API

## Prerequisites

- Node.js 18+ and Yarn
- Docker and Docker Compose
- Google Maps API Key

## Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://dungkar:dungkar_secret@localhost:5432/dungkar_dzong_db"

# Google Maps
GOOGLE_MAPS_API_KEY="your_google_maps_api_key"

# Admin Authentication
ADMIN_PASSWORD="password"
```

## Configuration Files

### docker-compose.yml

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:16-alpine
    container_name: dungkar_dzong_db
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: dungkar
      POSTGRES_PASSWORD: dungkar_secret
      POSTGRES_DB: dungkar_dzong_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/ui"],
  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
  app: {
    head: {
      script: [
        {
          src: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}`,
          defer: true,
        },
      ],
    },
  },
});
```

### prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model MaintenanceRequest {
  id               Int       @id @default(autoincrement())
  location         String
  latitude         Float
  longitude        Float
  contactName      String
  contactNumber    String
  category         String    // ELECTRICAL, PLUMBING, INTERNET_CABLE, OTHER
  priority         String    // LOW, MEDIUM, HIGH, URGENT
  details          String    @db.Text
  imagePath        String?
  status          String    @default("PENDING")
  resolvedBy      String?
  resolvedAt      DateTime?
  resolutionNotes String?   @db.Text
  resolutionImages String[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Druk-Gyalpo-s-Institute/dungkar-dzong-maintenance.git
cd dungkar-dzong-maintenance
```

2. Install dependencies:

```bash
yarn install
```

3. Start the database:

```bash
docker-compose up -d
```

4. Run database migrations:

```bash
yarn prisma migrate dev
```

5. Start the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
├── components/          # Vue components
├── pages/              # Application pages
├── prisma/
│   └── schema.prisma   # Database schema
├── public/             # Static files
├── server/             # API routes
├── docker-compose.yml  # Docker configuration
├── nuxt.config.ts      # Nuxt configuration
├── package.json        # Project dependencies
└── tsconfig.json       # TypeScript configuration
```

## Available Scripts

- `yarn dev`: Start development server
- `yarn build`: Build for production
- `yarn preview`: Preview production build
- `yarn prisma generate`: Generate Prisma client
- `yarn prisma migrate dev`: Run database migrations
- `yarn prisma studio`: Open Prisma database UI

## Deployment

1. Build the application:

```bash
yarn build
```

2. Set up your production environment variables.

3. Start the application:

```bash
yarn preview
```
