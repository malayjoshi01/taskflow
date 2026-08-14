from sqlalchemy import text
from sqlalchemy.orm import Session


def get_task_count_per_column(db: Session, board_id: int):
    query = text("""
        SELECT
            c.id AS column_id,
            c.name AS column_name,
            COUNT(t.id) AS task_count
        FROM columns c
        LEFT JOIN tasks t
            ON t.column_id = c.id
        WHERE c.board_id = :board_id
        GROUP BY c.id, c.name, c.position
        ORDER BY c.position;
    """)

    result = db.execute(
        query,
        {"board_id": board_id},
    )

    return [dict(row._mapping) for row in result]


def get_tasks_by_priority(
    db: Session,
    priority: str,
):
    query = text("""
        SELECT
            id,
            column_id,
            title,
            description,
            priority,
            created_at
        FROM tasks
        WHERE priority = :priority
        ORDER BY created_at DESC;
    """)

    result = db.execute(
        query,
        {"priority": priority},
    )

    return [dict(row._mapping) for row in result]