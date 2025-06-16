<template>
  <div class="app">
    <!-- Navigation par onglets -->
    <nav class="tabs">
      <button 
        :class="{ active: activeTab === 'chat' }"
        @click="activeTab = 'chat'"
      >
        Chat Complet
      </button>
      <button 
        :class="{ active: activeTab === 'simple' }"
        @click="activeTab = 'simple'"
      >
        Chat Simple
      </button>
      <button 
        :class="{ active: activeTab === 'persistent' }"
        @click="activeTab = 'persistent'"
      >
        Chat Persistant
      </button>
    </nav>

    <!-- Contenu des onglets -->
    <div class="content">
      <ChatInterface v-if="activeTab === 'chat'" />
      <SimpleChat v-if="activeTab === 'simple'" />
      <PersistentChat v-if="activeTab === 'persistent'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDuckDuckGoChat, useSimpleDuckChat, usePersistentDuckChat } from '../hooks/vue.js';
import { Models } from '../hooks/browser.js';
import ChatInterface from './components/ChatInterface.vue';
import SimpleChat from './components/SimpleChat.vue';
import PersistentChat from './components/PersistentChat.vue';

const activeTab = ref('chat');
</script>

<!-- Composant d'interface de chat complète -->
<script>
// ChatInterface.vue
export default {
  name: 'ChatInterface',
  template: `
    <div class="chat-container">
      <div class="chat-header">
        <h2>🦆 DuckDuckGo Chat Interface (Vue)</h2>
        <div class="controls">
          <select v-model="currentModel" @change="changeModel(currentModel)">
            <option v-for="(value, key) in availableModels" :key="key" :value="value">
              {{ key }}
            </option>
          </select>
          <label>
            <input type="checkbox" v-model="useStreaming" />
            Streaming
          </label>
          <button @click="clearChat" :disabled="isLoading">
            Effacer
          </button>
        </div>
      </div>

      <div class="messages-container" ref="messagesContainer">
        <div
          v-for="message in messages"
          :key="message.id || message.timestamp"
          :class="['message', message.role]"
        >
          <div class="message-header">
            <span class="role">{{ message.role }}</span>
            <span class="timestamp">
              {{ new Date(message.timestamp).toLocaleTimeString() }}
            </span>
          </div>
          <div class="message-content">{{ message.content }}</div>
        </div>

        <div v-if="isStreaming && streamingMessage" class="message assistant streaming">
          <div class="message-header">
            <span class="role">assistant</span>
            <span class="streaming-indicator">En cours...</span>
          </div>
          <div class="message-content">{{ streamingMessage }}</div>
        </div>

        <div v-if="error" class="error-message">
          <strong>Erreur:</strong> {{ error }}
        </div>
      </div>

      <form @submit.prevent="handleSendMessage" class="input-form">
        <input
          v-model="inputMessage"
          type="text"
          placeholder="Tapez votre message..."
          :disabled="isLoading"
        />
        <button type="submit" :disabled="isLoading || !inputMessage.trim()">
          {{ isLoading ? 'Envoi...' : 'Envoyer' }}
        </button>
      </form>

      <div class="status-bar">
        Messages: {{ messageCount }} | Modèle: {{ currentModel }} | 
        <span v-if="canSendMessage" class="status-ready">Prêt</span>
        <span v-else class="status-busy">Occupé</span>
      </div>
    </div>
  `,
  setup() {
    const {
      messages,
      isLoading,
      error,
      isStreaming,
      streamingMessage,
      currentModel,
      sendMessage,
      sendMessageStream,
      clearChat,
      changeModel,
      availableModels,
      messageCount,
      canSendMessage
    } = useDuckDuckGoChat(Models.GPT4Mini);

    const inputMessage = ref('');
    const useStreaming = ref(true);
    const messagesContainer = ref(null);

    const handleSendMessage = async () => {
      if (!inputMessage.value.trim()) return;

      try {
        if (useStreaming.value) {
          await sendMessageStream(inputMessage.value);
        } else {
          await sendMessage(inputMessage.value);
        }
        inputMessage.value = '';
        
        // Auto-scroll vers le bas
        nextTick(() => {
          if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
          }
        });
      } catch (err) {
        console.error('Erreur lors de l\'envoi du message:', err);
      }
    };

    return {
      messages,
      isLoading,
      error,
      isStreaming,
      streamingMessage,
      currentModel,
      sendMessage,
      sendMessageStream,
      clearChat,
      changeModel,
      availableModels,
      messageCount,
      canSendMessage,
      inputMessage,
      useStreaming,
      messagesContainer,
      handleSendMessage
    };
  }
};
</script>

<!-- Composant de chat simple -->
<script>
// SimpleChat.vue
export default {
  name: 'SimpleChat',
  template: `
    <div class="simple-chat">
      <h3>💬 Chat Simple (Vue)</h3>
      
      <form @submit.prevent="handleAskQuestion">
        <input
          v-model="question"
          type="text"
          placeholder="Posez votre question..."
          :disabled="isLoading"
        />
        <button type="submit" :disabled="isLoading || !question.trim()">
          {{ isLoading ? 'Traitement...' : 'Demander' }}
        </button>
      </form>

      <div v-if="error" class="error">Erreur: {{ error }}</div>
      
      <div v-if="response" class="response">
        <h4>Réponse:</h4>
        <p>{{ response }}</p>
        <button @click="clearResponse" class="clear-btn">Effacer</button>
      </div>
    </div>
  `,
  setup() {
    const { response, isLoading, error, askQuestion, clearResponse } = useSimpleDuckChat(Models.Claude3);
    const question = ref('');

    const handleAskQuestion = async () => {
      if (!question.value.trim()) return;

      try {
        await askQuestion(question.value);
        question.value = '';
      } catch (err) {
        console.error('Erreur:', err);
      }
    };

    return {
      response,
      isLoading,
      error,
      askQuestion,
      clearResponse,
      question,
      handleAskQuestion
    };
  }
};
</script>

<!-- Composant de chat persistant -->
<script>
// PersistentChat.vue
export default {
  name: 'PersistentChat',
  template: `
    <div class="persistent-chat">
      <h3>💾 Chat Persistant (Vue)</h3>
      <p class="description">
        Vos conversations sont automatiquement sauvegardées dans localStorage
      </p>
      
      <div class="controls">
        <button @click="loadHistory">Charger l'historique</button>
        <button @click="saveHistory">Sauvegarder</button>
        <button @click="clearHistory" class="danger">Supprimer tout</button>
      </div>

      <div class="messages-container" v-if="messages.length > 0">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message', message.role]"
        >
          <div class="message-header">
            <span class="role">{{ message.role }}</span>
            <button @click="removeMessage(message.id)" class="remove-btn">×</button>
          </div>
          <div class="message-content">{{ message.content }}</div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>Aucun message sauvegardé. Commencez une conversation !</p>
      </div>

      <form @submit.prevent="handleSendMessage" class="input-form">
        <input
          v-model="inputMessage"
          type="text"
          placeholder="Tapez votre message..."
          :disabled="!canSendMessage"
        />
        <button type="submit" :disabled="!canSendMessage || !inputMessage.trim()">
          {{ isLoading ? 'Envoi...' : 'Envoyer' }}
        </button>
      </form>

      <div v-if="error" class="error">{{ error }}</div>
    </div>
  `,
  setup() {
    const {
      messages,
      isLoading,
      error,
      canSendMessage,
      sendMessage,
      removeMessage,
      loadHistory,
      saveHistory,
      clearHistory
    } = usePersistentDuckChat('vue-duck-chat', Models.Llama);

    const inputMessage = ref('');

    const handleSendMessage = async () => {
      if (!inputMessage.value.trim()) return;

      try {
        await sendMessage(inputMessage.value);
        inputMessage.value = '';
      } catch (err) {
        console.error('Erreur lors de l\'envoi du message:', err);
      }
    };

    return {
      messages,
      isLoading,
      error,
      canSendMessage,
      sendMessage,
      removeMessage,
      loadHistory,
      saveHistory,
      clearHistory,
      inputMessage,
      handleSendMessage
    };
  }
};
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tabs button.active {
  border-bottom-color: #42b883;
  color: #42b883;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 600px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: linear-gradient(135deg, #42b883, #35495e);
  color: white;
}

.controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.controls select, .controls button {
  padding: 5px 10px;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 4px;
  background: rgba(255,255,255,0.1);
  color: white;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: #f9f9f9;
}

.message {
  margin-bottom: 15px;
  padding: 12px;
  border-radius: 12px;
  max-width: 80%;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.user {
  background: linear-gradient(135deg, #42b883, #369870);
  color: white;
  margin-left: auto;
}

.message.assistant {
  background: white;
  margin-right: auto;
  border: 1px solid #e0e0e0;
}

.message.streaming {
  opacity: 0.8;
  border-left: 4px solid #42b883;
}

.message-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.8em;
  margin-bottom: 8px;
  opacity: 0.7;
}

.streaming-indicator {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin: 10px 0;
  border-left: 4px solid #c33;
}

.input-form {
  display: flex;
  padding: 15px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.input-form input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 25px;
  margin-right: 10px;
  outline: none;
  transition: border-color 0.2s;
}

.input-form input:focus {
  border-color: #42b883;
}

.input-form button {
  padding: 12px 24px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background 0.2s;
}

.input-form button:hover:not(:disabled) {
  background: #369870;
}

.input-form button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.status-bar {
  padding: 8px 15px;
  background: #f0f0f0;
  font-size: 0.9em;
  border-top: 1px solid #e0e0e0;
}

.status-ready {
  color: #42b883;
  font-weight: bold;
}

.status-busy {
  color: #e67e22;
  font-weight: bold;
}

.simple-chat, .persistent-chat {
  padding: 25px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.description {
  color: #666;
  font-style: italic;
  margin-bottom: 20px;
}

.simple-chat form, .persistent-chat .input-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.simple-chat input, .persistent-chat input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.simple-chat button {
  padding: 12px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.error {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin: 10px 0;
}

.response {
  background: #e8f5e8;
  color: #2d5a2d;
  padding: 20px;
  border-radius: 8px;
  margin-top: 15px;
  position: relative;
}

.clear-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: 1px solid #42b883;
  color: #42b883;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8em;
}

.controls button.danger {
  background: #e74c3c;
  color: white;
}

.remove-btn {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 50px 20px;
}
</style> 