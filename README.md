# Task Manager

A Kanban-style task management app built with React, MUI, and Vite. Tasks are organized across columns (To Do, In Progress, Done), with support for multiple image attachments, favorites, deadlines, and i18n.

---

## Features

- **Kanban Board** — multiple columns with individual task counts
- **Add / Edit / Delete Tasks** — name, description, deadline, and image attachments
- **Multiple Image Attachments** — attach multiple JPEG, PNG, GIF, or WebP images (max 5 MB each) per task; preview thumbnails with per-image remove; click any thumbnail to open a full-screen lightbox
- **Favorite Tasks** — mark tasks as favorites; sort column pins favorites to the top
- **Move Tasks** — move a task between columns from the card or update status directly on the task detail page
- **Add Columns** — create custom columns on the fly
- **Task Detail Page** — click any task card to open the full detail view at `/task/:id`; update status (column), view all images in a grid, open any image in a lightbox
- **Internationalization** — English and Spanish via i18next (toggle on the board)
- **Accessibility** — skip-to-content link, ARIA labels, keyboard-navigable dialogs
- **Error Boundary** — catches render errors and shows a fallback UI
- **Security** — XSS sanitization on all text inputs (OWASP A03), file MIME/size validation (OWASP A03/A08), structured security logging (OWASP A09)

---

## Tech Stack

| Layer | Library |
|---|---|
| UI framework | React 18 |
| Component library | MUI v5 (Material UI) |
| Routing | React Router v6 |
| State management | React Context + `useReducer` |
| i18n | i18next + react-i18next |
| Build tool | Vite 5 |
| Testing | Jest + React Testing Library |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or Yarn

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## Testing

```bash
# Run all tests with coverage
npm test

# Watch mode
npm run test:watch
```

Test files live alongside the components they test (`*.test.jsx`).

---

## Project Structure

```
src/
├── components/
│   ├── Board/           # Main board with columns
│   ├── Column/          # Single column with task list
│   ├── TaskCard/        # Clickable task card (navigates to detail on click)
│   ├── TaskDialog/      # Add/edit task modal with multi-image upload
│   ├── ImageLightbox/   # Full-screen image viewer dialog
│   ├── ErrorBoundary/   # Top-level error boundary
│   └── SkipLink/        # Accessibility skip-to-content link
├── context/
│   └── BoardContext.jsx   # Global state (useReducer) + actions
├── pages/
│   └── TaskDetail/      # Task detail page (/task/:id) with status selector
├── i18n/
│   ├── en.json          # English strings
│   ├── es.json          # Spanish strings
│   └── index.js         # i18next configuration
├── utils/
│   └── security.js      # Input sanitization, file validation, security logging
└── App.jsx              # Root: theme, routing, providers
```

---

## Security Notes

- All user-supplied text is stripped of HTML/script tags before entering the state tree.
- Uploaded files are validated by MIME type and size on the client; a real backend must re-validate the binary signature.
- Security events (e.g. invalid file upload attempts) are logged via `logSecurityEvent` — replace the `console.warn` call with your monitoring service (Sentry, Datadog, etc.) for production use.

---
