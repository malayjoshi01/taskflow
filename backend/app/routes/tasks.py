from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import desc
from sqlalchemy.orm import Session
from ..services.queries import (
    get_task_count_per_column,
    get_tasks_by_priority,
)

from ..database import get_db
from ..models import BoardColumn, Task
from ..schemas import (
    Priority,
    TaskCreate,
    TaskMove,
    TaskResponse,
    TaskUpdate,
)


router = APIRouter(prefix="/api", tags=["Tasks"])


@router.post(
    "/columns/{column_id}/tasks",
    response_model=TaskResponse,
    status_code=201,
)
def create_task(
    column_id: int,
    task_data: TaskCreate,
    db: Session = Depends(get_db),
):
    column = (
        db.query(BoardColumn)
        .filter(BoardColumn.id == column_id)
        .first()
    )

    if not column:
        raise HTTPException(
            status_code=404,
            detail="Column not found",
        )

    task = Task(
        column_id=column_id,
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


@router.put(
    "/tasks/{task_id}",
    response_model=TaskResponse,
)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
):
    task = (
        db.query(Task)
        .filter(Task.id == task_id)
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    task.title = task_data.title
    task.description = task_data.description
    task.priority = task_data.priority

    db.commit()
    db.refresh(task)

    return task


@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
):
    task = (
        db.query(Task)
        .filter(Task.id == task_id)
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}


@router.patch(
    "/tasks/{task_id}/move",
    response_model=TaskResponse,
)
def move_task(
    task_id: int,
    move_data: TaskMove,
    db: Session = Depends(get_db),
):
    task = (
        db.query(Task)
        .filter(Task.id == task_id)
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    target_column = (
        db.query(BoardColumn)
        .filter(BoardColumn.id == move_data.column_id)
        .first()
    )

    if not target_column:
        raise HTTPException(
            status_code=404,
            detail="Target column not found",
        )

    task.column_id = target_column.id

    db.commit()
    db.refresh(task)

    return task


@router.get(
    "/boards/{board_id}/tasks",
    response_model=list[TaskResponse],
)
def get_tasks(
    board_id: int,
    priority: Priority | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Task)
        .join(BoardColumn)
        .filter(BoardColumn.board_id == board_id)
    )

    if priority:
        query = query.filter(Task.priority == priority)

    return query.order_by(desc(Task.created_at)).all()
@router.get("/boards/{board_id}/task-counts")
def task_counts(
    board_id: int,
    db: Session = Depends(get_db),
):
    return get_task_count_per_column(db, board_id)


@router.get("/tasks/priority/{priority}")
def tasks_by_priority(
    priority: Priority,
    db: Session = Depends(get_db),
):
    return get_tasks_by_priority(db, priority)