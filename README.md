# 📺 PlusOne Television

A full-stack **MERN (MongoDB, Express.js, React, Node.js)** based web application designed for managing and delivering television-related content such as shows, programs, schedules, and user interactions in a modern, scalable way.

---

## 🚀 Project Overview

**PlusOne Television** is a web platform that allows administrators to manage TV programs while users can browse content, view schedules, and stay updated with the latest shows. The application is built using the **MERN stack** to ensure high performance, scalability, and a clear separation between frontend and backend.

---

## 🛠️ Tech Stack (MERN)

### 🔹 Frontend

* **React.js**
* JavaScript (ES6+)
* HTML5 / CSS3
* Tailwind CSS / Bootstrap
* Axios
* Redux Toolkit (optional)

### 🔹 Backend

* **Node.js**
* **Express.js**
* RESTful APIs
* JWT Authentication

### 🔹 Database

* **MongoDB** (with Mongoose ODM)

---

## ✨ Features

* User authentication & authorization (JWT)
* Admin dashboard for content management
* Add / update / delete TV programs
* Program scheduling
* Responsive UI
* Secure API endpoints
* Clean & scalable folder structure

---

## 📂 Project Structure

```
PlusOne/
│── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── config/
│   ├── index.js
│   └── package.json
│
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── App.jsx
│   ├── vite.config.js / package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/PlusOne.git
cd PlusOne
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://72.60.223.137:5173
```

Backend runs on:

```
http://72.60.223.137:5000
```

---

## 🔐 Authentication

* JSON Web Token (JWT)
* Protected routes for admin functionalities

---

## 📌 API Endpoints (Sample)

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| POST   | /api/auth/login    | User login        |
| POST   | /api/auth/register | User registration |
| GET    | /api/programs      | Get all programs  |
| POST   | /api/programs      | Add new program   |

---

## 💸 Khalti Payment Gateway Integration

To make payments easier for Nepali users, the project now integrates with the
Khalti checkout widget instead of eSewa.  The flow is lightweight and only
requires a public/secret key pair from Khalti’s developer dashboard.

1. **Configure environment variables** in the backend `.env` file (see sample
   values already added).  You’ll need your public & secret keys:

   ```dotenv
   KHALTI_PUBLIC_KEY=YOUR_PUBLIC_KEY_HERE
   KHALTI_SECRET_KEY=YOUR_SECRET_KEY_HERE
   KHALTI_PRODUCT_URL=http://72.60.223.137:5173   # optional
   ```

2. **Backend endpoints** (mounted under `/apis/v1/payments/khalti`):

   * `POST /create` – accepts JSON `{ amount, pid }`, requests a payment token
     from Khalti, and returns the token to the client.  The token is used by the
     client-side widget to open the checkout.

   (The old eSewa routes have been removed but can be re‑enabled if needed.)

3. **Frontend**: the `/payment` page now loads Khalti’s JavaScript library and
   initializes `KhaltiCheckout` when the user submits the form.  Clicking the
   proceed button opens the Khalti modal with the specified amount.

4. **Next steps**: verify the token on the server, persist order/payment records,
   and send confirmation emails once verification succeeds.

---

## �🚧 Future Enhancements

* Live streaming integration
* Role-based access control
* Notifications & alerts
* Analytics dashboard

---

## 👨‍💻 Author

**Bijay Kumar Yadav**
Freelance Full Stack Developer (MERN)
📍 Bangalore, India

---

## 📜 License

This project is licensed under the **MIT License**.

---

⭐ If you like this project, don’t forget to star the repository!
