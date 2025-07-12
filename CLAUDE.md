# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ksau Web is a developer-focused file sharing platform built with Next.js 13.5.1 and React 18.2.0. It provides a terminal-inspired interface for uploading files to cloud storage (OneDrive) with both web UI and CLI tool integration.

## Development Commands

### Essential Commands

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run build:vercel` - Build for Vercel deployment (disables telemetry)
- `npm start` - Start production server
- `npm run lint` - Run ESLint (configured to ignore errors during builds)

### Docker Commands

- `docker-compose up --build` - Build and run containerized application
- `docker-compose down` - Stop Docker containers

## Environment Configuration

The application uses a hierarchical environment variable system:

1. `NEXT_PUBLIC_LOCAL_API_ENDPOINT` (highest priority) - For local backend development
2. `NEXT_PUBLIC_API_ENDPOINT` (fallback) - For remote backend
3. `NEXT_PUBLIC_API_BASE_URL` - Used for Next.js API rewrites
4. Default fallback: `https://project.ksauraj.eu.org`

Environment variables are consumed in:

- `app/config.ts` - Runtime configuration
- `next.config.js` - Build-time API rewrites

## Architecture

### Technology Stack

- **Framework**: Next.js 13.5.1 with App Router
- **UI**: shadcn/ui components + Tailwind CSS
- **TypeScript**: Configured with relaxed build settings (`ignoreBuildErrors: true`)
- **State Management**: React hooks + local state
- **File Uploads**: react-dropzone for drag-and-drop functionality

### Key Components Structure

```
app/
├── page.tsx           # Main upload interface (client component)
├── layout.tsx         # Root layout with terminal styling
├── config.ts          # API endpoint configuration
├── globals.css        # Tailwind styles + terminal theme
└── components/
    ├── animated-text.tsx     # Typewriter effect for URLs
    ├── system-info.tsx       # Real-time system monitoring
    ├── storage-quota.tsx     # Storage usage visualization
    └── ...other UI components
```

### API Integration

- Uses Next.js rewrites to proxy API calls (`/api/system` → backend `/system`)
- Upload endpoint: `/upload` (via configured API base)
- System info endpoint: `/api/system` (refreshes every 30 seconds)
- Storage quota endpoint: `/api/quota` (refreshes every 5 minutes)

## Code Conventions

### Environment Variable Patterns

Always use the configuration hierarchy when adding new endpoints:

```typescript
const apiEndpoint =
  process.env.NEXT_PUBLIC_LOCAL_API_ENDPOINT ||
  process.env.NEXT_PUBLIC_API_ENDPOINT ||
  "https://project.ksauraj.eu.org";
```

### Component Patterns

- All interactive components use `"use client"` directive
- Components follow shadcn/ui patterns with `cn()` utility for class merging
- Use terminal-themed styling (green text, monospace font, `{">"}` prefixes)
- Error handling includes both user-friendly messages and console logging

### File Upload Flow

1. File selection via drag-and-drop (react-dropzone)
2. Form validation and progress simulation
3. FormData submission to configured API endpoint
4. Response handling with toast notifications
5. URL display with animated text effect

### CLI Integration

The web interface generates equivalent CLI commands using the `ksau-go` tool pattern:

```bash
ksau-go upload -f "filename" -r "/path" -n "custom-name" -s 4194304 --remote-config oned
```

## Build Configuration

### TypeScript Settings

- Build errors are ignored (`ignoreBuildErrors: true`)
- Strict mode disabled for faster development iteration
- Paths configured for shadcn/ui aliases (`@/components`, `@/lib`)

### Docker Configuration

- Multi-stage build (Node 16 Alpine)
- Non-root user for security
- Environment variables passed as build args
- Production optimizations enabled

## Development Guidelines

### Adding New Features

1. Check existing component patterns in `components/ui/`
2. Use shadcn/ui components as base building blocks
3. Implement proper loading states and error handling
4. Follow terminal aesthetic (green colors, monospace, bracket prefixes)
5. Add environment variable configuration for any external services

### API Endpoint Changes

1. Update `next.config.js` rewrites if adding new API routes
2. Update `app/config.ts` for new endpoint configurations
3. Consider fallback behavior when API is unavailable

### Environment Variables

- Never commit actual API endpoints to version control
- Update `.env.example` when adding new required variables
- Use the established priority hierarchy for endpoint configuration

## Storage System

The application integrates with multiple storage backends:

- `hakimionedrive` - Hakimi's OneDrive account
- `oned` - Primary OneDrive storage
- `saurajcf` - Cloudflare storage (Sauraj's account)

Storage cleanup occurs automatically at 90% capacity. The system displays real-time quota information and system resource usage to users.
