# 🎯 DrawDay - Professional Live Draw Competition Platform

<div align="center">
  <img src="apps/extension/public/assets/icon-128.png" alt="DrawDay Logo" width="128" height="128" />

  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
  [![Bun](https://img.shields.io/badge/Bun-latest-black.svg)](https://bun.sh)
  [![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)

  **Conduct fair, transparent raffles and competitions with style**
</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Building](#building)
- [Database](#database)
- [Contributing](#contributing)
- [License](#license)

## 🎨 Overview

DrawDay is a professional live draw spinner platform designed for conducting fair and transparent competitions, raffles, and giveaways. Built as a Chrome extension with a powerful backend, it provides organizations with a complete solution for managing participants and running live draws with style.

### Key Capabilities

- 🎲 **Live Draw Spinner** - Interactive, animated spinner for conducting draws
- 🏢 **Multi-Company Support** - Manage multiple organizations and their competitions
- 📊 **Participant Management** - Import and manage competition participants
- 🔐 **Secure Authentication** - Built with Better Auth for robust user management
- 🎯 **Fair & Transparent** - Ensures unbiased, verifiable results
- 💼 **Professional UI** - Clean, modern interface built with React and Tailwind CSS

## ✨ Features

### For Organizations
- Create and manage multiple companies
- Set up competitions with custom branding
- Upload participant lists via CSV/Excel
- Customize competition banners and logos
- Real-time draw execution

### For Users
- Secure authentication with email verification
- Personal dashboard for managing competitions
- Company switching for multi-organization users
- Competition history and analytics
- Password reset and account management

### Technical Features
- Chrome extension with side panel interface
- Monorepo architecture for better code organization
- Type-safe database operations with Prisma
- Responsive design with Tailwind CSS
- Real-time updates with React Query
- File upload with drag-and-drop support

## 🛠️ Tech Stack

### Frontend (Extension)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Bun
- **Styling**: Tailwind CSS v4 + Radix UI
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM
- **Authentication**: Better Auth UI
- **Animations**: Framer Motion
- **Icons**: Lucide React + Radix Icons

### Backend
- **Runtime**: Bun/Node.js
- **Database**: SQLite (development) / PostgreSQL (production ready)
- **ORM**: Prisma
- **Authentication**: Better Auth

### Development Tools
- **Package Manager**: Bun with Workspaces
- **Monorepo Structure**: Apps + Packages
- **Code Quality**: Prettier, TypeScript
- **Version Control**: Git

## 📁 Project Structure

```
drawday/
├── apps/
│   ├── extension/          # Chrome extension app
│   │   ├── src/           # Source code
│   │   │   ├── components/# React components
│   │   │   ├── pages/     # Page components
│   │   │   ├── hooks/     # Custom React hooks
│   │   │   └── lib/       # Utility functions
│   │   ├── public/        # Static assets
│   │   │   ├── assets/    # Icons and images
│   │   │   └── manifest.json # Chrome extension manifest
│   │   └── build.ts       # Build configuration
│   │
│   └── server/            # Backend server (submodule)
│
├── packages/
│   ├── config/            # Shared configuration
│   │   ├── prettier.config.js
│   │   ├── tsconfig.base.json
│   │   └── tailwind.css
│   │
│   ├── db/                # Database package
│   │   ├── prisma/        # Prisma schema and migrations
│   │   └── generated/     # Generated Prisma client
│   │
│   └── ui/                # Shared UI components
│       ├── src/
│       │   ├── auth/      # Authentication components
│       │   └── components/# Reusable UI components
│       └── globals.css    # Global styles
│
├── docs/                  # Documentation
├── package.json          # Root package configuration
├── bun.lock             # Lock file
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (latest version)
- [Git](https://git-scm.com/)
- Chrome or Chromium-based browser
- SQLite (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CodingButter/drawday.git
   cd drawday
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example env files
   cp apps/server/.env.example apps/server/.env
   cp apps/extension/.env.example apps/extension/.env
   ```

4. **Set up the database**
   ```bash
   cd packages/db
   bun run prisma migrate dev
   bun run prisma generate
   cd ../..
   ```

## 💻 Development

### Running the Development Environment

1. **Start all services**
   ```bash
   bun dev
   ```
   This runs both the extension and server in development mode.

2. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `apps/extension/dist` folder
   - Pin the extension to your toolbar

3. **Access the extension**
   - Click the DrawDay icon in your Chrome toolbar
   - The side panel will open with the application

### Development Commands

```bash
# Run all apps in development
bun dev

# Run specific app
bun --filter extension dev
bun --filter server dev

# Run database commands
cd packages/db
bun run prisma studio      # Open Prisma Studio
bun run prisma migrate dev  # Run migrations
bun run prisma generate     # Generate client
```

### Project-specific Commands

```bash
# Format code
bun run format

# Type checking
bun run typecheck

# Linting
bun run lint
```

## 🏗️ Building

### Building for Production

1. **Build the extension**
   ```bash
   cd apps/extension
   bun run build
   ```
   The built extension will be in `apps/extension/dist/`

2. **Build the server**
   ```bash
   cd apps/server
   bun run build
   ```

### Creating a Chrome Extension Package

1. Build the extension (see above)
2. In Chrome, go to `chrome://extensions/`
3. Click "Pack extension"
4. Select the `apps/extension/dist` directory
5. Chrome will create a `.crx` file

## 🗄️ Database

### Schema Overview

The application uses the following main entities:

- **User** - Application users with authentication
- **Company** - Organizations that run competitions
- **Competition** - Individual competitions/raffles
- **Image** - Uploaded images for logos and banners
- **Session/Account** - Authentication-related tables

### Database Migrations

```bash
cd packages/db

# Create a new migration
bun run prisma migrate dev --name your_migration_name

# Apply migrations
bun run prisma migrate deploy

# Reset database (development only)
bun run prisma migrate reset
```

### Viewing the Database

```bash
cd packages/db
bun run prisma studio
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- We use Prettier for code formatting
- TypeScript for type safety
- Follow the existing code patterns
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Better Auth](https://better-auth.com/) for authentication
- [Prisma](https://www.prisma.io/) for database ORM
- [Bun](https://bun.sh/) for the JavaScript runtime

## 📞 Support

For support, please open an issue in the [GitHub repository](https://github.com/CodingButter/drawday/issues).

---

<div align="center">
  Made with ❤️ by the DrawDay Team
</div>