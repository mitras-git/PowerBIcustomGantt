import * as React from "react";
import { useState, useEffect } from "react";

import { Gantt, ViewMode } from "gantt-task-react";
import { Task, GanttColors } from "./types";
import { ViewSwitcher } from "./components/view-switcher"

import { TaskListHeaderDefault } from "./custom-components/task-list-header-custom";
import { TaskListTableDefault } from "./custom-components/task-list-table-custom";

import "gantt-task-react/dist/index.css";

const currentDate: Date = new Date();

// Fallback tasks when no data is provided
const fallbackTasks: Task[] = [
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
        dependencies: ["1"],
        project: "TestProject",
    },
];

interface CustomGanttChartProps {
    tasks?: Task[];
    width?: number;
    height?: number;
    colors?: GanttColors;
}

export const CustomGanttChart: React.FC<CustomGanttChartProps> = ({ tasks: propTasks, width, height, colors }) => {
    const [tasks, setTasks] = useState<Task[]>(propTasks && propTasks.length > 0 ? propTasks : fallbackTasks);
    const [view, setView] = useState<ViewMode>(ViewMode.Month);
    const [isChecked, setIsChecked] = React.useState(true);

    // Update tasks when prop changes
    useEffect(() => {
        if (propTasks && propTasks.length > 0) {
            setTasks(propTasks);
        }
    }, [propTasks]);
    
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
            {/* <div className="circleCard">
                Hello, React!<br />
                Hello from Mac!
                {currentDate.getFullYear()}
            </div> */}
            <div style={{ padding: "5px", height, width, overflow: "auto" }}>
                {/* <h1>Gantt Chart</h1> */}
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
                    ganttHeight={height}
                    columnWidth={columnWidth}
                    barProgressColor={colors?.barProgress}
                    barProgressSelectedColor={colors?.barSelected}
                    projectProgressColor={colors?.projectProgress}
                    projectProgressSelectedColor={colors?.projectSelected}
                    milestoneBackgroundColor={colors?.milestone}
                    milestoneBackgroundSelectedColor={colors?.milestoneSelected}
                />
            </div>
        </div>
    );
};

export default CustomGanttChart;