# LLTC

## Installation

```bash
pnpm i
```

## Get Started

To start the development server, use:

```bash
pnpm run dev
```

Then, open http://localhost:5173/ in your browser. The database should be automatically generated (achieved by the `prepare` script).

## Tech Stack and libraries

- Frontend
  - React
  - Material UI
  - Tailwind.css
  - Vite.js
- Backend
  - Sqlite
  - Prisma
  - Express.js
- Architecture
  - Pnpm Workspaces with shared dependencies (types)

## Designs

To achieve the goals of this project, the database tables are designed as follows:

- user: Represents a party that places the settlement and a party that agrees or disputes the settlement.
- settlement: Represents a settlement placed by Party A.
  - status: 0 - Pending, 1 - Settled, -1 - Disputed
- record: Represents an offer from Party B. Each offer from Party B creates a new record.

## Notes

1. The database design for this system is bare-bone and straightforward.

2. Automatic data fetching for both Party A and Party B is achieved using `setInterval`. It can also be implemented using Server Push, Long Polling, or WebSockets. For simplicity, setInterval was chosen.

3. To distinguish party A and B, the UI part is rendered in different root, and the identity is hard coded as A and B.
