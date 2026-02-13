# Notimail

Multi-channel notification system for email reception alerts.

## Features

- **Email Notifications**: Real-time alerts for received emails
- **Multi-Channel Support**: Email, SMS, Push notifications
- **Webhook Integration**: Connect with email providers
- **User Preferences**: Customizable notification settings
- **Dashboard**: React-based admin interface

## Architecture

```
Notimail/
├── back-end/            # API server
├── front-end/          # React dashboard
├── docker-compose.yml  # Local development
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 20+
- Docker Desktop

### Run with Docker

```bash
docker compose up --build
```

### Manual Setup

```bash
# Backend
cd back-end
npm install
npm run dev

# Frontend
cd front-end
npm install
npm start
```

## API Endpoints

- `POST /api/notifications` - Send notification
- `GET /api/notifications/:userId` - Get user notifications
- `PUT /api/preferences/:userId` - Update preferences

## License

MIT
