# Overview

This is a full-stack web application built with React, Express, and PostgreSQL. It features a modern frontend using shadcn/ui components with TypeScript, a RESTful API backend, and Drizzle ORM for database management. The application is designed as a starter template with a "Hello World" interface that can be extended for future development.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and building

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Design**: RESTful endpoints with `/api` prefix
- **Request Handling**: JSON body parsing and URL-encoded data support
- **Error Handling**: Centralized error middleware with status code mapping

### Data Storage
- **Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM with Zod schema validation
- **Connection**: Neon Database serverless driver
- **Development Storage**: In-memory storage implementation for local development
- **Migrations**: Drizzle Kit for schema migrations

## Key Components

### Frontend Components
1. **UI Components**: Comprehensive shadcn/ui component library including buttons, cards, forms, dialogs, and navigation elements
2. **Pages**: Home page with animated "Hello World" interface and 404 error page
3. **Layout**: App component with query client provider, tooltip provider, and toast notifications
4. **Hooks**: Custom hooks for mobile detection and toast notifications

### Backend Components
1. **Server**: Express application with middleware for JSON parsing, logging, and error handling
2. **Routes**: Modular route registration system with placeholder for API endpoints
3. **Storage**: Abstract storage interface with in-memory implementation, designed for easy database integration
4. **Development Tools**: Vite integration for hot module replacement in development

### Database Schema
- **Users Table**: Basic user entity with id, username, and password fields
- **Validation**: Zod schemas for type-safe data validation
- **Types**: TypeScript types generated from Drizzle schema

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Processing**: Express routes handle requests, interact with storage layer
3. **Data Persistence**: Storage interface abstracts database operations
4. **Response Handling**: Standardized JSON responses with error handling
5. **State Management**: TanStack Query manages caching and synchronization

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: TypeScript ORM
- **express**: Web framework
- **react**: UI library
- **tailwindcss**: CSS framework
- **zod**: Schema validation

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **drizzle-kit**: Database migrations
- **esbuild**: Server bundling

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React application to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **Development**: Vite dev server with HMR and error overlay
- **Production**: Static file serving with Express

### Scaling Considerations
- **Database**: Configured for PostgreSQL with connection pooling support
- **Session Management**: Uses connect-pg-simple for PostgreSQL session storage
- **Static Assets**: Served efficiently through Express static middleware
- **Caching**: TanStack Query provides client-side caching with configurable strategies

The application is structured for easy extension and modification, with clear separation of concerns between frontend, backend, and data layers. The development setup includes hot reloading, error overlays, and comprehensive tooling for a smooth developer experience.