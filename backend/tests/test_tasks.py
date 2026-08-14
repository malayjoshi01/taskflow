from app.models import Board, BoardColumn, Task
from app.services.queries import get_task_count_per_column


def create_test_board(db):
    board = Board(name="Test Board")
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
    db.commit()

    return board, todo, in_progress, done


def test_create_task_without_title_fails(client, db):
    _, todo, _, _ = create_test_board(db)

    response = client.post(
        f"/api/columns/{todo.id}/tasks",
        json={
            "title": "",
            "description": "This should fail",
            "priority": "Medium",
        },
    )

    assert response.status_code == 422


def test_move_task_updates_column(client, db):
    _, todo, _, done = create_test_board(db)

    task = Task(
        column_id=todo.id,
        title="Move this task",
        priority="High",
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    response = client.patch(
        f"/api/tasks/{task.id}/move",
        json={
            "column_id": done.id,
        },
    )

    assert response.status_code == 200

    db.refresh(task)

    assert task.column_id == done.id


def test_task_count_per_column_query(db):
    _, todo, in_progress, done = create_test_board(db)

    db.add_all(
        [
            Task(
                column_id=todo.id,
                title="Task 1",
                priority="High",
            ),
            Task(
                column_id=todo.id,
                title="Task 2",
                priority="Low",
            ),
            Task(
                column_id=in_progress.id,
                title="Task 3",
                priority="Medium",
            ),
        ]
    )

    db.commit()

    results = get_task_count_per_column(
        db,
        todo.board_id,
    )

    counts = {
        row["column_name"]: row["task_count"]
        for row in results
    }

    assert counts["To Do"] == 2
    assert counts["In Progress"] == 1
    assert counts["Done"] == 0