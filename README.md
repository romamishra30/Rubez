# 🧩 RUBEZ — Interactive Rubik's Cube Solver

RUBEZ is a full-stack Rubik's Cube solving platform that combines a deterministic C++ solving engine with an interactive 3D visualization dashboard.

Users can generate scrambles, solve cubes using the Beginner's Method, visualize every move in real-time, navigate through solution steps, and analyze the solving process through an intuitive web interface.

---

🚀 Live Demo: https://rubez.vercel.app

## ✨ Features

### Solver Engine
- Deterministic Beginner's Method implementation
- Cross Formation
- First Layer Corners
- Middle Layer Edges
- Orient Last Layer (OLL)
- Permute Last Layer (PLL)
- State validation after every rotation
- Matrix-based cube representation

### Interactive Visualization
- Real-time 3D Rubik's Cube rendering
- Step-by-step solution playback
- Auto Solve functionality
- Move navigation controls
- Solution move tracking
- Playback speed adjustment
- Cube state visualization

### Dashboard Interface
- Scramble generation
- Solve-on-click workflow
- Timer support
- Beginner Method stage breakdown
- Responsive futuristic dashboard UI
- Neon visualization mode

---

## 📸 Screenshots

### Dashboard

> <img width="1907" height="910" alt="image" src="https://github.com/user-attachments/assets/e4644e47-d135-4e78-b6ac-c62297aa94c5" />



### 3D Visualization

> <img width="1911" height="907" alt="image" src="https://github.com/user-attachments/assets/ace64cf6-a2a8-4baf-8e9b-914e278c8af5" />


### Solution Playback

> <img width="1903" height="913" alt="image" src="https://github.com/user-attachments/assets/6e4b8a46-8396-49f2-9cd5-44430acce233" />


---

## 🏗️ System Architecture

```text
User Input
    │
    ▼
React Frontend
    │
    ▼
Node.js Backend
    │
    ▼
C++ Solver Engine
    │
    ▼
Solution Sequence
    │
    ▼
3D Visualization & Playback
```

---

## ⚙️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Three.js
- React Three Fiber

### Backend

- Node.js
- Express.js

### Solver

- C++
- Matrix-Based Cube Modeling

---

## 🧠 Solving Algorithm

RUBEZ uses the Beginner's Method, one of the most widely taught solving approaches.

### 1️⃣ Cross Formation

- Builds the bottom cross
- Aligns edges with center pieces

### 2️⃣ First Layer Corners

- Solves all first-layer corner pieces
- Maintains color consistency

### 3️⃣ Middle Layer Edges

- Places second-layer edge pieces
- Uses center references for positioning

### 4️⃣ Orient Last Layer (OLL)

- Edge orientation
- Corner orientation

### 5️⃣ Permute Last Layer (PLL)

- Corner permutation
- Edge permutation

The algorithm prioritizes reliability, readability, and deterministic behavior over shortest-move optimization.

---

## 🧩 Cube Representation

The cube state is modeled using:

```cpp
int cube[9][6];
```

Where:

- 9 positions exist on each face
- 6 faces represent the entire cube
- Each cell stores color information

This representation simplifies move execution and state validation.

---

## 🎮 Supported Move Notation

| Move | Description |
|--------|-------------|
| R | Right Face |
| L | Left Face |
| U | Up Face |
| D | Down Face |
| F | Front Face |
| B | Back Face |
| R' | Counter-clockwise Rotation |
| R2 | Double Rotation |

Standard WCA notation is supported.

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/romamishra30/RubiksCubeSolver1.git
cd RubiksCubeSolver1
```

---

### Build Solver

```bash
cd solver
make
```

---

### Start Backend

```bash
cd ../backend
npm install
node server.js
```

---

### Start Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

### Open Application

```text
http://localhost:5173
```

---

## 🎯 Usage

### Generate a Scramble

Click:

```text
NEW SCRAMBLE
```

### Solve the Cube

Click:

```text
SOLVE
```

The backend executes the C++ solver and returns the solution sequence.

### Visualize Solution

- Play animation
- Pause animation
- Navigate moves
- Adjust playback speed
- Auto Solve entire sequence

---

## 📊 Project Highlights

- Full-stack architecture
- Interactive 3D visualization
- Deterministic solving engine
- Real-time frontend-backend communication
- Matrix-based cube modeling
- Modular move execution system
- Beginner's Method implementation
- Educational solving workflow

---

## 🔮 Future Enhancements

- Scramble validation
- CFOP solving method
- Solution optimization
- Cube state editor
- Mobile responsiveness improvements
- Performance analytics


GitHub:
https://github.com/romamishra30
