import * as React from "react";
import { useState } from "react";

import { Gantt, type Task, ViewMode } from "gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher"

import { TaskListHeaderDefault } from "./custom-components/task-list-header-custom";
import { TaskListTableDefault } from "./custom-components/task-list-table-custom";

import "gantt-task-react/dist/index.css";

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

export const CustomGanttChart: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [view, setView] = useState<ViewMode>(ViewMode.Month);
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
        <div>
            <div className="circleCard">
                Hello, React!<br />
                Hello from Mac!
                {currentDate.getFullYear()}
            </div>
            <div style={{ padding: "5px", maxWidth: "100vw", overflowX: "auto" }}>
                <h1>Gantt Chart</h1>
                <ViewSwitcher
                    onViewModeChange={viewMode => setView(viewMode)}
                    onViewListChange={setIsChecked}
                    isChecked={isChecked}
                />
                <Gantt
                    tasks={tasks}
                    onExpanderClick={handleExpanderClick}
                    TaskListHeader={TaskListHeaderDefault}
                    TaskListTable={TaskListTableDefault}
                    locale={"en-GB"}
                    viewMode={view}
                    listCellWidth={isChecked ? "155px" : ""}
                    columnWidth={columnWidth}
                />
            </div>
        </div>
    );
};

export default CustomGanttChart;