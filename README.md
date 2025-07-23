# Full-Stack Next.js 15 Boilerplate

## 🛠️ Technologies Used

This project uses the following technologies:

- **Next.js 15** - React framework
- **tRPC** - End-to-end typesafe APIs
- **Better Auth** - Authentication
- **Drizzle ORM** - TypeScript ORM for SQL databases
- **PostgreSQL** - Database
- **AWS S3** - File storage and uploads
- **Polar** - Payment processing
- **Tailwind CSS** - Styling
- **TypeScript** - Static type checking

## 🏃‍♂️ Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add:

   ```env
   NODE_ENV=development

   # Database
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=supersecret
   DB_NAME=nextstarter
   DB_PORT=5432
   DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

   # AUTH
   BETTER_AUTH_SECRET=betterauthsecretchangethis
   BETTER_AUTH_URL=http://localhost:3000
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   VERCEL_URL=http://localhost:3000
   ```

3. **Set up the database:**

   ```bash
   npm run db:push
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser to access the app.

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable React components
├── db/                  # Database configuration and schema
├── lib/                 # Utility functions and configurations
└── trpc/               # tRPC router and client setup
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate database migrations
- `npm run db:studio` - Open Drizzle Studio

## 🚀 Features

- **Authentication**: Complete auth system with email/password and OAuth providers
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **API**: tRPC for end-to-end type safety
- **File Uploads**: S3 integration
- **Payments**: Polar integration for payment processing
- **Responsive Design**: Tailwind CSS for modern UI
- **Type Safety**: Full TypeScript support throughout the stack

## 📖 Documentation

For detailed documentation on each technology used in this boilerplate:

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Better Auth Documentation](https://better-auth.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
