<div align="center">

# 🏗️ Template Builder X

**Stop clicking "New Folder". Describe your project once in YAML, scaffold it forever.**

A tiny VS Code extension that turns a YAML file into real directories and files — right-click, pick a template, done.

![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.80.0-007ACC?logo=visualstudiocode&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Version](https://img.shields.io/badge/version-0.0.1-orange)

</div>

---

## ✨ Why?

Every new feature, module or micro-service starts the same way: the same folders, the same boilerplate files, the same five minutes of copy-paste. Template Builder X lets you write that structure **once**, as a readable YAML tree, and stamp it out anywhere in your workspace in two clicks.

- 📁 **Folders and files from YAML** — nest as deep as you like
- 📝 **Inline file content** — ship boilerplate code, not just empty files
- 🖱️ **Right-click from the Explorer** — generates exactly where you clicked
- 📚 **Your own template library** — point the extension at a folder and pick from a list
- ⚡ **API module generator** — one name in, a full `api / constants / data / service / router` module out

---

## 🚀 Commands

All commands live in the **Explorer context menu** (right-click a folder → *Generate*) and in the **Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`).

| Command | What it does |
|---|---|
| **Generate Default Template** | Pick one of the built-in templates and generate it in the selected folder. |
| **Generate Scratch Template** | Generate from *your* YAML — either from your configured template folder (quick pick) or by typing the path to any `.yaml` file. |
| **Generate Api Folders** | Asks for a name `x` and creates a ready-to-fill module:<br>`x/x.api.ts`, `x.constants.ts`, `x.data.ts`, `x.service.ts`, `x.router.ts` |

> 💡 Launched from the Command Palette instead of the Explorer? You'll be asked for the destination path (pre-filled with your workspace root).

### Built-in templates

| Template | Generates |
|---|---|
| `dart.feature` | A Dart project skeleton: `src/`, `lib/`, `assets/` and `test/` |
| `ts.library` | A minimal TypeScript library with `package.json`, `tsconfig.json`, source and test folders |

Want more built-ins? Drop a `.yaml` file into [`templates/`](templates).

---

## 🧩 Writing a template

A template is a YAML list of nodes. Each node has a `name`, a `type` (`directory` or `file`), and optionally `children` (for directories) or `content` (for files).

```yaml
- name: my_feature
  type: directory
  children:
    - name: lib
      type: directory
      children:
        - name: my_feature.dart
          type: file
          content: |
            class MyFeature {
              // TODO: build something great
            }
    - name: assets
      type: directory
      children:
        - name: images
          type: directory
    - name: test
      type: directory
      children:
        - name: my_feature_test.dart
          type: file
```

Right-click a folder → **Generate Scratch Template** → pick it, and you get:

```
my_feature/
├── lib/
│   └── my_feature.dart
├── assets/
│   └── images/
└── test/
    └── my_feature_test.dart
```

| Key | Applies to | Description |
|---|---|---|
| `name` | both | Folder or file name |
| `type` | both | `directory` or `file` |
| `children` | `directory` | List of nested nodes |
| `content` | `file` | File body (use `|` for multi-line). Omit it for an empty file. |

> ⚠️ Existing files with the same name are **overwritten**. Generate into a clean spot.

---

## ⚙️ Configuration

Keep all your templates in one folder and let the extension list them for you:

```jsonc
// settings.json
{
  "templateBuilder.templateFolderPath": "C:/Users/me/templates"
}
```

When set, **Generate Scratch Template** shows a quick pick with every template in that folder (file names without extension). Template files must use the `.yaml` extension.

When empty (the default), you'll be prompted for the full path of a YAML file instead.

---

## 🛠️ Run it from source

```bash
git clone https://github.com/CesareIsHere/vscode-template-builder-x.git
cd vscode-template-builder-x
npm install
npm run compile
```

Then open the folder in VS Code and press **F5** to launch an Extension Development Host with Template Builder X loaded.

Useful scripts:

| Script | Purpose |
|---|---|
| `npm run watch` | Rebuild on save (webpack) |
| `npm run lint` | ESLint over `src/` |
| `npm test` | Compile and run the extension tests |

Build an installable `.vsix`:

```bash
npx @vscode/vsce package
```

---

## 🗺️ Roadmap ideas

- Variables in templates (e.g. `{{name}}`) for file names and content
- Configurable file list for the API generator

Got an idea? [Open an issue](https://github.com/CesareIsHere/vscode-template-builder-x/issues) — PRs are welcome!

---

## 📄 License

[MIT](LICENSE)

---

<div align="center">

Made with ☕ by [CesareIsHere](https://github.com/CesareIsHere)

</div>
