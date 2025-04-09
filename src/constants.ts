export enum NodeOrderType {
  Start = 'start',
  Middle = 'middle',
  End = 'end',
}

export enum NodeType {
  Input = 'input',
  Output = 'output',
}

export const typeOptions = Object.entries(NodeOrderType).map(([key, value]) => ({
  label: key,
  value,
}))
