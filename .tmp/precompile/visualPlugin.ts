import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var powerBIcustomGantt7E945E7A04FA4B4CAC872539F0435A13_DEBUG: IVisualPlugin = {
    name: 'powerBIcustomGantt7E945E7A04FA4B4CAC872539F0435A13_DEBUG',
    displayName: 'PowerBIcustomGantt',
    class: 'Visual',
    apiVersion: '5.3.0',
    create: (options?: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = (<any>globalThis).dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["powerBIcustomGantt7E945E7A04FA4B4CAC872539F0435A13_DEBUG"] = powerBIcustomGantt7E945E7A04FA4B4CAC872539F0435A13_DEBUG;
}
export default powerBIcustomGantt7E945E7A04FA4B4CAC872539F0435A13_DEBUG;