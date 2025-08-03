# Elevator Simulation System

## Overview

This project simulates an elevator system with support for multiple elevators, dynamic request scheduling, intelligent dispatching, and real-time UI updates. It is optimized for performance and includes features for aging requests, time-based logic, and stress testing.

---

## 🔧 Tech Stack

* **Frontend:** React + TypeScript + Tailwind CSS
* **Backend:** Node.js + Express
* **Deployment:** Vercel (Frontend) & Railway (Backend)

---

## 🚀 Features

* Adjustable number of elevators (`n`) and floors (`k`)
* Manual request entry (origin → destination)
* Morning rush logic (9–10 AM priority to floor 0)
* Intelligent dispatch using scoring algorithm
* Aging requests escalated after 30 seconds
* Visual door animation, direction indicators
* Real-time performance metrics (wait/travel/fulfillment times)
* Speed control (1x, 2x, 5x)
* Stress test mode (100 requests with logging & timing)

---

## 📦 Setup Instructions

### Backend (Railway hosted)

```bash
npm install
npm run dev
```

### Frontend (Vercel hosted)

```bash
npm install
npm run dev
```

### Environment Variables

Set backend base URL in `api/simulation.ts`:

```ts
const BASE_URL = 'https://elevatorsimulationsystem-elevatorsimulationsystem.up.railway.app';
```

---

## 📊 Metrics Example (From Stress Test)

| Metric                   | Value (example) |
| ------------------------ | --------------- |
| Total Requests Completed | 100             |
| Avg Wait Time            | 19.62s           |
| Avg Travel Time          | 24.49s           |
| Avg Fulfillment Time     | 3.11s           |

---

## Report Summary

### 🚦 Dispatching Algorithm

We use a multi-criteria scoring system:

* Penalize elevators with long queues.
* Prefer idle elevators.
* Prioritize requests that have aged > 30s.
* Use direction-aware scoring (avoid sending elevator in wrong direction).

### 🌅 Morning Rush Bias

Between 9:00–10:00 AM, idle elevators not at floor 0 are directed to floor 0 to prepare for up traffic. This reduces response time during peak entry times.

### ⏳ Aging Requests

Any request waiting > 30 seconds is immediately escalated and assigned to the closest elevator, ignoring direction bias to prevent starvation.

### 🧪 Stress Test

A custom stress testing script adds 100 random requests within a time window. The script includes:

* Live progress bar
* Console performance timing
* Output to `stress-test.log`

### 📈 Metrics

Wait time, travel time, and fulfillment time are recorded for each request. These are computed in real-time by the backend and shown in the sidebar metrics panel.

---

## ✅ Project Completion Status

* [x] Core simulation engine
* [x] Backend dispatch logic (with edge-case handling)
* [x] Real-time frontend visualization
* [x] Stress testing tool
* [x] Metrics collection
* [x] Deployment (Vercel + Railway)
* [x] README and report

---

## 📬 Author

Aredla Nithin
GitHub: [ElevatorSimulationSystem](https://github.com/nithinaredla/ElevatorSimulationSystem)

---

