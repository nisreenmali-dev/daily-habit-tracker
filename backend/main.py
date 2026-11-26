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

tasks = [
    {"id": 1, "title": "Build Docker images", "done": True},
    {"id": 2, "title": "Deploy to AWS EC2", "done": False},
]


class TaskCreate(BaseModel):
    title: str


@app.get("/api/tasks")
def get_tasks():
    return tasks


@app.post("/api/tasks")
def add_task(task: TaskCreate):
    new_task = {
        "id": len(tasks) + 1,
        "title": task.title.strip(),
        "done": False,
    }
    tasks.append(new_task)
    return new_task
