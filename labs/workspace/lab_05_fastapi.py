#!/usr/bin/env python3
"""
Lab 05: REST API with FastAPI
============================================================
Topics: FastAPI, Pydantic, CRUD endpoints, HTTP methods
Run:    uvicorn lab_05_fastapi:app --reload --port 8001
Docs:   http://localhost:8001/docs
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI(
    title="DAQS Student API",
    description="Lab 05 — build a student management REST API",
    version="1.0.0",
)

# ── In-memory store ────────────────────────────────────────
students: dict[int, dict] = {
    1: {"id": 1, "name": "Alice",   "grade": 10, "score": 85.5},
    2: {"id": 2, "name": "Bob",     "grade": 11, "score": 72.0},
    3: {"id": 3, "name": "Charlie", "grade": 10, "score": 91.0},
}
next_id = 4


# ── Pydantic schemas ───────────────────────────────────────
class StudentCreate(BaseModel):
    name: str
    grade: int
    score: float


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    grade: Optional[int] = None
    score: Optional[float] = None


class Student(StudentCreate):
    id: int


# ── Exercise 1: GET /students ──────────────────────────────
# Return a list of all students.
@app.get("/students", response_model=list[Student])
def list_students():
    # TODO: return all students as a list
    pass


# ── Exercise 2: GET /students/{student_id} ─────────────────
# Return one student by ID, or 404 if not found.
@app.get("/students/{student_id}", response_model=Student)
def get_student(student_id: int):
    # TODO: look up student, raise HTTPException(status_code=404) if missing
    pass


# ── Exercise 3: POST /students ─────────────────────────────
# Create a new student. Auto-assign the next ID. Return the created student.
@app.post("/students", response_model=Student, status_code=201)
def create_student(body: StudentCreate):
    global next_id
    # TODO: create, store, and return the new student
    pass


# ── Exercise 4: PUT /students/{student_id} ─────────────────
# Update fields on an existing student (partial update). Return updated student.
@app.put("/students/{student_id}", response_model=Student)
def update_student(student_id: int, body: StudentUpdate):
    # TODO: validate existence, apply only provided fields, return updated student
    pass


# ── Exercise 5: DELETE /students/{student_id} ─────────────
# Delete a student. Return {"message": "deleted"}.
@app.delete("/students/{student_id}")
def delete_student(student_id: int):
    # TODO: validate existence, delete, return confirmation
    pass


# ── Bonus: GET /students/stats/summary ────────────────────
@app.get("/students/stats/summary")
def stats():
    """Return count, average score, top student."""
    # TODO: compute and return stats dict
    pass


if __name__ == "__main__":
    uvicorn.run("lab_05_fastapi:app", host="0.0.0.0", port=8001, reload=True)
