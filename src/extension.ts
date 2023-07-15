import * as vscode from 'vscode';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	let scratchTemplateDisposable = vscode.commands.registerCommand('extension.generateScratchTemplate', async (uri: vscode.Uri) => {
	  try {
		var activeFolder;
		var outputPath;
		if(!uri) {
		 	activeFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
			outputPath = await vscode.window.showInputBox({ prompt: 'Destinazione cartelle generate:', value: activeFolder });
		} else {
			outputPath = uri.fsPath;
		}

		if (!outputPath) return;

		const yamlFilePath = await vscode.window.showInputBox({ prompt: 'Percorso del template(yaml):', value: activeFolder});
		if (!yamlFilePath) return;
  
		
		
  
		generateTemplateFromYaml(yamlFilePath, outputPath);
	  } catch (error) {
		vscode.window.showErrorMessage(`Failed to generate template: ${error}`);
	  }
	});
  
	context.subscriptions.push(scratchTemplateDisposable);

	let defaultTemplateDisposable = vscode.commands.registerCommand('extension.generateDefaultTemplate', async (uri: vscode.Uri) => {
		try {
			var activeFolder;
		var outputPath;
		if(!uri) {
		 	activeFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
			outputPath = await vscode.window.showInputBox({ prompt: 'Destinazione cartelle generate:', value: activeFolder });
		} else {
			outputPath = uri.fsPath;
		}

		if (!outputPath) return;
	
		  generateDefaultTemplate(context, outputPath);
		} catch (error) {
		  vscode.window.showErrorMessage(`Failed to generate default template: ${error}`);
		}
	  });
	
	  context.subscriptions.push(defaultTemplateDisposable);

	  


  }

function generateTemplateFromYaml(yamlFilePath: string, outputPath: string) {
  const fileContent = fs.readFileSync(yamlFilePath, 'utf-8');
  const yamlData = yaml.load(fileContent);

  generateFromYamlData(yamlData, outputPath);
}

function generateFromYamlData(yamlData: any, currentPath: string) {
  if (Array.isArray(yamlData)) {
    for (const item of yamlData) {
      generateFromYamlData(item, currentPath);
    }
  } else if (typeof yamlData === 'object' && yamlData !== null) {
    const name = yamlData['name'];
    const type = yamlData['type'];
    const children = yamlData['children'];

    const newPath = `${currentPath}/${name}`;

    if (type === 'directory') {
      fs.mkdirSync(newPath, { recursive: true });
      if (children) {
        generateFromYamlData(children, newPath);
      }
    } else if (type === 'file') {
      const content = yamlData['content'];
      const filePath = `${newPath}`;
      fs.writeFileSync(filePath, content || '');
    }
  }
}

function generateDefaultTemplate(context: vscode.ExtensionContext, outputPath: string) {
	const templateList = getTemplateList(context);

	vscode.window.showQuickPick(templateList, { placeHolder: 'Select a template' }).then((selectedTemplate) => {
		if (selectedTemplate) {
			const yamlFilePath = path.join(__dirname, '..', 'src/templates', `${selectedTemplate}.yaml`);
			generateTemplateFromYaml(yamlFilePath, outputPath);
		}
	});
	vscode.window.showInformationMessage('Default template generated successfully!');
  }

  function getTemplateList(context: vscode.ExtensionContext): string[] {
	const templateDir = getTemplatesFolderPath(context);
	const templateFiles = fs.readdirSync(templateDir);
	return templateFiles.map((file) => path.parse(file).name);
  }

  function getTemplatesFolderPath(context: vscode.ExtensionContext): string {
	const templatesFolderPath = path.join(context.extensionPath, 'src/templates');
	return vscode.Uri.file(templatesFolderPath).fsPath;
  }