This project uses the following technologies:

- **Next.js 15** - React framework. For more information about this technology, check out its documentation Next.js 15 check out the documentation at https://nextjs.org/docs
- **tRPC** - End-to-end typesafe APIs. For more information about this technology, check out its documentation tRPC check out the documentation at https://trpc.io
- **Better Auth** - Authentication. For more information about this technology, check out its documentation Better Auth check out the documentation at https://better-auth.com
- **Drizzle ORM** - TypeScript ORM for SQL databases. For more information about this technology, check out its documentation Drizzle ORM check out the documentation at https://orm.drizzle.team
- **PostgreSQL** - Database. For more information about this technology, check out its documentation PostgreSQL check out the documentation at https://postgresql.org
- **AWS S3** - File storage and uploads. For more information about this technology, check out its documentation AWS S3 check out the documentation at https://aws.amazon.com/s3
- **Polar** - Payment processing. For more information about this technology, check out its documentation Polar check out the documentation at https://polar.sh
- **Tailwind CSS** - Styling. For more information about this technology, check out its documentation Tailwind CSS check out the documentation at https://tailwindcss.com
- **TypeScript** - Static type checking. For more information about this technology, check out its documentation TypeScript check out the documentation at https://typescriptlang.org

## Project Structure

The project follows a standard Next.js 15 App Router structure with additional configurations for the tech stack:

### Root Level

```
├── drizzle/              # Database migrations and metadata
├── public/               # Static assets (images, icons, etc.)
├── src/                  # Main source code directory
├── drizzle.config.ts     # Drizzle ORM configuration
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies and scripts
├── docker-compose.yml    # Docker services (likely PostgreSQL)
└── tsconfig.json         # TypeScript configuration
```

### Source Directory (src/)

```
src/
├── app/                  # Next.js App Router - pages and layouts
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints (Better Auth)
│   │   └── trpc/         # tRPC API endpoints
│   ├── demo-trpc/        # tRPC demonstration pages
│   ├── demo-trpc-protected/ # Protected tRPC demo pages
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── layout.tsx        # Root layout component
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # Reusable React components
│   ├── login.tsx         # Login form component
│   ├── logout.tsx        # Logout component
│   └── signup.tsx        # Signup form component
├── db/                   # Database configuration and schema
│   ├── index.ts          # Database connection
│   ├── schema.ts         # Drizzle schema definitions
│   └── clear.ts          # Database utilities
├── lib/                  # Utility functions and configurations
│   ├── auth.ts           # Better Auth configuration
│   ├── auth-client.ts    # Client-side auth utilities
│   └── s3.ts             # AWS S3 configuration
└── trpc/                 # tRPC setup and configuration
    ├── client.tsx        # tRPC client setup
    ├── init.ts           # tRPC initialization
    ├── query-client.ts   # React Query client
    ├── server.ts         # tRPC server setup
    └── routers/          # tRPC API route definitions
        └── _app.ts       # Main tRPC router
```

### Key Patterns

- **App Router**: Uses Next.js 15 App Router for file-based routing
- **API Routes**: Located in `src/app/api/` for server-side endpoints
- **Components**: Reusable UI components in `src/components/`
- **Database**: Drizzle ORM with schema in `src/db/schema.ts`
- **Authentication**: Better Auth setup in `src/lib/auth.ts`
- **tRPC**: Type-safe API with routers in `src/trpc/routers/`
- **File Storage**: AWS S3 integration in `src/lib/s3.ts`
