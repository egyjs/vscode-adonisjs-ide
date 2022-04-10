'use strict';

import {
    HoverProvider as vsHoverProvider,
    TextDocument,
    Position,
    ProviderResult,
    Hover,
    workspace,
    MarkdownString,
    window,
} from "vscode";
import * as util from '../util';

export default class HoverProvider implements vsHoverProvider {
    provideHover(doc: TextDocument, pos: Position): ProviderResult<Hover> {        
        let config = workspace.getConfiguration('_goto');
        let viewConfig = config.view;
        let controllerConfig = config.controller;

        let viewReg = new RegExp(viewConfig.regex);
        let controllerReg = new RegExp(controllerConfig.regex);

        let viewlinkRange = doc.getWordRangeAtPosition(pos, viewReg);
        let controllerlinkRange = doc.getWordRangeAtPosition(pos, controllerReg);


        if (!viewlinkRange && !controllerlinkRange) {return;}

        let filePaths: any = {};



        filePaths = Object.assign(filePaths, util.getFilePaths(doc.getText(viewlinkRange), doc, "view"));
        filePaths = Object.assign(filePaths, util.getFilePaths(doc.getText(controllerlinkRange), doc, "controller"));

        

        let workspaceFolder = workspace.getWorkspaceFolder(doc.uri);
        
        
        if (Object.keys(filePaths).length > 0) {
            let text: string = "";

            for (let i in filePaths) {
                text += config.folderTip ? `\`${filePaths[i].name}\`` : '';
                text += `[${workspaceFolder?.name + filePaths[i].showPath}](${filePaths[i].fileUri})  \r`;
            }
            
            return new Hover(new MarkdownString(text));
        }
    }
}
