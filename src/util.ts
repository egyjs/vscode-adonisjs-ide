'use strict';

import { workspace, TextDocument, Uri, ExtensionContext, WorkspaceConfiguration } from 'vscode';
import * as fs from "fs";
import * as path from "path";

export function getFilePath(text: string, document: TextDocument, type:string = "controller") {
    let paths = getFilePaths(text, document, type);
    return paths.length > 0 ? paths[0] : null;
}

export function getFilePaths(text: string, document: TextDocument, type:string = "controller") {
    
    let workspaceFolder = workspace.getWorkspaceFolder(document.uri)?.uri.fsPath || '';
    let config = workspace.getConfiguration('_goto');
    let typeConfig;
    let file;
    if(type === "controller"){
        typeConfig = config.controller;
        file = text.split('.');
    }else //if(type === "view")
    {
        typeConfig = config.view;
        file = text.replace(/\"|\'/g, '').replace('x-', 'components.').replace('livewire:', 'livewire.').replace(/\./g, '/').split('::');
    }
    
    let paths = scanViewPaths(workspaceFolder, typeConfig);
    let result = [];

    


    for (let item in paths) {
        let showPath = paths[item] + `/${file[0]}`;

        if (file.length > 1 && type === 'view') {
            if (item !== file[0]) {
                console.log(`${item} !== ${file[0]}`);
                continue;
            } else {
                showPath = paths[item] + `/${file[1]}`;
            }
        }
        for (let extension of config.extensions) {
            let filePath = workspaceFolder + showPath + extension;
        
            
            if (fs.existsSync(filePath)) {
            // if (true) {
                result.push({
                    "name": item,
                    "showPath": showPath + extension,
                    "fileUri": Uri.from({
                        scheme: 'file',
                        path: filePath ,
                        query: '?line=' + + Math.random(),
                        fragment: 'line=' + Math.random(),
                    })
                });
            }
        }
    }

    return result;
}

function scanViewPaths(workspaceFolder: string, config: WorkspaceConfiguration) {    
    let folders = Object.assign({}, config.folders);
       
    // vendor
    let vendorPath = path.join(workspaceFolder, 'resources/views/vendor');
    if (fs.existsSync(vendorPath)) {
        fs.readdirSync(vendorPath).forEach(element => {
            let file = path.join(vendorPath, element);
            if (fs.statSync(file).isDirectory()) {
                folders[element.toLocaleLowerCase()] = "/resources/views/vendor/" + element;
            }
        });
    }

    // layouts
    let layoutsPath = path.join(workspaceFolder, 'resources/views/layouts');
    if (fs.existsSync(layoutsPath)) {
        fs.readdirSync(layoutsPath).forEach(element => {
            let file = path.join(layoutsPath, element);
            if (fs.statSync(file).isDirectory()) {
                folders[element.toLocaleLowerCase()] = "/resources/views/layouts/" + element;
            }
        });
    }

    
    return folders;
}
