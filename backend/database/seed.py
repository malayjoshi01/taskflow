from datetime import datetime, timedelta

from app.database import SessionLocal
from app.models import Board, BoardColumn, Task


def seed_database():
    db = SessionLocal()

    try:
        existing_board = db.query(Board).first()

        if existing_board:
            print("Database already contains data. Skipping seed.")
            return

        board = Board(name="TaskFlow Board")
        db.add(board)
        db.flush()

        todo = BoardColumn(
            board_id=board.id,
            name="To Do",
            position=1,
        )

        in_progress = BoardColumn(
            board_id=board.id,
            name="In Progress",
            position=2,
        )

        done = BoardColumn(
            board_id=board.id,
            name="Done",
            position=3,
        )

        db.add_all([todo, in_progress, done])
        db.flush()

        tasks = [
            Task(
                column_id=todo.id,
                title="Design database schema",
                description="Create the relational database structure for TaskFlow.",
                priority="High",
                created_at=datetime.utcnow() - timedelta(days=3),
            ),
            Task(
                column_id=todo.id,
                title="Build task creation API",
                description="Implement the endpoint for creating new tasks.",
                priority="High",
                created_at=datetime.utcnow() - timedelta(days=2),
            ),
            Task(
                column_id=in_progress.id,
                title="Build React board",
                description="Create the main task board interface.",
                priority="Medium",
                created_at=datetime.utcnow() - timedelta(days=1),
            ),
            Task(
                column_id=in_progress.id,
                title="Connect frontend to API",
                description="Connect React components with the FastAPI backend.",
                priority="High",
                created_at=datetime.utcnow(),
            ),
            Task(
                column_id=done.id,
                title="Project setup",
                description="Initialize the TaskFlow project.",
                priority="Low",
                created_at=datetime.utcnow() - timedelta(days=5),
            ),
            Task(
                column_id=done.id,
                title="Configure SQLite",
                description="Set up the SQLite database connection.",
                priority="Medium",
                created_at=datetime.utcnow() - timedelta(days=4),
            ),
        ]

        db.add_all(tasks)
        db.commit()

        print("Database seeded successfully.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()