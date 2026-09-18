# Eleva Portal — UI kit

Interactive recreation of the Eleva student portal, the primary product
surface in the Figma library. Built from the component masters in
`Button/`, `Inputs---ok/`, `Cards/`, `Header/`, `Modal/`, `Tag---ok/`,
`Toast---ok/`.

Open `index.html` to interact: search students, open a student card,
edit a field, see a toast.

Files:
- `index.html` — wires everything up
- `App.jsx` — top-level layout + routing between screens
- `Header.jsx` — app header with search + notifications + avatar
- `Sidebar.jsx` — primary navigation
- `StudentList.jsx` — searchable table of students
- `StudentCard.jsx` — expanded student record view
- `Modal.jsx` — generic modal shell used by edit flow
- `primitives.jsx` — Button, Input, Tag, Alert, Toast, Avatar
