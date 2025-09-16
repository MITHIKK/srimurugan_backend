# Sri Murugan Tourist Bus Booking - Backend API

## Overview
RESTful API server for managing tourist bus bookings with MongoDB database integration.

## Features
- 🚌 Bus booking management (CRUD operations)
- 📅 Calendar-based booking system
- ⚠️ Booking conflict detection
- 🔐 PIN-based authentication
- 📊 Booking statistics and analytics
- 🔒 Security middleware (CORS, Rate limiting, Helmet)

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Security:** Helmet, CORS, Rate Limiting
- **Environment:** dotenv
- **Logging:** Morgan

## Installation

1. **Clone and navigate:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Copy `.env.example` to `.env` and update values:
   ```bash
   cp .env.example .env
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `ADMIN_PIN` | Admin login PIN | `1234` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with PIN
- `POST /api/auth/verify` - Verify PIN

### Bookings
- `GET /api/bookings` - Get all bookings (with filters)
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking
- `POST /api/bookings/check-conflicts` - Check booking conflicts
- `GET /api/bookings/stats` - Get booking statistics

### System
- `GET /health` - Health check endpoint
- `GET /` - API information

## API Usage Examples

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "busName": "VETTAIYAN",
    "date": "2024-01-15T00:00:00.000Z",
    "numberOfDays": 2,
    "pickupTime": "6:00 AM",
    "partyName": "John Doe",
    "phone1": "9876543210",
    "fromLocation": "Chennai",
    "toLocation": "Kodaikanal",
    "totalAmount": 15000,
    "advanceAmount": 5000
  }'
```

### Get Bookings for Specific Bus and Month
```bash
curl "http://localhost:5000/api/bookings?busName=VETTAIYAN&month=1&year=2024"
```

### Check Booking Conflicts
```bash
curl -X POST http://localhost:5000/api/bookings/check-conflicts \
  -H "Content-Type: application/json" \
  -d '{
    "busName": "VETTAIYAN",
    "date": "2024-01-15T00:00:00.000Z",
    "numberOfDays": 3
  }'
```

## Database Schema

### Booking Model
```javascript
{
  busName: String,          // VETTAIYAN, DHEERAN, MAARAN, VEERAN
  date: Date,              // Booking start date
  numberOfDays: Number,     // 1-5 days
  pickupTime: String,       // e.g., "6:00 AM"
  isNightPickup: Boolean,   // Previous night pickup
  partyName: String,        // Customer name
  phone1: String,          // Primary contact
  phone2: String,          // Secondary contact (optional)
  fromLocation: String,     // Starting point
  toLocation: String,       // Destination
  viaRoute: String,        // Route/stops (optional)
  recommendedBy: String,    // Referral (optional)
  totalAmount: Number,      // Total booking amount
  advanceAmount: Number,    // Advance paid
  balanceAmount: Number,    // Auto-calculated balance
  serviceInclusions: {      // What's included in rent
    includeRent: Boolean,
    includeDiesel: Boolean,
    includeDriverBeta: Boolean,
    includeToll: Boolean,
    includeCheckPost: Boolean,
    includeParking: Boolean
  },
  status: String,          // confirmed, cancelled, completed
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

## Scripts

- `npm start` - Production server
- `npm run dev` - Development server with nodemon
- `npm test` - Run tests

## Deployment

See `../DEPLOYMENT_GUIDE.md` for complete deployment instructions.

### Quick Deploy to Render
1. Push to GitHub
2. Connect to Render
3. Set environment variables
4. Deploy

### Quick Deploy to Railway
```bash
railway login
railway init
railway up
```

## Security Features

- **Rate Limiting:** 100 requests per 15 minutes per IP
- **CORS Protection:** Configurable allowed origins
- **Helmet:** Security headers
- **Input Validation:** Mongoose schema validation
- **Error Handling:** Comprehensive error middleware

## Monitoring

- **Health Check:** `/health` endpoint
- **Logging:** Morgan HTTP request logging
- **Error Tracking:** Console error logging

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## License

Private - Sri Murugan Tourist
