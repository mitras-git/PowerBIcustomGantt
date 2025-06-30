import * as React from "react";
import { useState } from "react";
import { Gantt, type Task } from "gantt-task-react";
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
]

// const [tasks, setTasks] = useState<Task[]>(initialTasks);

// const handleExpanderClick = (task: Task) => {
//     const updatedTasks = tasks.map(t =>
//         t.id === task.id ? { ...t, hideChildren: !t.hideChildren } : t
//     );
//     setTasks(updatedTasks)
// };

export class ReactCircleCard extends React.Component<{}>{
    render(){
        const tasks = initialTasks;

        return (
            <div>
                <div className="circleCard">
                    {currentDate.getFullYear()}
                    Hello, React!
                </div>
                <div style={{ padding: "5px", maxWidth: "100vw", overflowX: "auto" }}>
                    <h1>Gantt Chart</h1>
                    <Gantt tasks={tasks} 
                    // onExpanderClick={handleExpanderClick}
                    // TaskListHeader={TaskListHeaderDefault}
                    // TaskListTable={TaskListTableDefault}
                    locale={"en-GB"} />
                </div>
            </div>
        )
    }
}

export default ReactCircleCard;