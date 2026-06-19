# Rubik's Cube Solver

A C++ Rubik’s Cube solver that models cube state using matrix-based representation and applies a deterministic layer-by-layer solving algorithm. Designed with modular rotation logic and state validation to ensure correctness across transformations.


## 🚀 Quick Start

### Usage
```bash
cat scrambles.txt | ./Rubik
```

### Input Format
The solver accepts standard Rubik's cube notation scrambles via stdin. Each scramble should be on a separate line.

**Example Input:**
```
B2 F2 L' R2 F2 L R' B2 U2 F' D' U F U2 L2 D F2 U' R B2
```

**Example Output:**
```
D F2 U L2 F' U2 R' B2 F2 L' R2 F2 B2
```

## 🧩 Algorithm Overview

This solver implements the popular **Beginner's Method** used by speedcubers worldwide, broken down into systematic steps:

### 1. Cross Formation
- Constructs a cross pattern on the bottom face
- Positions all 4 edge pieces correctly relative to center pieces
- Foundation for the entire solve

### 2. First Layer Corners
- Solves the 4 corner pieces of the bottom layer
- Ensures proper color alignment with adjacent faces

### 3. Middle Layer Edges
- Completes the second layer by positioning 4 edge pieces
- Uses center pieces as reference points (centers never move)

### 4. Orient Last Layer (OLL)
The final layer orientation is split into two manageable phases:
- **Edge Orientation**: Handles 9 possible edge cases
- **Corner Orientation**: Manages corner piece orientations
- *Reduces complexity from 57 cases to just 9*

### 5. Permute Last Layer (PLL)
Final positioning step, also divided for simplicity:
- **Corner Permutation**: Places corners in correct positions
- **Edge Permutation**: Completes the solve with edge positioning
- *Simplifies from 21 cases to 8 manageable patterns*


🧠 Design Considerations
- Ensures cube state consistency after every rotation
- Uses deterministic rule-based solving (no brute force search)
- Tradeoff: prioritizes reliability and readability over shortest-move optimization


## 🎯 Technical Implementation

### Cube Representation
The cube state is modeled using a **2D matrix [9][6]**:
- **9 positions** per face (3x3 grid)
- **6 faces** total
- Each position stores color information

### Move Notation
Follows standard Rubik's cube notation:
- **Face rotations**: `R` `L` `U` `D` `F` `B` (90° clockwise)
- **Counter-clockwise**: Add `'` (prime) - e.g., `F'`
- **Double turns**: Add `2` - e.g., `R2`

### Rotation Engine
- Individual hardcoded rotation functions for each face
- Handles adjacent face updates automatically
- Maintains cube state integrity throughout transformations

## 📊 Performance Benefits

- **Reduced Case Analysis**: Beginner's method breaks complex scenarios into manageable chunks
- **Systematic Approach**: Each step is independent, making debugging easier
- **Human-Readable**: Uses intuitive solving patterns familiar to cubers
## 🌐 Full-Stack Visualization Interface

In addition to the C++ solving engine, this project includes a modern full-stack web application for interactive cube solving and visualization.

### Frontend

Built using:

* **React + Vite**
* **Three.js / React Three Fiber**
* **Tailwind CSS**

Features:

* Interactive 3D Rubik's Cube visualization
* Scramble input through a user-friendly interface
* Step-by-step solution playback
* Move history tracking and navigation
* Real-time solver integration
* Responsive dashboard-style UI

### Backend

Built using:

* **Node.js**
* **Express.js**

Responsibilities:

* Receives scramble sequences from the frontend
* Executes the C++ solver engine
* Returns generated solution sequences through API endpoints
* Bridges communication between the visualization layer and solving engine

### System Architecture

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

This architecture combines the reliability of a deterministic C++ solving algorithm with an interactive modern web interface, allowing users to both generate solutions and visualize the solving process in real time.


## 🛠️ Building & Running

```bash
# Compile
make

# Run with single scramble
echo "B2 F2 L' R2 F2 L R' B2 U2 F' D' U F U2 L2 D F2 U' R B2" | ./Rubik

# Run with multiple scrambles
cat scrambles.txt | ./Rubik
```
