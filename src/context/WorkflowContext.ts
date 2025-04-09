import { buildContext } from '@/lib/buildContext'

import { useCallback, useReducer } from 'react'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from '@xyflow/react'
import { v4 as uuidv4 } from 'uuid'
import { NodeType } from '@/types'

export interface WorkflowNode extends Node {
  data: {
    label: string
    type: NodeType
  }
}

type WorkflowState = {
  nodes: WorkflowNode[]
  edges: Edge[]
  selectedNodeId: string | null
}

type Action =
  | { type: 'SET_NODES'; payload: WorkflowNode[] }
  | { type: 'SET_EDGES'; payload: Edge[] }
  | { type: 'ADD_NODE'; payload: WorkflowNode }
  | {
      type: 'UPDATE_NODE'
      payload: { id: string; updates: Partial<WorkflowNode['data']> }
    }
  | { type: 'ADD_EDGE'; payload: Edge }
  | { type: 'SET_SELECTED_NODE'; payload: string | null }

export interface WorkflowNode extends Node {
  data: {
    label: string
    type: NodeType
  }
}

const initialNodes: WorkflowNode[] = [
  {
    id: '1',
    type: 'input',
    position: { x: 250, y: 0 },
    data: { label: 'Start Node', type: 'start' },
  },
  {
    id: '2',
    position: { x: 250, y: 150 },
    data: { label: 'Middle Node', type: 'middle' },
  },
  {
    id: '3',
    type: 'output',
    position: { x: 250, y: 300 },
    data: { label: 'End Node', type: 'end' },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
]

const initialState: WorkflowState = {
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
}

function reducer(state: WorkflowState, action: Action): WorkflowState {
  switch (action.type) {
    case 'SET_NODES':
      return { ...state, nodes: action.payload }
    case 'SET_EDGES':
      return { ...state, edges: action.payload }
    case 'ADD_NODE':
      return { ...state, nodes: [...state.nodes, action.payload] }
    case 'UPDATE_NODE':
      return {
        ...state,
        nodes: state.nodes.map((n) =>
          n.id === action.payload.id
            ? { ...n, data: { ...n.data, ...action.payload.updates } }
            : n,
        ),
      }
    case 'ADD_EDGE':
      return { ...state, edges: [...state.edges, action.payload] }
    case 'SET_SELECTED_NODE':
      return { ...state, selectedNodeId: action.payload }
    default:
      return state
  }
}

export const useWorkflow = () => {
  const [state, dispatch] = useReducer(
    reducer,
    {
      nodes: [],
      edges: [],
      selectedNodeId: null,
    },
    () => initialState,
  )

  const setNodes = useCallback(
    (changes: NodeChange[]) => {
      dispatch({
        type: 'SET_NODES',
        payload: applyNodeChanges(changes, state.nodes) as WorkflowNode[],
      })
    },
    [state.nodes],
  )

  const setEdges = useCallback(
    (changes: EdgeChange[]) => {
      dispatch({
        type: 'SET_EDGES',
        payload: applyEdgeChanges(changes, state.edges),
      })
    },
    [state.edges],
  )

  const connectEdge = useCallback(
    (connection: Connection) => {
      dispatch({
        type: 'SET_EDGES',
        payload: addEdge(connection, state.edges),
      })
    },
    [state.edges],
  )

  const addNode = useCallback((type: NodeType, label: string) => {
    const newNode: WorkflowNode = {
      id: uuidv4(),
      position: { x: 100, y: 100 },
      data: { label, type },
    }
    dispatch({ type: 'ADD_NODE', payload: newNode })
  }, [])

  const updateNode = useCallback((id: string, updates: Partial<WorkflowNode['data']>) => {
    dispatch({ type: 'UPDATE_NODE', payload: { id, updates } })
  }, [])

  const selectNode = useCallback((id: string | null) => {
    dispatch({ type: 'SET_SELECTED_NODE', payload: id })
  }, [])

  return {
    nodes: state.nodes,
    edges: state.edges,
    selectedNodeId: state.selectedNodeId,

    setNodes,
    setEdges,
    connectEdge,
    addNode,
    updateNode,
    selectNode,
  }
}

export const { ContextProvider: WorkflowProvider, useContext: useWorkflowContext } =
  buildContext(useWorkflow)
