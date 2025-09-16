# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email or Google account
4. Complete verification

## Step 2: Create Your First Cluster

1. After login, click "Create" or "Build a Database"
2. Choose "M0 Sandbox" (FREE forever)
3. Choose cloud provider: **AWS** (recommended)
4. Choose region: **N. Virginia (us-east-1)** or closest to you
5. Cluster Name: `sri-murugan-cluster`
6. Click "Create Cluster" (takes 1-3 minutes)

## Step 3: Create Database User

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Authentication Method: "Password"
4. Username: `srimurugan`
5. Password: Generate secure password (SAVE THIS!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

## Step 4: Configure Network Access

1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Description: "All IPs for development"
5. Click "Confirm"

## Step 5: Get Connection String

1. Go to "Database" tab
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: "Node.js", Version: "4.1 or later"
5. Copy the connection string
6. It should look like:
   ```
   mongodb+srv://srimurugan:<password>@sri-murugan-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Your .env File

Replace the connection string in your `.env` file:
```env
MONGODB_URI=mongodb+srv://srimurugan:YOUR_ACTUAL_PASSWORD@sri-murugan-cluster.xxxxx.mongodb.net/sri-murugan-booking?retryWrites=true&w=majority
```

**Important Notes:**
- Replace `<password>` with your actual database user password
- Add `/sri-murugan-booking` before the `?` to specify the database name
- Keep the rest of the parameters as they are

## Step 7: Test Connection

Run this command in your backend directory:
```bash
npm run dev
```

You should see:
```
🚌 Sri Murugan Booking API Server
=======================================
🌟 Server running in development mode
🚀 Server running on port 5000
💾 Database: Connected
MongoDB Connected: sri-murugan-cluster.xxxxx.mongodb.net
=======================================
```

## Troubleshooting

### "Authentication failed"
- Check username and password in connection string
- Make sure you're using database user (not Atlas account)

### "IP not whitelisted"
- Go to Network Access
- Add 0.0.0.0/0 for all IPs
- Wait 2-3 minutes for changes to take effect

### "Connection timeout"
- Check your internet connection
- Try different region for cluster
- Contact Atlas support if persistent

## Your Database is Ready!
Once connected, your booking data will be stored permanently in MongoDB Atlas cloud database.
