import Column from "./Column";

function Board({
  board,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onAddTask,
}) {
  if (!board) {
    return null;
  }

  return (
    <main className="board">
      {board.columns?.map((column) => (
        <Column
          key={column.id}
          column={column}
          allColumns={board.columns}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onMoveTask={onMoveTask}
          onAddTask={onAddTask}
        />
      ))}
    </main>
  );
}

export default Board;