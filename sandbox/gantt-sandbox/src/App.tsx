import React, { useState } from "react";
import { Gantt, type Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { TaskListHeaderDefault } from "./custom-components/task-list-header-custom";
import { TaskListTableDefault } from "./custom-components/task-list-table-custom";
import { ViewSwitcher } from "./components/view-switcher";

const App: React.FC = () => {
  const currentDate: Date = new Date();

  // Color state management for Power BI format preferences demo
  const [colors, setColors] = useState({
    barProgress: "#1f77b4",
    barSelected: "#ff7f0e", 
    projectProgress: "#2ca02c",
    projectSelected: "#d62728",
    milestone: "#9467bd",
    milestoneSelected: "#8c564b"
  });

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
    {
      id: "3",
      name: "Milestone 1",
      start: new Date(2025, 5, 16),
      end: new Date(2025, 5, 16),
      progress: 0,
      type: "milestone",
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
    columnWidth = 75;
  } else if (view === ViewMode.Week) {
    columnWidth = 150;
  }

  const handleExpanderClick = (task: Task) => {
    const updatedTasks = tasks.map(t =>
      t.id === task.id ? { ...t, hideChildren: !t.hideChildren } : t
    );
    setTasks(updatedTasks);
  };

  const handleColorChange = (colorType: keyof typeof colors, value: string) => {
    setColors(prev => ({ ...prev, [colorType]: value }));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "90vw", overflowX: "auto" }}>
      <h1>Power BI Custom Gantt Chart - Color Customization Demo</h1>
      
      {/* Color Customization Panel - simulating Power BI format panel */}
      <div style={{ 
        background: "#f8f9fa", 
        padding: "15px", 
        marginBottom: "20px", 
        borderRadius: "8px",
        border: "1px solid #dee2e6"
      }}>
        <h3 style={{ margin: "0 0 15px 0", color: "#495057" }}>Gantt Colors (Power BI Format Panel)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Task Progress Color:</label>
            <input 
              type="color" 
              value={colors.barProgress} 
              onChange={(e) => handleColorChange("barProgress", e.target.value)}
              style={{ width: "100%", height: "35px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Task Selected Color:</label>
            <input 
              type="color" 
              value={colors.barSelected} 
              onChange={(e) => handleColorChange("barSelected", e.target.value)}
              style={{ width: "100%", height: "35px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Project Progress Color:</label>
            <input 
              type="color" 
              value={colors.projectProgress} 
              onChange={(e) => handleColorChange("projectProgress", e.target.value)}
              style={{ width: "100%", height: "35px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Project Selected Color:</label>
            <input 
              type="color" 
              value={colors.projectSelected} 
              onChange={(e) => handleColorChange("projectSelected", e.target.value)}
              style={{ width: "100%", height: "35px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Milestone Color:</label>
            <input 
              type="color" 
              value={colors.milestone} 
              onChange={(e) => handleColorChange("milestone", e.target.value)}
              style={{ width: "100%", height: "35px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Milestone Selected Color:</label>
            <input 
              type="color" 
              value={colors.milestoneSelected} 
              onChange={(e) => handleColorChange("milestoneSelected", e.target.value)}
              style={{ width: "100%", height: "35px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
        </div>
        <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#6c757d" }}>
          * Click on tasks/projects to see selected colors. The colors above will be available in Power BI's format panel.
        </p>
      </div>

      <ViewSwitcher
        onViewModeChange={viewMode => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <Gantt 
        tasks={tasks}
        viewMode={view}
        barProgressColor={colors.barProgress}
        barProgressSelectedColor={colors.barSelected}
        projectProgressColor={colors.projectProgress}
        projectProgressSelectedColor={colors.projectSelected}
        milestoneBackgroundColor={colors.milestone}
        milestoneBackgroundSelectedColor={colors.milestoneSelected}
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
