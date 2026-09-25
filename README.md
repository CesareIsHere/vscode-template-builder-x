# template-builder-x

`template-builder-x` is a Visual Studio Code extension that scaffolds folders and files from YAML templates, plus a quick API folder generator for TypeScript-style backend modules.

## Features

- Generate a project/file structure from built-in templates.
- Generate a structure from custom YAML templates.
- Generate an API folder with common starter files:
  - `<name>.api.ts`
  - `<name>.constants.ts`
  - `<name>.data.ts`
  - `<name>.service.ts`
  - `<name>.router.ts`
- Run commands directly from the Explorer context menu.

## Commands

- **Generate Default Template** (`extension.generateDefaultTemplate`)
- **Generate Scratch Template** (`extension.generateScratchTemplate`)
- **Generate Api Folders** (`extension.generateApiFolder`)

You can run these from:
- Command Palette (`Ctrl/Cmd + Shift + P`)
- Right-click in the Explorer

## Extension Settings

This extension contributes the following setting:

- `templateBuilder.templateFolderPath`: Absolute path to a folder containing your `.yaml` template files.

If this setting is provided, **Generate Scratch Template** will show available templates from that folder.

## YAML Template Format

Templates are arrays/trees of nodes with:

- `name`: file or folder name
- `type`: `directory` or `file`
- `children`: nested nodes (for directories)
- `content`: optional file content (for files)

Example:

```yaml
- name: project
  type: directory
  children:
    - name: src
      type: directory
      children:
        - name: main.ts
          type: file
          content: |
            console.log("Hello from template-builder-x");
```

## Installation

### From source

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build:
   ```bash
   npm run compile
   ```
4. Press `F5` in VS Code to launch an Extension Development Host.

## Development

Available scripts:

- `npm run compile` – bundle extension with webpack
- `npm run watch` – watch mode for development
- `npm run lint` – lint TypeScript sources
- `npm test` – run extension tests

## Release

To package for publishing:

```bash
npm run package
```

See `CHANGELOG.md` for release notes.
