from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

habits = [
    {"id": 1, "title": "Drink 2L of water", "completed": True},
    {"id": 2, "title": "30-minute workout", "completed": False},
    {"id": 3, "title": "Read 20 pages", "completed": False},
    {"id": 4, "title": "Practice system design", "completed": False},
]
next_id = 5


class HabitCreate(BaseModel):
    title: str


@app.get("/api/habits")
def get_habits():
    return habits


@app.post("/api/habits")
def add_habit(payload: HabitCreate):
    global next_id
    item = {"id": next_id, "title": payload.title.strip(), "completed": False}
    habits.append(item)
    next_id += 1
    return item


@app.put("/api/habits/{habit_id}")
def toggle_habit(habit_id: int):
    for item in habits:
        if item["id"] == habit_id:
            item["completed"] = not item["completed"]
            return item
    return {"error": "Not found"}
