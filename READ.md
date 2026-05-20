# Food Vault 🍽️

Food Vault is a modern full-stack food management dashboard designed to manage food items in a clean and efficient way.

The application allows users to add, edit, delete, search, and organize food items through an intuitive dashboard interface. It automatically fetches relevant food images from free internet sources and provides a fallback placeholder when an exact image is unavailable.

Built with a responsive and user-friendly design, the project includes dark/light theme support for a better user experience across devices.

## Features

- Add new food items
- Edit existing food details
- Delete food records
- Search food items instantly
- Automatic food image fetching
- Fallback placeholder for unavailable images
- Dark / Light mode toggle
- Responsive dashboard UI
- REST API integration
- MongoDB database connectivity

## Tech Stack

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas

**Deployment**
- Vercel
- Render

## Project Purpose

This project demonstrates full-stack web development concepts including CRUD operations, frontend-backend integration, API handling, database management, responsive UI design, and deployment.

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/food-vault.git
```

Install backend dependencies:

```bash
cd backend
npm install
```

Create `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Run backend:

```bash
node server.js
```

Open the frontend using Live Server or directly through `index.html`.

## Author

SARAN