# Cab Booking Application

A MERN cab booking application based on the provided project document.

## Features

- JWT authentication with register and login
- Fare estimation for Mini, Sedan, and SUV rides
- Ride booking with driver assignment
- Live ride status tracking
- Trip history with delete option for completed or cancelled rides
- MongoDB-backed ride and user data

## Tech Stack

- Frontend: React, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT

## Setup

### 1. Server

Create `server/.env` from `server/.env.example` and add your values.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cab-booking
JWT_SECRET=replace-this-with-a-secure-secret
CLIENT_URL=http://localhost:3000
```

Start the API:

```bash
cd server
npm install
npm start
```

### 2. Client

Create `client/.env` from `client/.env.example`.

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
cd client
npm install
npm start
```

## Main APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/rides/estimate`
- `POST /api/rides/book`
- `GET /api/rides/my-rides`
- `GET /api/rides/:userId`
- `PUT /api/rides/:id/status`
- `DELETE /api/rides/:id`
