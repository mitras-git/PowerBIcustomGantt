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
import IVisualHost = powerbi.extensibility.visual.IVisualHost;

import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import CustomGanttChart from "./component";
import { Task, GanttColors } from "./types";

import { DataRoleIndex, getDataRoleIndex } from "./helper";
import { VisualFormattingSettingsModel } from "./settings";

import "./../style/visual.less";

export class Visual implements IVisual {
    private target: HTMLElement;
    private reactRoot: any;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.reactRoot = createRoot(this.target);
        this.formattingSettingsService = new FormattingSettingsService();
        this.reactRoot.render(React.createElement(CustomGanttChart, { tasks: [] }));
    }

    private transformDataToTasks(categoricalDataView: DataViewCategorical): Task[] {
        if (!categoricalDataView || !categoricalDataView.categories || categoricalDataView.categories.length === 0) {
            return [];
        }

        const tasks: Task[] = [];
        const dataLength = categoricalDataView.categories[0].values.length;

        const indices = getDataRoleIndex(categoricalDataView);

        for (let i = 0; i < dataLength; i++) {
            // Index 0: taskName, Index 1: taskId, Index 2: startDate, Index 3: endDate, Index 4: dependencies, Index 5: progress

            const taskName = (categoricalDataView.categories[indices[DataRoleIndex.TaskName]]?.values[i] as string) || `Task ${i + 1}`;
            const taskId = (categoricalDataView.categories[indices[DataRoleIndex.TaskId]]?.values[i] as string) || `task-${i + 1}`;
            const startDateValue = categoricalDataView.categories[indices[DataRoleIndex.StartDate]]?.values[i];
            const endDateValue = categoricalDataView.categories[indices[DataRoleIndex.EndDate]]?.values[i];
            // const dependencies = (categoricalDataView.categories[indices[DataRoleIndex.Dependencies]]?.values[i] as string) || "";
            const progressValue = categoricalDataView.categories[indices[DataRoleIndex.Progress]]?.values[i];

            // Handle date parsing
            const startDate = startDateValue ? new Date(startDateValue as any) : new Date();
            const endDate = endDateValue ? new Date(endDateValue as any) : new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

            // Handle progress parsing
            const progress = typeof progressValue === 'number' ? progressValue :
                typeof progressValue === 'string' ? parseFloat(progressValue) || 0 : 0;


            const task: Task = {
                id: taskId,
                name: taskName,
                start: startDate,
                end: endDate,
                progress: progress,
                type: "task",
                // dependencies: dependencies ? dependencies.split(',').map(dep => dep.trim()).filter(dep => dep) : undefined
                heirarchyLevel: null, // Default hierarchy level
            };

            tasks.push(task);
        }
        return this.hierarchyCalculation(tasks);
    }

    private hierarchyCalculation(tasks: Task[]): Task[] {
        const taskMap: Map<string, Task> = new Map(tasks.map(task => [task.id, task]));

        tasks.forEach(task => {
            if (task.project) {
                // console.log("If level 1 triggered for task:", task.name);
                const parentTask = taskMap.get(task.project);
                if (parentTask) {
                    // console.log("If level 2 triggered for task:", task.name);
                    task.heirarchyLevel = (parentTask.heirarchyLevel || 0) + 1;
                }
            } else {
                // console.log("Else 0 triggered for task:", task.name);
                task.heirarchyLevel = 0;
            }
        });

        return tasks;
    }

    private getGanttColors(): GanttColors {
        const colors: GanttColors = {};
        if (this.formattingSettings) {
            const card = this.formattingSettings.ganttColorsCard;
            if (card.barProgress.value?.value) colors.barProgress = card.barProgress.value.value;
            if (card.barSelected.value?.value) colors.barSelected = card.barSelected.value.value;
            if (card.projectProgress.value?.value) colors.projectProgress = card.projectProgress.value.value;
            if (card.projectSelected.value?.value) colors.projectSelected = card.projectSelected.value.value;
            if (card.milestone.value?.value) colors.milestone = card.milestone.value.value;
            if (card.milestoneSelected.value?.value) colors.milestoneSelected = card.milestoneSelected.value.value;
        }
        return colors;
    }
    public update(options: VisualUpdateOptions) {
        // Get formatting settings
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews?.[0]);
        
        if (!options.dataViews || options.dataViews.length === 0) {
            this.reactRoot.render(React.createElement(CustomGanttChart, { tasks: [], colors: this.getGanttColors() }));
            return;
        }

        const dataView: DataView = options.dataViews[0];
        if (!dataView || !dataView.categorical) {
            this.reactRoot.render(React.createElement(CustomGanttChart, { tasks: [], colors: this.getGanttColors() }));
            return;
        }

        const width = options.viewport.width;
        const height = options.viewport.height;
        const categoricalDataView: DataViewCategorical = dataView.categorical;

        const tasks = this.transformDataToTasks(categoricalDataView);
        const colors = this.getGanttColors();
        
        this.reactRoot.render(React.createElement(CustomGanttChart, {
            tasks,
            width: options.viewport.width,
            height: options.viewport.height,
            colors
        }));
    }

    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open Properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}