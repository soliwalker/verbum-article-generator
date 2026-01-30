
export enum SearchIntent {
  INFORMATIVO = 'Informativo',
  DEVOZIONALE = 'Devozionale',
  TRANSAZIONALE = 'Transazionale'
}

export interface GenerationInput {
  keyword: string;
  theme: string;
  intent: SearchIntent;
}

export interface GeneratedContent {
  id: string;
  title: string;
  markdown: string;
  timestamp: number;
}
