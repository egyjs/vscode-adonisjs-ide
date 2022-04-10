'use strict';

import {
    DocumentLinkProvider as vsDocumentLinkProvider,
    TextDocument,
    ProviderResult,
    DocumentLink,
    workspace,
    Position,
    Range
} from "vscode";

import * as util from '../util';

export default class LinkProvider implements vsDocumentLinkProvider {
    public provideDocumentLinks(doc: TextDocument): ProviderResult<DocumentLink[]> {
        let documentLinks = [];
        let config = workspace.getConfiguration('_goto');
        let viewConfig = config.view;
        let controllerConfig = config.controller;


        
        if (config.quickJump) {
            let viewReg = new RegExp(viewConfig.regex, 'g');
            let controllerReg = new RegExp(controllerConfig.regex, 'g');
            
            let linesCount = doc.lineCount <= config.maxLinesCount ? doc.lineCount : config.maxLinesCount;
            let index = 0;
            while (index < linesCount) {
                let line = doc.lineAt(index);
                let viewResult = line.text.match(viewReg);
                let controllerResult = line.text.match(controllerReg);

                if (viewResult !== null || controllerResult !== null) {
                    let result = viewResult !== null ? viewResult : controllerResult;
                    if(result !== null){ // this if is just for eslint
                        for (let item of result) {
                            let file = util.getFilePath(item, doc, viewResult !== null ? "view" : "controller");
                            
                            if (file !== null) {
                                let start = new Position(line.lineNumber, line.text.indexOf(item));
                                let end = start.translate(0, item.length);
                                let documentlink = new DocumentLink(new Range(start, end), file.fileUri);
                                documentLinks.push(documentlink);
                            };
                        }
                    }
                }

                index++;
            }
        }

        return documentLinks;
    }
}
