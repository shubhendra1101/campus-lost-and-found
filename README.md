# 🔍 CampusFinder: Lost & Found Management System

A full-stack MERN application designed to replace unstructured campus communication (like WhatsApp/Telegram groups) with a searchable, intelligent, and authenticated platform.

**🌐 Live Demo:** [(https://campus-lost-and-found-lilac.vercel.app/)]
**⚙️ Backend API:** [(https://campus-lost-and-found-r8vm.onrender.com)]

---

## 🚀 The Core Problem
Campus communities often rely on noisy chat groups or physical notice boards to find lost items. 
- **Inefficiency:** Manual scrolling through hundreds of messages (O(n) search).
- **Inaccuracy:** Keyword mismatches (e.g., "dark purse" vs "black wallet").
- **No Tracking:** No way to mark items as "Claimed" or track history.

## 💡 The Solution
CampusFinder optimizes the recovery process using a structured backend and intelligent matching logic.
- **Fast Retrieval:** Implemented MongoDB Text Indexing to reduce search time from minutes to <1s (O(log n)).
- **Smart Matching:** A custom scoring algorithm (0.0 - 2.0) that matches items based on keyword similarity, category, and campus location.
- **Image Integration:** Integrated Cloudinary for high-fidelity item image storage.

---

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3 (Modern UI), Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens) with Bcrypt password hashing
- **Storage:** Cloudinary API for image hosting

---

## 📊 Impact Metrics (Simulated Analysis)
| Metric | Existing (WhatsApp) | CampusFinder |
| :--- | :--- | :--- |
| **Search Time** | 2-5 Minutes (Manual) | **< 1 Second** |
| **Matching Accuracy** | ~35% (Memory based) | **~75% (Score based)** |
| **Data Integrity** | High duplicates | **90% Reduction via indexing** |

---

## 📂 Project Structure
- `/models`: Database schemas (User, Item)
- `/controllers`: Business logic and matching algorithm
- `/middleware`: JWT Security checkpoints
- `/services`: Core matching and scoring engine
- `/frontend`: Modern, responsive user interface

## 🛠️ How to run locally
1. Clone the repo: `[git clone (https://github.com/shubhendra1101/campus-lost-and-found)]`
2. Install dependencies: `npm install`
3. Create a `.env` file with your `MONGO_URI`, `JWT_SECRET`, and `CLOUDINARY` keys.
4. Run: `npx nodemon server.js`
