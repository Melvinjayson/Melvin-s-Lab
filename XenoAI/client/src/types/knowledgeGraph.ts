/**
 * Knowledge graph node interface
 */
export interface KnowledgeNode {
  id: number;
  title: string;
  content: string;
  category?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Knowledge graph edge interface
 */
export interface KnowledgeEdge {
  id: number;
  sourceId: number;
  targetId: number;
  relationshipType: string;
  weight: number;
  createdAt: Date | string;
}

/**
 * Knowledge graph interface
 */
export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

/**
 * Node connection interface
 */
export interface NodeConnection {
  edge: KnowledgeEdge;
  sourceTitle: string;
  sourceCategory: string;
  targetTitle: string;
  targetCategory: string;
}

/**
 * Node with connections interface
 */
export interface NodeWithConnections {
  node: KnowledgeNode;
  connections: NodeConnection[];
}

/**
 * Knowledge graph search result interface
 */
export interface KnowledgeGraphSearchResult {
  results: KnowledgeNode[];
  count: number;
}

/**
 * D3 force-directed graph node interface
 */
export interface D3Node extends KnowledgeNode {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  radius?: number;
  color?: string;
}

/**
 * D3 force-directed graph link interface
 */
export interface D3Link extends KnowledgeEdge {
  source: D3Node | number;
  target: D3Node | number;
  value?: number;
}

/**
 * D3 force-directed graph interface
 */
export interface D3Graph {
  nodes: D3Node[];
  links: D3Link[];
}