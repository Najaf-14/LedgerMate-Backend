# LedgerMate App

LedgerMate is a Node.js and Express-based backend project for managing business records, customers, suppliers, and financial entries. The project currently includes authentication, business setup, and CRUD operations for customers, suppliers, and ledger entries.

## Features implemented so far

- User registration and login
- JWT-based authentication
- Business profile management
- Customer management
- Supplier management
- Sales and purchase entry tracking
- MongoDB integration with Mongoose
- Middleware for authentication, authorization, and request logging

## Tech stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Token (jsonwebtoken)
- bcryptjs for password hashing
- dotenv for environment variables
- cors and compression
- nodemon for development

## Project structure

- controllers/ - request handlers
- routes/ - API route definitions
- services/ - business logic
- models/ - Mongoose schemas
- middleware/ - auth and logging middleware
- config/ - database connection setup
- utils/ - helper functions

## Installation

Make sure you have Node.js and MongoDB installed first.

From the project root, run the following command to install all dependencies:

```bash
npm install
```

If you want to install the main packages manually, use:

```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken compression
npm install -D nodemon
```

## Environment variables

Create a .env file in the project root with the following variables:

```env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/ledgermate
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

## Run the project

Start the server with:

```bash
npm start
```

The app will run using nodemon and listen on the port defined in your .env file.

## Main API routes

### Authentication
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me

### Business
- POST /api/business
- GET /api/business
- PUT /api/business/:id

### Customers
- POST /api/customer
- GET /api/customer
- PUT /api/customer/:id
- DELETE /api/customer/:id

### Suppliers
- POST /api/supplier
- GET /api/supplier
- PUT /api/supplier/:id
- DELETE /api/supplier/:id

### Entries
- POST /api/entry
- GET /api/entry
- GET /api/entry/:id
- PUT /api/entry/:id
- DELETE /api/entry/:id

## Notes

This project is currently a backend-only application. You can test the APIs using tools like Postman or Thunder Client.
