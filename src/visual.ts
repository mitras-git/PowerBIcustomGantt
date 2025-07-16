/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import powerbi from "powerbi-visuals-api";

import DataView = powerbi.DataView;
import DataViewCategorical = powerbi.DataViewCategorical;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import * as React from "react";
import * as ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import CustomGanttChart from "./component";
import { type Task } from "gantt-task-react";

import "./../style/visual.less";

export class Visual implements IVisual {
    private target: HTMLElement;
    private reactRoot: any;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.reactRoot = createRoot(this.target);
        this.reactRoot.render(React.createElement(CustomGanttChart, { tasks: [] }));
    }

    private transformDataToTasks(categoricalDataView: DataViewCategorical): Task[] {
        if (!categoricalDataView || !categoricalDataView.categories || categoricalDataView.categories.length === 0) {
            return [];
        }

        const tasks: Task[] = [];
        const dataLength = categoricalDataView.categories[0].values.length;

        for (let i = 0; i < dataLength; i++) {
            // Based on capabilities.json mapping:
            // Index 0: taskName, Index 1: taskId, Index 2: startDate, Index 3: endDate, Index 4: dependencies, Index 5: progress
            const taskName = (categoricalDataView.categories[0]?.values[i] as string) || `Task ${i + 1}`;
            const taskId = (categoricalDataView.categories[1]?.values[i] as string) || `task-${i + 1}`;
            const startDateValue = categoricalDataView.categories[2]?.values[i];
            const endDateValue = categoricalDataView.categories[3]?.values[i];
            const dependencies = (categoricalDataView.categories[4]?.values[i] as string) || "";
            const progressValue = categoricalDataView.categories[5]?.values[i];

            // Handle date parsing
            const startDate = startDateValue ? new Date(startDateValue as any) : new Date();
            const endDate = endDateValue ? new Date(endDateValue as any) : new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // Add 1 day if no end date

            // Handle progress parsing
            const progress = typeof progressValue === 'number' ? progressValue : 
                            typeof progressValue === 'string' ? parseFloat(progressValue) || 0 : 0;

            const task: Task = {
                id: taskId,
                name: taskName,
                start: startDate,
                end: endDate,
                progress: Math.max(0, Math.min(100, progress)), // Clamp between 0-100
                type: "task",
                dependencies: dependencies ? dependencies.split(',').map(dep => dep.trim()).filter(dep => dep) : undefined
            };

            tasks.push(task);
        }

        return tasks;
    }

    public update(options: VisualUpdateOptions) {
        if (!options.dataViews || options.dataViews.length === 0) {
            this.reactRoot.render(React.createElement(CustomGanttChart, { tasks: [] }));
            return;
        }

        const dataView: DataView = options.dataViews[0];
        if (!dataView || !dataView.categorical) {
            this.reactRoot.render(React.createElement(CustomGanttChart, { tasks: [] }));
            return;
        }

        const categoricalDataView: DataViewCategorical = dataView.categorical;

        console.log(categoricalDataView.categories[0].values);

        // Transform data to tasks and pass to component
        const tasks = this.transformDataToTasks(categoricalDataView);
        this.reactRoot.render(React.createElement(CustomGanttChart, { tasks }));
    }
}