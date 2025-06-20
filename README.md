# Venue Relationship Tracker

A comprehensive web application for musicians, bands, and their management teams to track communications with venues, manage bookings, and maintain a detailed performance history.

## Features

- **Venue Database Management:** Store and manage detailed venue information, categorize venues, and rate them based on past experiences.
- **Communication Tracking:** Log all communications with venue representatives, set follow-up reminders, and save message templates.
- **Booking Management:** Create and track booking requests, manage contract details, and store technical riders.
- **Performance History:** Record details of past performances, track attendance and revenue, and store post-show notes.
- **Relationship Analytics:** Generate insights on venue relationships, identify high-value venues, and track relationship health.
- **Calendar Integration:** View all bookings in calendar format and sync with external calendars.

## Tech Stack

### Frontend
- React.js with TypeScript
- Material-UI
- Redux Toolkit
- Chart.js for analytics
- FullCalendar for booking visualization
- Google Maps API integration

### Backend
- Node.js with Express
- RESTful API with OpenAPI/Swagger documentation
- JWT-based authentication with role-based access control
- PostgreSQL database
- Elasticsearch for advanced searching
- Redis for caching

## Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL (v14+)
- Redis
- Elasticsearch (optional, for advanced search features)

## Installation

### Clone the repository

```bash
git clone https://github.com/dxaginfo/venue-relationship-tracker-musicapp.git
cd venue-relationship-tracker-musicapp
```

### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit the .env file with your configuration
# Set up your database connection, JWT secret, etc.

# Run database migrations
npm run migrate

# Seed the database with initial data (optional)
npm run seed

# Start the development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit the .env file with your configuration
# Set up your API URL, Google Maps API key, etc.

# Start the development server
npm start
```

## Production Deployment

### Using Docker

```bash
# Build and run the Docker containers
docker-compose up -d
```

### Manual Deployment

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
# Serve the build directory with Nginx, Apache, or a similar web server
```

## API Documentation

Once the backend server is running, you can access the API documentation at:

```
http://localhost:8000/api-docs
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact [dxag.info@gmail.com](mailto:dxag.info@gmail.com).