import { ref, reactive, computed, onUnmounted, watch } from 'vue';
import { DuckDuckGoChat, Models } from '../index.js';

/**
 * Composable Vue.js pour l'interface de chat DuckDuckGo
 * Fournit une interface réactive pour gérer les conversations avec l'API DuckDuckGo
 */
export function useDuckDuckGoChat(initialModel = Models.GPT4Mini) {
  // État réactif
  const messages = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const isInitialized = ref(false);
  const currentModel = ref(initialModel);
  const streamingMessage = ref('');
  const isStreaming = ref(false);

  // Références internes
  let chatInstance = null;
  let abortController = null;

  // État calculé
  const messageCount = computed(() => messages.value.length);
  const lastMessage = computed(() => 
    messages.value.length > 0 ? messages.value[messages.value.length - 1] : null
  );
  const canSendMessage = computed(() => 
    isInitialized.value && !isLoading.value && !isStreaming.value
  );

  // Initialisation du chat
  const initialize = async () => {
    if (isInitialized.value) return;
    
    try {
      isLoading.value = true;
      error.value = null;
      
      chatInstance = new DuckDuckGoChat(currentModel.value);
      await chatInstance.initialize();
      
      isInitialized.value = true;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Envoi d'un message simple
  const sendMessage = async (content) => {
    if (!isInitialized.value || !chatInstance) {
      await initialize();
    }

    try {
      isLoading.value = true;
      error.value = null;
      
      // Ajouter le message utilisateur immédiatement
      const userMessage = { 
        role: 'user', 
        content, 
        timestamp: Date.now(),
        id: Date.now() + Math.random()
      };
      messages.value.push(userMessage);

      const response = await chatInstance.sendMessage(content);
      
      // Ajouter la réponse de l'assistant
      const assistantMessage = { 
        role: 'assistant', 
        content: response, 
        timestamp: Date.now(),
        id: Date.now() + Math.random()
      };
      messages.value.push(assistantMessage);

      return response;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Envoi d'un message avec streaming
  const sendMessageStream = async (content) => {
    if (!isInitialized.value || !chatInstance) {
      await initialize();
    }

    try {
      isLoading.value = true;
      isStreaming.value = true;
      error.value = null;
      streamingMessage.value = '';
      
      // Ajouter le message utilisateur immédiatement
      const userMessage = { 
        role: 'user', 
        content, 
        timestamp: Date.now(),
        id: Date.now() + Math.random()
      };
      messages.value.push(userMessage);

      const response = await chatInstance.sendMessageStream(content, (chunk) => {
        streamingMessage.value += chunk;
      });
      
      // Ajouter la réponse complète de l'assistant
      const assistantMessage = { 
        role: 'assistant', 
        content: response, 
        timestamp: Date.now(),
        id: Date.now() + Math.random()
      };
      messages.value.push(assistantMessage);
      
      streamingMessage.value = '';
      return response;
    } catch (err) {
      error.value = err.message;
      streamingMessage.value = '';
      throw err;
    } finally {
      isLoading.value = false;
      isStreaming.value = false;
    }
  };

  // Effacer l'historique
  const clearChat = async () => {
    try {
      if (chatInstance) {
        await chatInstance.clear();
      }
      messages.value = [];
      streamingMessage.value = '';
      error.value = null;
    } catch (err) {
      error.value = err.message;
    }
  };

  // Changer de modèle
  const changeModel = (newModel) => {
    currentModel.value = newModel;
    if (chatInstance) {
      chatInstance.setModel(newModel);
    }
  };

  // Supprimer un message
  const removeMessage = (messageId) => {
    const index = messages.value.findIndex(msg => msg.id === messageId);
    if (index > -1) {
      messages.value.splice(index, 1);
    }
  };

  // Annuler une requête en cours
  const cancelRequest = () => {
    if (abortController) {
      abortController.abort();
      isLoading.value = false;
      isStreaming.value = false;
      streamingMessage.value = '';
    }
  };

  // Observer les changements de modèle pour réinitialiser si nécessaire
  watch(currentModel, (newModel) => {
    if (chatInstance) {
      chatInstance.setModel(newModel);
    }
  });

  // Nettoyage lors de la destruction du composable
  onUnmounted(() => {
    if (abortController) {
      abortController.abort();
    }
  });

  // Auto-initialisation
  if (!isInitialized.value && !isLoading.value) {
    initialize().catch(err => {
      error.value = err.message;
    });
  }

  return {
    // État (refs)
    messages,
    isLoading,
    error,
    isInitialized,
    currentModel,
    streamingMessage,
    isStreaming,
    
    // État calculé
    messageCount,
    lastMessage,
    canSendMessage,
    
    // Méthodes
    sendMessage,
    sendMessageStream,
    clearChat,
    changeModel,
    removeMessage,
    cancelRequest,
    initialize,
    
    // Utilitaires
    availableModels: Models
  };
}

/**
 * Composable plus simple pour des cas d'usage basiques
 */
export function useSimpleDuckChat(model = Models.GPT4Mini) {
  const response = ref('');
  const isLoading = ref(false);
  const error = ref(null);

  let chatInstance = null;

  const askQuestion = async (question) => {
    try {
      isLoading.value = true;
      error.value = null;
      response.value = '';

      if (!chatInstance) {
        chatInstance = new DuckDuckGoChat(model);
        await chatInstance.initialize();
      }

      const answer = await chatInstance.sendMessage(question);
      response.value = answer;
      return answer;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const clearResponse = () => {
    response.value = '';
    error.value = null;
  };

  return {
    response,
    isLoading,
    error,
    askQuestion,
    clearResponse
  };
}

/**
 * Composable pour une conversation avec historique persistant (localStorage)
 */
export function usePersistentDuckChat(storageKey = 'duckduckgo-chat', initialModel = Models.GPT4Mini) {
  const chat = useDuckDuckGoChat(initialModel);

  // Charger l'historique depuis localStorage
  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const history = JSON.parse(stored);
        chat.messages.value = history;
      }
    } catch (err) {
      console.warn('Erreur lors du chargement de l\'historique:', err);
    }
  };

  // Sauvegarder l'historique dans localStorage
  const saveHistory = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(chat.messages.value));
    } catch (err) {
      console.warn('Erreur lors de la sauvegarde de l\'historique:', err);
    }
  };

  // Observer les changements de messages pour auto-sauvegarder
  watch(chat.messages, saveHistory, { deep: true });

  // Charger l'historique au montage
  loadHistory();

  return {
    ...chat,
    loadHistory,
    saveHistory,
    clearHistory: () => {
      chat.clearChat();
      localStorage.removeItem(storageKey);
    }
  };
}

export default useDuckDuckGoChat; 