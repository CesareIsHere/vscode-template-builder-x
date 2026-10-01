import * as vscode from "vscode";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let scratchTemplateDisposable = vscode.commands.registerCommand(
    "extension.generateScratchTemplate",
    async (uri: vscode.Uri) => {
      try {
        var activeFolder;
        var outputPath;
        activeFolder = vscode.workspace.workspaceFolders
          ? vscode.workspace.workspaceFolders[0].uri.fsPath
          : "";
        if (!uri) {
          outputPath = await vscode.window.showInputBox({
            prompt: "Destination folder:",
            value: activeFolder,
          });
        } else {
          outputPath = uri.fsPath;
        }

        if (!outputPath) return;

        var yamlFilePath;

        // Use the configured template folder, if any
        var settingsTemplateFolderPath = vscode.workspace
          .getConfiguration("templateBuilder")
          .get<string>("templateFolderPath");
        if (settingsTemplateFolderPath) {
          const templateList = getTemplateList(
            context,
            settingsTemplateFolderPath
          );

          await vscode.window
            .showQuickPick(templateList, {
              placeHolder: "Select a template",
            })
            .then((selectedTemplate) => {
              if (selectedTemplate) {
                yamlFilePath = path.join(
                  settingsTemplateFolderPath!,
                  `${selectedTemplate}.yaml`
                );
              }
            });
        } else {
          yamlFilePath = await vscode.window.showInputBox({
            prompt: "Template file path (.yaml):",
            value: activeFolder,
          });
        }

        if (!yamlFilePath) return;

        generateTemplateFromYaml(yamlFilePath, outputPath);
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to generate template: ${error}`);
      }
    }
  );

  context.subscriptions.push(scratchTemplateDisposable);

  let defaultTemplateDisposable = vscode.commands.registerCommand(
    "extension.generateDefaultTemplate",
    async (uri: vscode.Uri) => {
      try {
        var activeFolder;
        var outputPath;
        if (!uri) {
          activeFolder = vscode.workspace.workspaceFolders
            ? vscode.workspace.workspaceFolders[0].uri.fsPath
            : "";
          outputPath = await vscode.window.showInputBox({
            prompt: "Destination folder:",
            value: activeFolder,
          });
        } else {
          outputPath = uri.fsPath;
        }

        if (!outputPath) return;

        generateDefaultTemplate(context, outputPath);
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to generate default template: ${error}`
        );
      }
    }
  );

  context.subscriptions.push(defaultTemplateDisposable);

  let templatePathConfigurationDisposable =
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("templateBuilder.templateFolderPath")) {
      }
    });

  context.subscriptions.push(templatePathConfigurationDisposable);

  // Create a command that generate a folder with three files: x (folder) -> x.api.ts, x.constants.ts, x.data.ts, x.service.ts, x.router.ts . The files are empty. Get in input the name (x).
  let generateFolderDisposable = vscode.commands.registerCommand(
    "extension.generateApiFolder",
    async (uri: vscode.Uri) => {
      try {
        var activeFolder;
        var outputPath;
        if (!uri) {
          activeFolder = vscode.workspace.workspaceFolders
            ? vscode.workspace.workspaceFolders[0].uri.fsPath
            : "";
          outputPath = await vscode.window.showInputBox({
            prompt: "Destination folder:",
            value: activeFolder,
          });
        } else {
          outputPath = uri.fsPath;
        }

        if (!outputPath) return;

        var folderName = await vscode.window.showInputBox({
          prompt: "Folder name:",
        });

        if (!folderName) return;

        var folderPath = path.join(outputPath, folderName);
        fs.mkdirSync(folderPath, { recursive: true });

        var files = [
          { name: `${folderName}.api.ts`, content: "" },
          { name: `${folderName}.constants.ts`, content: "" },
          { name: `${folderName}.data.ts`, content: "" },
          { name: `${folderName}.service.ts`, content: "" },
          { name: `${folderName}.router.ts`, content: "" },
        ];

        files.forEach((file) => {
          fs.writeFileSync(path.join(folderPath, file.name), file.content);
        });
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to generate folder: ${error}`);
      }
    }
  );

  context.subscriptions.push(generateFolderDisposable);
}

function generateTemplateFromYaml(yamlFilePath: string, outputPath: string) {
  const fileContent = fs.readFileSync(yamlFilePath, "utf-8");
  const yamlData = yaml.load(fileContent);

  generateFromYamlData(yamlData, outputPath);
}

function generateFromYamlData(yamlData: any, currentPath: string) {
  if (Array.isArray(yamlData)) {
    for (const item of yamlData) {
      generateFromYamlData(item, currentPath);
    }
  } else if (typeof yamlData === "object" && yamlData !== null) {
    const name = yamlData["name"];
    const type = yamlData["type"];
    const children = yamlData["children"];

    const newPath = `${currentPath}/${name}`;

    if (type === "directory") {
      fs.mkdirSync(newPath, { recursive: true });
      if (children) {
        generateFromYamlData(children, newPath);
      }
    } else if (type === "file") {
      const content = yamlData["content"];
      const filePath = `${newPath}`;
      fs.writeFileSync(filePath, content || "");
    }
  }
}

function generateDefaultTemplate(
  context: vscode.ExtensionContext,
  outputPath: string
) {
  const templatesFolderPath = getTemplatesFolderPath(context);
  const templateList = getTemplateList(context, templatesFolderPath);

  vscode.window
    .showQuickPick(templateList, { placeHolder: "Select a template" })
    .then((selectedTemplate) => {
      if (selectedTemplate) {
        const yamlFilePath = path.join(
          templatesFolderPath,
          `${selectedTemplate}.yaml`
        );
        generateTemplateFromYaml(yamlFilePath, outputPath);
        vscode.window.showInformationMessage(
          "Default template generated successfully!"
        );
      }
    });
}

function getTemplateList(
  context: vscode.ExtensionContext,
  templateDir: string
): string[] {
  const templateFiles = fs.readdirSync(templateDir);
  return templateFiles.map((file) => path.parse(file).name);
}

function getTemplatesFolderPath(context: vscode.ExtensionContext): string {
  const templatesFolderPath = path.join(context.extensionPath, "templates");
  return vscode.Uri.file(templatesFolderPath).fsPath;
}
