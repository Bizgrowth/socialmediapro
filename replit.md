# replit.md

## Overview

This is a full-stack social media management and content generation application built with React, TypeScript, Express.js, and PostgreSQL. The application helps businesses create, schedule, and analyze social media content across multiple platforms using AI-powered content generation.

## User Preferences

- **Communication style**: Simple, everyday language
- **Design preference**: Professional dark mode interface with modern styling
- **UI/UX approach**: Clean, sophisticated, business-focused aesthetic

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

## SaaS Deployment Roadmap

### Phase 1: Core Infrastructure (COMPLETE!)
- ✅ Database schema and backend API
- ✅ Frontend interface with all major features  
- ✅ **BREAKTHROUGH: Valid OpenAI API integration working perfectly!**
- ✅ **Real AI content generation active across all pages**
- ✅ **Clean API key configuration and optimized performance**
- ✅ **Professional dark mode interface with modern styling (July 2025)**
- ✅ **Comprehensive text visibility fixes across all dashboard components**
- ✅ **Enhanced visual design with lighter gradient backgrounds and color-coded buttons**
- ✅ **Professional color-coded card system with distinct themes per component**
- ✅ **Logo contrast enhancement with white backgrounds for maximum visibility**
- ✅ **ROI tracking metrics with differentiated color cards for better UX**
- ✅ **Comprehensive color debugging checklist and accessibility guidelines**
- ❌ Production authentication system (next phase)

### Phase 2: Production Readiness
1. **Authentication & User Management**
   - Fix Replit Auth configuration or implement alternative (Auth0, Clerk, or custom)
   - User registration, login, and profile management
   - Multi-tenant data isolation
   - Password reset and email verification

2. **Payment Integration**
   - Stripe payment processing
   - Subscription plans (Starter, Professional, Enterprise)
   - Usage tracking and billing
   - Trial periods and freemium model

3. **AI Service Configuration**
   - Valid OpenAI API key setup
   - Error handling and fallbacks
   - Usage monitoring and rate limiting
   - Cost optimization strategies

### Phase 3: Social Media Integrations
1. **Platform APIs**
   - Facebook Graph API integration
   - Instagram Basic Display API
   - Twitter API v2
   - LinkedIn Marketing API
   - TikTok for Business API

2. **Content Publishing**
   - Real-time post scheduling
   - Multi-platform publishing
   - Image and video upload handling
   - Platform-specific formatting

### Phase 4: Advanced Features
1. **Analytics & Reporting**
   - Real social media metrics integration
   - Advanced analytics dashboard
   - Custom report generation
   - Performance insights and recommendations

2. **Team Collaboration**
   - Multi-user workspaces
   - Role-based permissions
   - Content approval workflows
   - Team activity tracking

### Phase 5: Scale & Optimization
1. **Performance**
   - CDN implementation for media assets
   - Database query optimization
   - Caching strategies
   - Load balancing

2. **Enterprise Features**
   - White-label solutions
   - API access for integrations
   - Advanced security features
   - Custom branding options

### Deployment Options
1. **Replit Deployments** (Recommended for MVP)
   - Quick deployment with built-in SSL
   - Automatic scaling
   - Simple domain configuration

2. **Vercel/Netlify** (Frontend) + Railway/PlanetScale (Backend)
   - Separate frontend and backend deployments
   - Better performance and scaling options

3. **AWS/Google Cloud** (Enterprise)
   - Full control over infrastructure
   - Advanced monitoring and logging
   - Enterprise-grade security

### Estimated Timeline
- **Phase 1-2 (MVP)**: 2-3 weeks
- **Phase 3 (Social Integrations)**: 3-4 weeks  
- **Phase 4 (Advanced Features)**: 4-6 weeks
- **Phase 5 (Scale)**: Ongoing optimization

### Revenue Model Suggestions
- **Freemium**: 5 posts/month, basic analytics
- **Starter ($29/month)**: 50 posts/month, 3 platforms
- **Professional ($79/month)**: Unlimited posts, all platforms, team features
- **Enterprise ($199/month)**: White-label, API access, priority support