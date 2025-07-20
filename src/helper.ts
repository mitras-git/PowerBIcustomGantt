import powerbi from "powerbi-visuals-api";
import DataViewCategorical = powerbi.DataViewCategorical;

export enum DataRoleIndex {
    TaskName,
    TaskId,
    StartDate,
    EndDate,
    Dependencies,
    Progress
}

enum TaskRoles {
    taskName = "taskName",
    taskId = "taskId",
    startDate = "startDate",
    endDate = "endDate",
    dependencies = "dependencies",
    progress = "progress"
}

export function getDataRoleIndex(categoricalDataView: DataViewCategorical): DataRoleIndex[] {
    const roleIndices: number[] = [];
    for (let i = 0; i < categoricalDataView.categories.length; i++) {
        const role = Object.keys(categoricalDataView.categories[i].source.roles)[0];
        switch (role) {
            case TaskRoles.taskName:
                roleIndices[DataRoleIndex.TaskName] = i;
                break;
            case TaskRoles.taskId:
                roleIndices[DataRoleIndex.TaskId] = i;
                break;
            case TaskRoles.startDate:
                roleIndices[DataRoleIndex.StartDate] = i;
                break;
            case TaskRoles.endDate:
                roleIndices[DataRoleIndex.EndDate] = i;
                break;
            case TaskRoles.dependencies:
                roleIndices[DataRoleIndex.Dependencies] = i;
                break;
            case TaskRoles.progress:
                roleIndices[DataRoleIndex.Progress] = i;
                break;
        }
    }
    return roleIndices;
}