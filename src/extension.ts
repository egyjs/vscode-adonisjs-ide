// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import HoverProvider from './providers/hoverProvider';
import LinkProvider from './providers/linkProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	console.log('Congratulations, your extension "adonisjs-ide" is now active!');

	let hover = vscode.languages.registerHoverProvider(['typescript','edge'], new HoverProvider());
    let link = vscode.languages.registerDocumentLinkProvider(['typescript', 'edge'], new LinkProvider());

    context.subscriptions.push(hover, link);
}

// this method is called when your extension is deactivated
export function deactivate() {}
