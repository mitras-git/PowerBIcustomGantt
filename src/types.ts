// Extended Task interface with custom properties
import { Task as GanttTask } from "gantt-task-react";

export interface Task extends GanttTask {
    heirarchyLevel?: number | null;
}

export interface GanttColors {
    barProgress?: string;
    barSelected?: string;
    projectProgress?: string;
    projectSelected?: string;
    milestone?: string;
    milestoneSelected?: string;
}