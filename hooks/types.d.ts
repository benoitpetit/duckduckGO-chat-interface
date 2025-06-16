import { Ref } from 'vue';

// Types pour les modèles (copie locale pour éviter la dépendance Node.js)
export declare const Models: {
  readonly GPT4Mini: 'gpt-4o-mini';
  readonly Claude3: 'claude-3-haiku-20240307';
  readonly Llama: 'meta-llama/Llama-3.3-70B-Instruct-Turbo';
  readonly Mixtral: 'mistralai/Mistral-Small-24B-Instruct-2501';
  readonly O4Mini: 'o4-mini';
};

// Types pour les messages
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Types pour les messages étendus avec métadonnées
export interface ExtendedMessage extends Message {
  id?: number | string;
  timestamp?: number;
}

// Types pour l'état de chat
export interface ChatState {
  messages: ExtendedMessage[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  currentModel: string;
  streamingMessage: string;
  isStreaming: boolean;
}

// Types pour les méthodes de chat
export interface ChatMethods {
  sendMessage: (content: string) => Promise<string>;
  sendMessageStream: (content: string) => Promise<string>;
  clearChat: () => Promise<void>;
  changeModel: (model: string) => void;
  cancelRequest: () => void;
  initialize: () => Promise<void>;
}

// Types pour les utilitaires
export interface ChatUtilities {
  availableModels: typeof Models;
  messageCount: number;
  lastMessage: ExtendedMessage | null;
}

// Interface complète pour le hook React
export interface UseDuckDuckGoChatReturn extends ChatState, ChatMethods, ChatUtilities {}

// Interface pour le hook simple React
export interface UseSimpleDuckChatReturn {
  response: string;
  isLoading: boolean;
  error: string | null;
  askQuestion: (question: string) => Promise<string>;
}

// Types Vue.js avec Ref
export interface VueChatState {
  messages: Ref<ExtendedMessage[]>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  isInitialized: Ref<boolean>;
  currentModel: Ref<string>;
  streamingMessage: Ref<string>;
  isStreaming: Ref<boolean>;
}

export interface VueChatComputed {
  messageCount: Ref<number>;
  lastMessage: Ref<ExtendedMessage | null>;
  canSendMessage: Ref<boolean>;
}

export interface VueChatMethods {
  sendMessage: (content: string) => Promise<string>;
  sendMessageStream: (content: string) => Promise<string>;
  clearChat: () => Promise<void>;
  changeModel: (model: string) => void;
  removeMessage: (messageId: number | string) => void;
  cancelRequest: () => void;
  initialize: () => Promise<void>;
}

export interface VueChatUtilities {
  availableModels: typeof Models;
}

// Interface complète pour le composable Vue
export interface UseDuckDuckGoChatVueReturn 
  extends VueChatState, 
          VueChatComputed, 
          VueChatMethods, 
          VueChatUtilities {}

// Interface pour le composable simple Vue
export interface UseSimpleDuckChatVueReturn {
  response: Ref<string>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  askQuestion: (question: string) => Promise<string>;
  clearResponse: () => void;
}

// Interface pour le composable persistant Vue
export interface UsePersistentDuckChatReturn extends UseDuckDuckGoChatVueReturn {
  loadHistory: () => void;
  saveHistory: () => void;
  clearHistory: () => void;
}

// Déclarations des hooks React
export declare function useDuckDuckGoChat(
  initialModel?: string
): UseDuckDuckGoChatReturn;

export declare function useSimpleDuckChat(
  model?: string
): UseSimpleDuckChatReturn;

// Déclarations des composables Vue
export declare function useDuckDuckGoChat(
  initialModel?: string
): UseDuckDuckGoChatVueReturn;

export declare function useSimpleDuckChat(
  model?: string
): UseSimpleDuckChatVueReturn;

export declare function usePersistentDuckChat(
  storageKey?: string,
  initialModel?: string
): UsePersistentDuckChatReturn;

// Déclaration de la classe browser-compatible
export declare class BrowserDuckDuckGoChat {
  constructor(model?: string);
  
  /**
   * Initialise la session de chat
   */
  initialize(): Promise<BrowserDuckDuckGoChat>;
  
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

// Fonctions utilitaires browser
export declare function getVQD(): Promise<string | null>;

export declare function sendChatMessage(
  content: string,
  model?: string,
  messages?: Message[],
  vqd?: string | null,
  onChunk?: (chunk: string) => void
): Promise<{ response: string; vqd: string }>;

export default useDuckDuckGoChat; 