# Farm Pulse - Livestock Health Management System

## Overview

FarmCare Pro is a comprehensive full-stack web application designed for livestock health management. The system enables farmers to track animal profiles, manage health records, set medication and vaccination reminders, diagnose diseases, access emergency protocols, and engage with a community forum. Built with modern web technologies, it provides both online and offline capabilities for farm management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (Neon serverless)
- **Authentication**: Replit Auth integration with session-based authentication
- **File Uploads**: Multer middleware for image handling
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

### Key Components

#### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Management**: Server-side sessions stored in PostgreSQL
- **Authorization**: Route-level protection with middleware
- **User Management**: Complete user profile management with avatar support

#### Database Schema
- **Users**: Profile information with Replit Auth integration
- **Livestock**: Animal profiles with species, breed, health status tracking
- **Health Records**: Medical history, treatments, veterinarian visits
- **Reminders**: Medicine and vaccination scheduling with notifications
- **Community**: Forum posts and replies system
- **Activity Logs**: Comprehensive audit trail of user actions
- **Diseases**: Knowledge base for disease diagnosis and treatment

#### Core Features
1. **Livestock Management**: Add, edit, delete animal profiles with photo uploads
2. **Health Tracking**: Comprehensive medical record keeping per animal
3. **Reminder System**: Automated medicine and vaccination scheduling
4. **Disease Diagnosis**: Searchable disease database with symptoms and treatments
5. **Emergency Protocols**: Step-by-step emergency response guides
6. **Community Forum**: User interaction platform with categories and tagging
7. **Dashboard**: Real-time metrics and activity overview

## Data Flow

### Client-Server Communication
- **API Layer**: RESTful endpoints with JSON responses
- **Error Handling**: Centralized error handling with user-friendly messages
- **Authentication**: Cookie-based session authentication
- **File Uploads**: Multipart form data handling for images

### Database Operations
- **Queries**: Type-safe database operations using Drizzle ORM
- **Relationships**: Foreign key constraints ensuring data integrity
- **Migrations**: Version-controlled schema changes
- **Connection Pooling**: Neon serverless connection management

### State Management
- **Server State**: TanStack Query for API data caching and synchronization
- **Form State**: React Hook Form for form validation and submission
- **UI State**: React hooks for component-level state management

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **react-hook-form**: Form handling and validation
- **zod**: Schema validation
- **multer**: File upload handling
- **passport**: Authentication middleware

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type safety and development experience
- **eslint**: Code linting and formatting
- **drizzle-kit**: Database migration management

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Environment**: NODE_ENV=production for optimized performance

### Development Setup
- **Hot Reload**: Vite dev server with HMR for frontend development
- **Database**: Automatic schema pushing with `drizzle-kit push`
- **File Structure**: Monorepo structure with shared schema between client and server

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **SESSION_SECRET**: Session encryption key (required)
- **REPLIT_DOMAINS**: Authentication domain configuration
- **File Storage**: Local filesystem for uploaded images

### Scalability Considerations
- **Database**: Serverless PostgreSQL with connection pooling
- **Session Storage**: Database-backed sessions for horizontal scaling
- **File Storage**: Local storage (can be extended to cloud storage)
- **Caching**: TanStack Query provides client-side caching
- **Authentication**: Stateless JWT potential for future scaling