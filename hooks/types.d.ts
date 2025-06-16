import { Ref } from 'vue';
import { Models, Message } from '../index.d.ts';

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

export default useDuckDuckGoChat; 