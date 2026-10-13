# Prabhav Gomase Portfolio

A responsive portfolio for Prabhav Gomase, a Computer Science and Engineering student specializing in AI & ML at VIT Vellore. Built with HTML, CSS, and JavaScript, with no build step or package installation required.

## Features

- Dark and light themes with a saved preference
- Project filters and accessible project-detail dialogs
- Quick navigation with Ctrl+K or Command+K, arrow keys, and Enter
- Interactive RegexLab preview with regex compilation, a minimized DFA diagram, tokens, and animated string matching
- Sorting playground featuring Bubble, Selection, Insertion, Merge, and Quick Sort
- Adjustable array size and speed, pause/resume, and live comparison and write counts
- Responsive navigation, reading progress, reveal animations, reduced-motion support, and print styles
- Downloadable résumé, email contact, and GitHub and LinkedIn links

## Projects

- [Campus Repair Café](https://github.com/PrabhavGomase/campus-repair-cafe) — Django and PostgreSQL application for campus repairs, volunteer coordination, and spare-part inventory
- [RegexLab](https://github.com/PrabhavGomase/regex-to-dfa-compiler) — completed C++ regex-to-DFA compiler pipeline with DFA minimization
- [Weather Dashboard, Task Manager, and Sorting Visualizer](https://github.com/PrabhavGomase/Web-Dev-Projects) — web development projects

Campus Repair Café and the smaller project-card illustrations are visual concepts rather than screenshots of deployed applications. RegexLab includes an independent JavaScript browser demo supporting literals, concatenation, alternation, grouping, escapes, and the `*`, `+`, and `?` operators. This demo does not call the C++ repository. Expressions are limited to 64 characters and 64 DFA states to keep the preview responsive. The embedded sorting playground is an independent portfolio interaction inspired by the Sorting Visualizer project.

## Local preview

Serve the repository root using a static web server. For example, with Python installed:

```text
python -m http.server 8000
```

Open http://localhost:8000. You can also open `index.html` directly, although clipboard support varies by browser.

## Editing

| File | Purpose |
| --- | --- |
| `index.html` | Page content and project cards |
| `styles.css` | Colors, typography, layout, and responsive styles |
| `app.js` | Project details, navigation, themes, and sorting interactions |
| `regex-engine.js` | Browser demo: parsing, Thompson NFA, DFA construction, minimization, and matching |
| `regex-ui.js` | RegexLab preview controls, diagrams, tokens, and animated traces |
| `regex-ui.css` | Interactive compiler studio styling |
| `assets/Prabhav_Gomase_Resume.docx` | Downloadable résumé |
| `assets/favicon.svg` | Browser icon |

Google Fonts enhance the typography when available; system fonts provide a fallback. The website requires no API keys or server environment variables.

## Static hosting

Publish the repository root on a static host. The files are also ready for GitHub Pages using the `main` branch and `/ (root)` source. All asset paths are relative, allowing the portfolio to work under a repository subpath. The `.nojekyll` file tells GitHub Pages to serve the files as-is.
