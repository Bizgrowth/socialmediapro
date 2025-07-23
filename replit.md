# replit.md

## Overview

This is a full-stack social media management and content generation application built with React, TypeScript, Express.js, and PostgreSQL. The application helps businesses create, schedule, and analyze social media content across multiple platforms using AI-powered content generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (formerly React Query) for server state management
- **Build Tool**: Vite with custom configuration for development and production
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Authentication**: Replit Auth with OpenID Connect (OIDC)
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful API with structured error handling

### Database Architecture
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM with TypeScript-first schema definitions
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- Replit-based OIDC authentication
- Session-based authentication with PostgreSQL session store
- Protected routes with middleware authentication checks
- User profile management with business information

### Content Generation System
- AI-powered content creation using OpenAI GPT-4o
- Platform-specific content optimization (Facebook, Instagram, Twitter, LinkedIn)
- Sentiment analysis and hashtag generation
- Content library for saving and managing generated content

### Social Media Management
- Multi-platform content scheduling
- Content calendar with drag-and-drop interface
- Post performance tracking and analytics
- Platform-specific formatting and optimization

### Analytics and Reporting
- Dashboard with key performance indicators
- Performance charts with Chart.js integration
- ROI tracking and conversion analytics
- Competitor analysis and insights

### User Interface
- Responsive design with mobile-first approach
- Dark/light theme support with CSS variables
- Component-based architecture with reusable UI elements
- Form handling with React Hook Form and Zod validation

## Data Flow

### Content Generation Flow
1. User submits content generation request through frontend form
2. Request routed to `/api/content/generate` endpoint
3. Backend calls OpenAI API with structured prompts
4. Generated content processed and saved to database
5. Frontend updates with new content and provides editing options

### Authentication Flow
1. User redirects to Replit OIDC provider
2. Authentication callback processes tokens and user info
3. User session created and stored in PostgreSQL
4. Protected routes verify session on each request
5. Frontend maintains authentication state via TanStack Query

### Analytics Data Flow
1. User actions and post performance tracked via analytics endpoints
2. Data aggregated and stored in analytics and ROI tables
3. Dashboard queries aggregated data for visualization
4. Charts and metrics displayed using Chart.js and custom components

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database operations
- **openai**: AI content generation
- **@tanstack/react-query**: Client-side data fetching and caching
- **express**: Web server framework
- **react**: Frontend UI library

### UI/UX Dependencies
- **@radix-ui/react-***: Headless UI components
- **tailwindcss**: Utility-first CSS framework
- **chart.js**: Data visualization
- **react-chartjs-2**: Chart.js React wrapper
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **drizzle-kit**: Database schema management
- **tsx**: TypeScript execution for server

### Authentication Dependencies
- **openid-client**: OIDC authentication
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- Vite development server with HMR for frontend
- tsx for running TypeScript server files
- Database migrations via Drizzle Kit
- Environment variables for API keys and database connection

### Production Build
- Vite builds frontend assets to `/dist/public`
- esbuild compiles server code to `/dist`
- Static file serving from Express
- Database schema pushed via `db:push` script

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `OPENAI_API_KEY`: OpenAI API access (required)
- `SESSION_SECRET`: Session encryption key (required)
- `REPLIT_DOMAINS`: Allowed domains for OIDC (required)
- `ISSUER_URL`: OIDC provider URL (defaults to Replit)

### Replit-Specific Features
- Replit authentication integration
- Development banner for external access
- Cartographer plugin for development insights
- Runtime error overlay for debugging