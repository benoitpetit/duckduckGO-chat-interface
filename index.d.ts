export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ToolChoice {
  NewsSearch: boolean;
  VideosSearch: boolean;
  LocalSearch: boolean;
  WeatherForecast: boolean;
}

export interface Metadata {
  toolChoice: ToolChoice;
}

export interface ChatPayload {
  model: string;
  metadata: Metadata;
  messages: Message[];
  canUseTools: boolean;
}

export declare const Models: {
  readonly GPT4Mini: 'gpt-4o-mini';
  readonly Claude3: 'claude-3-haiku-20240307';
  readonly Llama: 'meta-llama/Llama-3.3-70B-Instruct-Turbo';
  readonly Mixtral: 'mistralai/Mistral-Small-24B-Instruct-2501';
  readonly O4Mini: 'o4-mini';
};

export declare class DuckDuckGoChat {
  constructor(model?: string);
  
  /**
   * Initialise la session de chat
   */
  initialize(): Promise<DuckDuckGoChat>;
  
  /**
   * Envoie un message et retourne la réponse complète
   */
  sendMessage(content: string): Promise<string>;
  
  /**
   * Envoie un message et retourne un stream avec callback
   */
  sendMessageStream(content: string, onChunk?: (chunk: string) => void): Promise<string>;
  
  /**
   * Efface l'historique de la conversation
   */
  clear(): Promise<void>;
  
  /**
   * Change le modèle utilisé
   */
  setModel(model: string): void;
  
  /**
   * Obtient l'historique des messages
   */
  getHistory(): Message[];
  
  /**
   * Obtient les modèles disponibles
   */
  static getAvailableModels(): string[];
}

export default DuckDuckGoChat;
