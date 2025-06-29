import React, { useState } from "react";
import { Gantt, type Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { TaskListHeaderDefault } from "./custom-components/task-list-header-custom";
import { TaskListTableDefault } from "./custom-components/task-list-table-custom";
import { ViewSwitcher } from "./components/view-switcher";

const App: React.FC = () => {
  const currentDate: Date = new Date();

  const initialTasks: Task[] = [
    {
      name: "Project Test",
      id: "TestProject",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), 10, 15),
      progress: 85,
      type: "project",
      hideChildren: false,
    },
    {
      id: "1",
      name: "Task 1",
      start: new Date(2025, 5, 3),
      end: new Date(2025, 5, 8),
      progress: 50,
      type: "task",
      project: "TestProject",
    },
    {
      id: "2",
      name: "Task 2",
      start: new Date(2025, 5, 10),
      end: new Date(2025, 5, 15),
      progress: 75,
      type: "task",
      project: "TestProject",
    },
  ];

  const [view, setView] = useState<ViewMode>(ViewMode.Month);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isChecked, setIsChecked] = React.useState(true);

  let columnWidth = 65;
  if (view === ViewMode.Year) {
    columnWidth = 300;
  } else if (view === ViewMode.Month) {
    columnWidth = 200;
  } else if (view === ViewMode.Week) {
    columnWidth = 150;
  }

  const handleExpanderClick = (task: Task) => {
    const updatedTasks = tasks.map(t =>
      t.id === task.id ? { ...t, hideChildren: !t.hideChildren } : t
    );
    setTasks(updatedTasks);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "75vw", overflowX: "auto" }}>
      <h1>Gantt Chart</h1>
      <ViewSwitcher
        onViewModeChange={viewMode => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <Gantt tasks={tasks}
        viewMode={view}
        onExpanderClick={handleExpanderClick}
        locale={"en-GB"}
        TaskListHeader={TaskListHeaderDefault}
        TaskListTable={TaskListTableDefault}
        listCellWidth={isChecked ? "155px" : ""}
        columnWidth={columnWidth}
      />
    </div>
  );
};

export default App;
