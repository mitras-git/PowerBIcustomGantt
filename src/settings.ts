/*
 *  Power BI Visualizations
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

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

/**
 * Gantt Colors Formatting Card
 */
class GanttColorsCardSettings extends FormattingSettingsCard {
    barProgress = new formattingSettings.ColorPicker({
        name: "barProgress",
        displayName: "Task Progress Color",
        value: { value: "#1f77b4" }
    });

    barSelected = new formattingSettings.ColorPicker({
        name: "barSelected",
        displayName: "Task Selected Color",
        value: { value: "#ff7f0e" }
    });

    projectProgress = new formattingSettings.ColorPicker({
        name: "projectProgress",
        displayName: "Project Progress Color",
        value: { value: "#2ca02c" }
    });

    projectSelected = new formattingSettings.ColorPicker({
        name: "projectSelected",
        displayName: "Project Selected Color",
        value: { value: "#d62728" }
    });

    milestone = new formattingSettings.ColorPicker({
        name: "milestone",
        displayName: "Milestone Color",
        value: { value: "#9467bd" }
    });

    milestoneSelected = new formattingSettings.ColorPicker({
        name: "milestoneSelected",
        displayName: "Milestone Selected Color",
        value: { value: "#8c564b" }
    });

    name: string = "ganttColors";
    displayName: string = "Gantt Colors";
    slices: Array<FormattingSettingsSlice> = [
        this.barProgress, 
        this.barSelected, 
        this.projectProgress, 
        this.projectSelected, 
        this.milestone, 
        this.milestoneSelected
    ];
}

/**
* visual settings model class
*
*/
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    // Create formatting settings model formatting cards
    ganttColorsCard = new GanttColorsCardSettings();

    cards = [this.ganttColorsCard];
}
