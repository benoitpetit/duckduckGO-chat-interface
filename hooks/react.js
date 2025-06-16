import { useState, useCallback, useRef, useEffect } from 'react';
import { BrowserDuckDuckGoChat, Models } from './browser.js';

/**
 * Hook React pour l'interface de chat DuckDuckGo
 * Fournit une interface réactive pour gérer les conversations avec l'API DuckDuckGo
 */
export function useDuckDuckGoChat(initialModel = Models.GPT4Mini) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentModel, setCurrentModel] = useState(initialModel);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const chatRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Initialisation du chat
  const initialize = useCallback(async () => {
    if (isInitialized) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      chatRef.current = new BrowserDuckDuckGoChat(currentModel);
      await chatRef.current.initialize();
      
      setIsInitialized(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentModel, isInitialized]);

  // Envoi d'un message simple
  const sendMessage = useCallback(async (content) => {
    if (!isInitialized || !chatRef.current) {
      await initialize();
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Ajouter le message utilisateur immédiatement
      const userMessage = { role: 'user', content, timestamp: Date.now() };
      setMessages(prev => [...prev, userMessage]);

      const response = await chatRef.current.sendMessage(content);
      
      // Ajouter la réponse de l'assistant
      const assistantMessage = { role: 'assistant', content: response, timestamp: Date.now() };
      setMessages(prev => [...prev, assistantMessage]);

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, initialize]);

  // Envoi d'un message avec streaming
  const sendMessageStream = useCallback(async (content) => {
    if (!isInitialized || !chatRef.current) {
      await initialize();
    }

    try {
      setIsLoading(true);
      setIsStreaming(true);
      setError(null);
      setStreamingMessage('');
      
      // Ajouter le message utilisateur immédiatement
      const userMessage = { role: 'user', content, timestamp: Date.now() };
      setMessages(prev => [...prev, userMessage]);

      const response = await chatRef.current.sendMessageStream(content, (chunk) => {
        setStreamingMessage(prev => prev + chunk);
      });
      
      // Ajouter la réponse complète de l'assistant
      const assistantMessage = { role: 'assistant', content: response, timestamp: Date.now() };
      setMessages(prev => [...prev, assistantMessage]);
      
      setStreamingMessage('');
      return response;
    } catch (err) {
      setError(err.message);
      setStreamingMessage('');
      throw err;
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [isInitialized, initialize]);

  // Effacer l'historique
  const clearChat = useCallback(async () => {
    try {
      if (chatRef.current) {
        await chatRef.current.clear();
      }
      setMessages([]);
      setStreamingMessage('');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Changer de modèle
  const changeModel = useCallback((newModel) => {
    setCurrentModel(newModel);
    if (chatRef.current) {
      chatRef.current.setModel(newModel);
    }
  }, []);

  // Annuler une requête en cours
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingMessage('');
    }
  }, []);

  // Nettoyage lors du démontage
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Auto-initialisation
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      initialize();
    }
  }, [initialize, isInitialized, isLoading]);

  return {
    // État
    messages,
    isLoading,
    error,
    isInitialized,
    currentModel,
    streamingMessage,
    isStreaming,
    
    // Méthodes
    sendMessage,
    sendMessageStream,
    clearChat,
    changeModel,
    cancelRequest,
    initialize,
    
    // Utilitaires
    availableModels: Models,
    messageCount: messages.length,
    lastMessage: messages[messages.length - 1] || null
  };
}

/**
 * Hook plus simple pour des cas d'usage basiques
 */
export function useSimpleDuckChat(model = Models.GPT4Mini) {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const chatRef = useRef(null);

  const askQuestion = useCallback(async (question) => {
    try {
      setIsLoading(true);
      setError(null);
      setResponse('');

      if (!chatRef.current) {
        chatRef.current = new BrowserDuckDuckGoChat(model);
        await chatRef.current.initialize();
      }

      const answer = await chatRef.current.sendMessage(question);
      setResponse(answer);
      return answer;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [model]);

  return {
    response,
    isLoading,
    error,
    askQuestion
  };
}

export default useDuckDuckGoChat; 