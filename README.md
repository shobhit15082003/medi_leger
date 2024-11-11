# MediLeger

- [Database Model Link](https://app.eraser.io/workspace/riQPHaI0GwlNXNuDRD8b?origin=share)

## Table of Contents
- [Folder Structure](#folder-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)

## Folder Structure

```bash
medi_ledger/
│
├── backend/
│   ├── config/                    # Configuration files 
│   ├── controllers/               # API endpoint controllers 
│   ├── middlewares/               # Custom middleware 
│   ├── models/                    # Mongoose models 
│   ├── routes/                    # API routes definitions
│   ├── utilities/                 # Utility functions 
│   ├── app.js                     # Express app setup
│   └── index.js                   # Server setup and initialization
│
├── frontend/
    ├── public/                    # Public assets and HTML template
    ├── src/                       # React source files
        ├── assets/                # Images, logos, and static assets
        ├── components/            # Reusable React components 
        ├── pages/                 # Full page components 
        ├── services/              # API service functions for frontend
        ├── App.js                 # Main React component
        └── index.js               # Entry point for React
```

## Backend Setup

1. Navigate to the `backend` directory and install dependencies:

    ```bash
    cd backend
    npm install
    ```

2. Create a `.env` file and configure your environment variables :

  ```bash
  PORT=
  DATABASE_URL=""

  JWT_SECRET=

  CLOUDINARY_CLOUD_NAME=
  CLOUDINARY_API_KEY=
  CLOUDINARY_API_SECRET=

  MAIL_PASSWORD=
  MAIL_USER=
  MAIL_HOST=
  MAIL_PORT=
  ```

3. Run the backend server:

    ```bash
    npm run dev
    ```

## Frontend Setup

1. Navigate to the `frontend` directory and install dependencies:

    ```bash
    cd frontend
    npm install
    ```

2. Run the frontend server:

    ```bash
    npm run dev
    ```
