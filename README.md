# TaskFlow

A lightweight Kanban-style task management application for small teams, built as a full-stack assignment.

TaskFlow allows users to create, edit, delete, move, search, and filter tasks across workflow columns. All task changes are persisted through a Python backend and SQLite relational database.

## Live Demo

**Application:** [Click to see TaskFlow Live Demo](https://taskflow-theta-puce.vercel.app/)

**GitHub Repository:** [Click for TaskFlow GitHub Repository](https://github.com/malayjoshi01/taskflow)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [Database Design](#database-design)
- [SQL Queries](#sql-queries)
- [Validation and Error Handling](#validation-and-error-handling)
- [API Overview](#api-overview)
- [Prerequisites](#prerequisites)
- [Installation and Local Setup](#installation-and-local-setup)
- [Database Initialization and Seed Data](#database-initialization-and-seed-data)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Manual Verification Checklist](#manual-verification-checklist)
- [Responsive Design](#responsive-design)
- [Dark Mode](#dark-mode)
- [Design Decisions and Assumptions](#design-decisions-and-assumptions)
- [What I Would Improve](#what-i-would-improve)
- [What I Learned](#what-i-learned)
- [Development Time](#development-time)
- [Troubleshooting](#troubleshooting)
- [Submission Checklist](#submission-checklist)

---

# Overview

TaskFlow is a simple task board inspired by Kanban tools such as Trello.

The application has a single board containing workflow columns such as:

- To Do
- In Progress
- Done

Each column contains tasks.

Each task has:

- Title
- Optional description
- Status/column
- Priority
- Created date

The main goal of the project was to build a small but reliable full-stack application where the frontend, backend, and database work together rather than keeping application data only in browser state.

---

# Features

## Core Features

### View Board

The application displays:

- Board
- Columns
- Tasks
- Task priority
- Task descriptions
- Task creation date
- Task count per column

### Create Task

Users can create a task with:

- Required title
- Optional description
- Optional priority

Supported priorities:

- Low
- Medium
- High

### Edit Task

Existing tasks can be edited.

Users can update:

- Title
- Description
- Priority

### Delete Task

Users can delete existing tasks.

A confirmation step is shown before deletion.

### Move Task

Tasks can be moved between columns using a column selector.

Drag-and-drop was intentionally not required because the assignment states that a working dropdown is preferable to a broken drag-and-drop implementation.

### Priority Filtering

Users can filter tasks by:

- All
- Low
- Medium
- High

### Search

Tasks can be searched by title.

This was implemented as an optional stretch goal.

### Persistent Backend and Database

All CRUD and move operations are sent to the backend and persisted in SQLite.

Refreshing the page does not reset task data.

### Validation

Task titles cannot be empty.

Validation is implemented on the backend as well as the frontend.

### Error Handling

The frontend provides:

- Loading states
- Error states
- Success notifications
- Failed request notifications
- Retry functionality

### Responsive UI

The interface adapts to desktop, tablet, and mobile screen sizes.

### Dark Mode

An optional dark mode is available and the selected theme is persisted using browser localStorage.

---

# Tech Stack

## Frontend

- React
- JavaScript
- Vite
- HTML
- CSS

## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

## Database

- SQLite

## Testing

- Pytest
- FastAPI TestClient

---

# Architecture

TaskFlow uses a simple frontend/backend/database architecture.

```text
┌───────────────────────────────┐
│           React UI            │
│                               │
│ Board / Tasks / Search / UI  │
└───────────────┬───────────────┘
                │
                │ HTTP REST API
                ▼
┌───────────────────────────────┐
│         FastAPI Backend       │
│                               │
│ Routes / Validation / ORM     │
└───────────────┬───────────────┘
                │
                │ SQLAlchemy
                ▼
┌───────────────────────────────┐
│          SQLite DB            │
│                               │
│ Boards / Columns / Tasks      │
└───────────────────────────────┘
```

The database is the source of truth for persistent task state.

The frontend does not directly modify the database.

---

# Project Structure

```text
taskflow/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models/
│   │   ├── routes/
│   │   └── schemas/
│   │
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.py
│   │
│   ├── tests/
│   ├── requirements.txt
│   └── taskflow.db
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

> `venv/`, `node_modules/`, generated build files, local databases, and environment files should not be committed to the repository.

---

# Data Model

TaskFlow uses three relational entities.

## Board

A Board represents the task board.

```text
Board
-----
id
name
```

## Column

A Column belongs to a Board.

```text
Column
------
id
board_id
name
```

`board_id` is a foreign key referencing `Board`.

## Task

A Task belongs to a Column.

```text
Task
----
id
column_id
title
description
priority
created_at
```

`column_id` is a foreign key referencing `Column`.

---

# Entity Relationship

```text
Board
  │
  │ 1
  │
  │ many
  ▼
Column
  │
  │ 1
  │
  │ many
  ▼
Task
```

Therefore:

- One Board can contain multiple Columns.
- Each Column belongs to one Board.
- One Column can contain multiple Tasks.
- Each Task belongs to one Column.

Moving a task between columns updates its `column_id`.

---

# Database Design

SQLite was selected because it is a real relational database while keeping the project simple to run locally without requiring a separately installed database server.

The schema contains primary keys and foreign-key relationships.

The required schema is maintained in:

```text
backend/database/schema.sql
```

A representative schema is:

```sql
CREATE TABLE boards (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE columns (
    id INTEGER PRIMARY KEY,
    board_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (board_id)
        REFERENCES boards(id)
);

CREATE TABLE tasks (
    id INTEGER PRIMARY KEY,
    column_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (column_id)
        REFERENCES columns(id)
);
```

The actual `schema.sql` in the repository is the authoritative database schema.

## Important Database Constraints

The database enforces:

- Primary key on each table
- Foreign key from Column to Board
- Foreign key from Task to Column
- `NOT NULL` on required fields
- Optional description
- Required creation date
- Required task title

---

# SQL Queries

The assignment requires at least two meaningful database queries rather than simply retrieving all records and filtering them in application code.

## Query 1: Task Count Per Column

The following type of query counts tasks belonging to each column:

```sql
SELECT
    c.id,
    c.name,
    COUNT(t.id) AS task_count
FROM columns c
LEFT JOIN tasks t
    ON t.column_id = c.id
WHERE c.board_id = ?
GROUP BY c.id, c.name
ORDER BY c.id;
```

A `LEFT JOIN` is useful here because a column with zero tasks should still appear in the result.

For example:

```text
To Do          3
In Progress    2
Done           0
```

---

## Query 2: Tasks by Priority

The following query retrieves tasks with a requested priority and returns newest tasks first:

```sql
SELECT
    id,
    column_id,
    title,
    description,
    priority,
    created_at
FROM tasks
WHERE priority = ?
ORDER BY created_at DESC;
```

This query performs the filtering and sorting at the database layer rather than retrieving every task and filtering it in Python.

> The exact query implementation in the repository should be treated as the source of truth if it differs from the representative SQL shown above.

---

# Validation and Error Handling

## Empty Task Title

A task title is required.

The frontend prevents the user from submitting an empty title.

The backend also validates the title so that the rule cannot be bypassed by directly calling the API.

For example, this request should fail:

```json
{
  "title": "",
  "description": "Example task",
  "priority": "High"
}
```

This satisfies the assignment requirement that validation must exist on the backend as well as the frontend.

---

## Frontend Error Handling

Failed backend requests are converted into user-facing messages rather than leaving the interface blank or exposing raw backend errors.

Examples include:

```text
Task created successfully.
Task updated successfully.
Task deleted successfully.
Task moved successfully.
```

and appropriate error messages when an API request fails.

The board also provides a retry option when the initial board request cannot be loaded.

---

# API Overview

The backend exposes REST-style endpoints.

## Get Board

```http
GET /api/boards/{board_id}
```

Example:

```http
GET /api/boards/1
```

Returns the board with its columns and tasks.

## Create Task

```http
POST /api/columns/{column_id}/tasks
```

Example request:

```json
{
  "title": "Implement filtering",
  "description": "Add priority filtering",
  "priority": "High"
}
```

## Update Task

```http
PUT /api/tasks/{task_id}
```

Example request:

```json
{
  "title": "Implement priority filtering",
  "description": "Support High, Medium and Low filters",
  "priority": "Medium"
}
```

## Delete Task

```http
DELETE /api/tasks/{task_id}
```

## Move Task

```http
PATCH /api/tasks/{task_id}/move
```

Example request:

```json
{
  "column_id": 2
}
```

FastAPI's interactive API documentation is available locally at:

```text
http://127.0.0.1:8000/docs
```

---

# Prerequisites

Install the following before starting.

## Python

Python 3.10+ is recommended.

Verify:

```bash
python --version
```

## Node.js

Node.js 18+ is recommended.

Verify:

```bash
node --version
```

Verify npm:

```bash
npm --version
```

---

# Installation and Local Setup

Clone the repository:

```bash
git clone https://github.com/malayjoshi01/taskflow.git
```

Enter the project:

```bash
cd taskflow
```

The project has two separately running applications:

```text
backend/
frontend/
```

The backend and frontend should be run in separate terminals.

---

# Backend Setup

Open a terminal and navigate to the backend:

```bash
cd backend
```

## 1. Create Virtual Environment

Windows PowerShell:

```powershell
python -m venv venv
```

## 2. Activate Virtual Environment

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell reports that script execution is disabled, run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then activate again:

```powershell
.\venv\Scripts\Activate.ps1
```

A successful activation will show:

```text
(venv)
```

at the beginning of the terminal prompt.

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Database Initialization and Seed Data

The project includes a seed script so that a fresh database is not empty.

From the `backend` directory:

```bash
python -m database.seed
```

This initializes the board and sample task data.

The seed data allows the evaluator to immediately test:

- Board rendering
- Task cards
- Priorities
- Search
- Filtering
- Moving tasks
- Editing tasks
- Deleting tasks

---

# Running the Backend

From:

```text
taskflow/backend
```

with the virtual environment activated:

```bash
uvicorn app.main:app --reload
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

Open a second terminal.

Navigate to:

```bash
cd taskflow/frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display the local frontend URL, normally:

```text
http://localhost:5173
```

Open the displayed URL in a browser.

---

# Running the Complete Application

## Terminal 1 — Backend

```powershell
cd taskflow/backend

.\venv\Scripts\Activate.ps1

uvicorn app.main:app --reload
```

## Terminal 2 — Frontend

```powershell
cd taskflow/frontend

npm install
npm run dev
```

Then open the frontend URL shown by Vite.

---

# Testing

The backend includes automated tests using Pytest.

From the backend directory:

```bash
pytest
```

The implemented test suite covers the important assignment requirements.

The current test result is:

```text
3 passed
```

## Required Test 1 — Empty Title

Verifies that creating a task with no title fails.

## Required Test 2 — Move Task

Verifies that moving a task changes its column/status correctly.

## Required Test 3 — Database Layer

Verifies a database-level query against known seed data and confirms that the expected records/results are returned.

---

# Manual Verification Checklist

Before submission, verify the following manually.

## Board

- [x] Board loads
- [x] Columns appear
- [x] Seed tasks appear
- [x] Task counts are correct

## Create

- [x] Open New Task
- [x] Enter a title
- [x] Add description
- [x] Select priority
- [x] Create task
- [x] Task appears in the selected column
- [x] Refresh page
- [x] Task still exists

## Validation

- [x] Try submitting an empty title
- [x] Frontend prevents submission
- [x] Backend rejects an empty title

## Edit

- [x] Open task edit
- [x] Change title
- [x] Change description
- [x] Change priority
- [x] Save changes
- [x] Verify updated data

## Delete

- [x] Delete a task
- [x] Confirm deletion
- [x] Verify task disappears
- [x] Refresh page
- [x] Verify it remains deleted

## Move

- [x] Move task to another column
- [x] Verify task appears in new column
- [x] Refresh page
- [x] Verify task remains in new column

## Priority Filter

- [x] Select High
- [x] Verify only High tasks appear
- [x] Select Medium
- [x] Verify only Medium tasks appear
- [x] Select Low
- [x] Verify only Low tasks appear
- [x] Reset filter

## Search

- [x] Search for an existing task title
- [x] Verify matching tasks appear
- [x] Search for nonexistent text
- [x] Verify no matching tasks appear

## Error Handling

- [x] Stop backend
- [x] Refresh frontend
- [x] Verify a friendly error state
- [x] Restart backend
- [x] Click retry
- [x] Verify board loads again

## Theme

- [x] Switch to dark mode
- [x] Verify UI changes
- [x] Refresh browser
- [x] Verify theme persists
- [x] Switch back to light mode
- [x] Refresh browser
- [x] Verify light mode persists

## Responsive Design

Test using browser developer tools at:

- [x] Desktop
- [x] Tablet
- [x] Mobile
- [x] Small mobile

---

# Responsive Design

The interface is designed to remain usable across desktop, tablet, and mobile screen sizes.

The responsive behavior focuses on preserving the important functionality:

- Navigation
- Search
- Filters
- Task creation
- Task cards
- Task movement
- Modals
- Notifications

The application intentionally prioritizes usability over adding unnecessary visual complexity.

---

# Dark Mode

Dark mode is an optional UI enhancement.

The selected theme is saved using browser `localStorage`.

The key used is:

```text
taskflow-theme
```

This allows the theme preference to survive a page refresh.

The dark mode implementation does not affect backend or database functionality.

---

# Design Decisions and Assumptions

## Single Board

The assignment describes a Board but does not require creating multiple boards.

Therefore, the implementation uses a single board.

This keeps the scope focused on the required task-management functionality.

## No Authentication

Authentication and multiple users/teams were explicitly listed as out of scope.

No login or registration system was added.

## SQLite

SQLite was chosen because:

- It is a real relational database.
- It supports primary and foreign keys.
- It requires no separate database server.
- It makes local setup simple.
- It satisfies the assignment requirements.

## Task Movement

A dropdown-based movement control was used instead of drag-and-drop.

This was a deliberate trade-off based on the assignment's instruction that a reliable control is preferable to a broken drag-and-drop experience.

## Search

Title search was implemented as the optional stretch goal because it provides useful functionality without significantly increasing the complexity of the application.

## Database as Source of Truth

After create, edit, delete, and move operations, the application reloads board data from the backend.

This ensures that the UI reflects the persisted database state instead of relying only on local React state.

---

# What I Would Improve

If additional time were available, I would consider the following improvements.

## Drag-and-Drop

Add reliable drag-and-drop task movement while keeping the existing dropdown as an accessible fallback.

## Multiple Boards

Allow users to create and switch between multiple boards.

## Authentication

Add authentication and authorization for a real multi-user implementation.

## PostgreSQL

Move to PostgreSQL for a larger production deployment with concurrent users.

## Optimistic UI Updates

Instead of reloading the complete board after every mutation, update only the affected task/column after receiving a successful API response.

## More Automated Tests

Add frontend tests for:

- Task creation
- Editing
- Deletion
- Filtering
- Search
- Error states
- Dark mode

---

# What I Learned

One of the most useful parts of this assignment was working through the distinction between **frontend state and persisted application state**.

It is possible to make a task appear to move between columns by changing React state, but that does not guarantee that the change was persisted.

For this reason, TaskFlow treats the database as the source of truth. Task mutations are sent to the backend and persisted in SQLite, and the frontend then retrieves the updated board state.

The database requirements also provided an opportunity to focus on relational design, foreign-key relationships, constraints, and queries that perform filtering and aggregation at the database level.

---

# Development Time

Approximate development time:

```text
Backend + database:   [5 hours]
Frontend:             [4.5 hours]
Testing/debugging:    [1 hours]
Deployment            [1.5 hours]
Documentation:        [1.5 hours]


Total:                [13.5 hours]
```

---

# Troubleshooting

## PowerShell blocks virtual environment activation

If you see:

```text
running scripts is disabled on this system
```

run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then:

```powershell
.\venv\Scripts\Activate.ps1
```

---

## `npm` is not recognized

Verify Node.js:

```bash
node --version
```

Then:

```bash
npm --version
```

If Node.js was installed while VS Code was already open, restart VS Code so the updated PATH is available.

---

## Frontend dependencies are missing

From the frontend directory:

```bash
npm install
```

Then:

```bash
npm run dev
```

---

## Backend dependencies are missing

Activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

Then:

```bash
pip install -r requirements.txt
```

---

## Backend does not start

Make sure you are inside:

```text
taskflow/backend
```

Then run:

```bash
uvicorn app.main:app --reload
```

---

## Database has no sample data

From the backend directory:

```bash
python -m database.seed
```

---

# Submission Checklist

Before submitting through Internshala, verify:

## Code

- [x] Frontend works
- [x] Backend works
- [x] Database works
- [x] No debugging `console.log` statements
- [x] No unnecessary commented-out code
- [x] Meaningful names and clean structure

## Database

- [x] Actual schema file included
- [x] Primary keys present
- [x] Board → Column foreign key present
- [x] Column → Task foreign key present
- [x] Required fields use `NOT NULL`
- [x] Seed data included
- [x] Task-count query included
- [x] Priority query included

## Tests

- [x] Empty-title test passes
- [x] Move-task test passes
- [x] Database query test passes
- [x] Full test suite passes

## Documentation

- [x] README included
- [x] Setup instructions tested
- [x] Decisions documented
- [x] Assumptions documented
- [x] Improvements documented
- [x] Development time added
- [x] Learning/interesting finding added

## Repository

- [x] GitHub repository created
- [x] Repository is public or evaluator has access
- [x] `.gitignore` included
- [x] No virtual environment committed
- [x] No `node_modules` committed
- [x] No secrets committed

## Deployment

- [x] Backend deployed
- [x] Frontend deployed
- [x] Production API URL configured
- [x] Live application tested
- [x] Live URL added above

---

# Final Clean-Clone Verification

Before submission, clone the repository into a fresh location and follow this README from the beginning.

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd taskflow
```

Then:

```text
Fresh Clone
     ↓
Install Dependencies
     ↓
Initialize Database
     ↓
Start Backend
     ↓
Start Frontend
     ↓
Open TaskFlow
     ↓
Create Task
     ↓
Edit Task
     ↓
Move Task
     ↓
Filter/Search
     ↓
Delete Task
     ↓
Refresh Browser
     ↓
Verify Data Persistence
```

This final test is important because the assignment specifically evaluates whether another person can clone the project and run it successfully without relying on the original development environment.

---

# Submission

**GitHub Repository:** `https://github.com/malayjoshi01/taskflow`

**Live Application:** `https://taskflow-theta-puce.vercel.app/`

**Assignment:** TaskFlow Full-Stack Task Board

**Frontend:** React + Vite

**Backend:** Python + FastAPI

**Database:** SQLite

**Testing:** Pytest
