
# Workflow Editor

A workflow diagram builder built with **Next.js**, **TypeScript**, **React Flow (@xyflow/react)**, and **Ant Design**. Users can create, edit, and connect nodes of three types: Start, Middle, and End — following a strict logical structure.

## 🚀 Live Demo

[Live demo is here](https://nextjs-flow-ant.vercel.app/)

---

## 🧠 Features

- Create nodes (Start, Middle, End) via modal
- Enforce directional flow: Start → Middle → End
- Enforce 1:1 connections (e.g. one Middle per Start)
- Visual editor powered by React Flow
- Editable nodes via drawer
- Smart handle rendering (Start only outputs, End only inputs, Middle both)
- Flow state managed by React Context + useReducer
- Typesafe throughout with TypeScript
- Unit tests with Vitest and Testing Library

---

## 📁 Project Structure

```txt
src/
├── components/
│   ├── WorkflowDiagram.tsx      # Main diagram UI
│   ├── CreateNodeModal.tsx      # Modal to create new node
│   ├── EditNodeDrawer.tsx       # Drawer to edit selected node
│   └── EditableNode.tsx         # Custom render logic for nodes
├── context/
│   └── WorkflowContext.tsx      # Flow state context using useReducer
├── constants/
│   └── index.ts                 # Enums for NodeType and NodeOrderType
├── lib/
│   └── buildContext.ts          # Generic hook/context builder
├── utils/
│   └── connectionRules.ts       # Edge connection validation logic
├── types/
│   └── index.ts                 # Custom shared types
├── pages/
│   └── index.tsx                # Next.js page with <WorkflowDiagram />
```


## ▶️ Scripts

```bash
# Start local development server with Turbopack
yarn dev

# Build production bundle
yarn build

# Start production server (after build)
yarn start

# Run ESLint
yarn lint

# Run unit tests with Vitest
yarn test
```

## Assumptions & Design Decisions

•  **Node types are enforced by logical order** (NodeOrderType) and mapped to flow roles (NodeType) for correct handle behavior

• **React Flow node type (type) is synced automatically** in reducer during updates

•  **Validation for connections** is split into two functions:

•  `checkIfConnectionOrderValid()` — ensures flow is Start → Middle → End

•  `checkIfConnectionNumberValid()` — ensures only one connection per rule

•  **Type change is allowed only before connections are made**, as changing it after could lead to invalid state or missing handles

•  **Custom node rendering** uses EditableNode, which shows handles based on NodeOrderType



## 🧰 Utilities

This project uses a custom [`buildContext`](https://gist.github.com/LeMark0/28c7c8d0edcafb76ea77f4a0948d88fc) utility to simplify the creation of reusable React Context + hook pairs.

Instead of repeating boilerplate, we declare context like this:

```ts
export const { ContextProvider: WorkflowProvider, useContext: useWorkflowContext } =
  buildContext(useWorkflow)
