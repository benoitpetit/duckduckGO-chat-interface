# 🦆 DuckDuckGo AI Chat Interface

<p align="center">
  <img src="./logo.png" width="200" alt="DuckDuckGo AI Chat Interface Logo">
  <br>
  <strong>🚀 A Node.js interface for DuckDuckGo AI Chat with React/Vue.js support</strong><br>
  <em>Simple and efficient integration with streaming support, hooks, and session management</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-14.0+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js Version">
  <img src="https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Version">
  <img src="https://img.shields.io/badge/Vue.js-3.0+-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue Version">
  <img src="https://img.shields.io/badge/NPM-Package-red?style=for-the-badge&logo=npm" alt="NPM Package">
  <img src="https://img.shields.io/badge/License-Open%20Source-green?style=for-the-badge" alt="License">
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-nodejs-usage">Node.js Usage</a> •
  <a href="#-react--nextjs">React</a> •
  <a href="#-vuejs--nuxtjs">Vue.js</a> •
  <a href="#-api-reference">API Reference</a>
</p>

---

## ✨ Features

<table>
<tr>
<td>

### 💬 Chat Experience
- Streaming responses
- Multiple AI models
- Session persistence
- Auto token refresh

</td>
<td>

### ⚛️ React Integration
- React hooks
- Next.js support
- State management
- TypeScript definitions

</td>
<td>

### 🟢 Vue.js Integration
- Vue 3 composables
- Nuxt.js support
- Reactive state
- Composition API

</td>
</tr>
</table>

## 🔥 Nouveautés - Hooks pour React/Next.js et Vue.js

Cette version inclut maintenant des **hooks React** et **composables Vue.js** pour une intégration native avec les frameworks frontend modernes !

### ⚛️ React/Next.js
```jsx
import { useDuckDuckGoChat } from 'duckduckgo-chat-interface/hooks/react';

function ChatComponent() {
  const { messages, sendMessage, isLoading } = useDuckDuckGoChat();
  
  return (
    <div>
      {messages.map(msg => <div key={msg.id}>{msg.content}</div>)}
      <button onClick={() => sendMessage("Hello!")}>Send</button>
    </div>
  );
}
```

### 🟢 Vue.js/Nuxt.js
```vue
<script setup>
import { useDuckDuckGoChat } from 'duckduckgo-chat-interface/hooks/vue';

const { messages, sendMessage, isLoading } = useDuckDuckGoChat();
</script>

<template>
  <div>
    <div v-for="msg in messages" :key="msg.id">{{ msg.content }}</div>
    <button @click="sendMessage('Hello!')" :disabled="isLoading">Send</button>
  </div>
</template>
```

## 🤖 Available Models

| Model Name         | Integration ID                            | Alias          | Strength         | Best For             | Characteristics              |
| :----------------- | :---------------------------------------- | :------------- | :------------------- | :----------------------- | :---------------------------------- |
| **GPT-4o mini**    | gpt-4o-mini                               | GPT4Mini       | General purpose      | Everyday questions       | • Fast<br>• Well-balanced           |
| **Claude 3 Haiku** | claude-3-haiku-20240307                   | Claude3        | Creative writing     | Explanations & summaries | • Clear responses<br>• Concise      |
| **Llama 3.3 70B**  | meta-llama/Llama-3.3-70B-Instruct-Turbo   | Llama          | Programming          | Code-related tasks       | • Technical precision<br>• Detailed |
| **Mistral Small**  | mistralai/Mistral-Small-24B-Instruct-2501 | Mixtral        | Knowledge & analysis | Complex topics           | • Reasoning<br>• Logic-focused      |
| **o4-mini**        | o4-mini                                   | O4Mini         | Speed                | Quick answers            | • Very fast<br>• Compact responses  |

## 📦 Installation

```bash
npm install duckduckgo-chat-interface
```

### For React/Next.js projects
```bash
npm install react react-dom
# or for Next.js
npm install next react react-dom
```

### For Vue.js projects
```bash
npm install vue
# or for Nuxt.js
npm install nuxt
```

## 🎯 Node.js Usage

### Module Import

```javascript
import { DuckDuckGoChat, Models } from 'duckduckgo-chat-interface';
// or
import DuckDuckGoChat, { Models } from 'duckduckgo-chat-interface';
```

### Basic Usage

```javascript
import { DuckDuckGoChat, Models } from 'duckduckgo-chat-interface';

async function example() {
  // Create a new chat session
  const chat = new DuckDuckGoChat(Models.GPT4Mini);
  
  // Initialize the session
  await chat.initialize();
  
  // Send a message and get the complete response
  const response = await chat.sendMessage("Hello! How are you?");
  console.log(response);
  
  // Continue the conversation
  const response2 = await chat.sendMessage("Can you explain what AI is?");
  console.log(response2);
}

example().catch(console.error);
```

### Streaming Usage

```javascript
import { DuckDuckGoChat, Models } from 'duckduckgo-chat-interface';

async function streamExample() {
  const chat = new DuckDuckGoChat(Models.Claude3);
  await chat.initialize();
  
  // Send a message with streaming
  const response = await chat.sendMessageStream(
    "Tell me a short story",
    (chunk) => {
      // This function is called for each data chunk
      process.stdout.write(chunk);
    }
  );
  
  console.log("\n\nComplete response:", response);
}

streamExample().catch(console.error);
```

### Available Models

```javascript
import { Models } from 'duckduckgo-chat-interface';

console.log(Models.GPT4Mini);   // 'gpt-4o-mini'
console.log(Models.Claude3);    // 'claude-3-haiku-20240307'
console.log(Models.Llama);      // 'meta-llama/Llama-3.3-70B-Instruct-Turbo'
console.log(Models.Mixtral);    // 'mistralai/Mistral-Small-24B-Instruct-2501'
console.log(Models.O4Mini);     // 'o4-mini'

// Get all available models
const allModels = DuckDuckGoChat.getAvailableModels();
console.log(allModels);
```

## ⚛️ React / Next.js

### Hook Principal : `useDuckDuckGoChat`

Un hook React complet pour gérer une session de chat avec state management intégré.

#### Import
```javascript
import { useDuckDuckGoChat } from 'duckduckgo-chat-interface/hooks/react';
import { Models } from 'duckduckgo-chat-interface';
```

#### Utilisation de base
```jsx
import React, { useState } from 'react';
import { useDuckDuckGoChat } from 'duckduckgo-chat-interface/hooks/react';
import { Models } from 'duckduckgo-chat-interface';

function ChatComponent() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    currentModel,
    changeModel
  } = useDuckDuckGoChat(Models.GPT4Mini);

  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim()) {
      await sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.timestamp} className={`message ${msg.role}`}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
      
      <div className="input-section">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder="Tapez votre message..."
        />
        <button onClick={handleSend} disabled={isLoading}>
          {isLoading ? 'Envoi...' : 'Envoyer'}
        </button>
        <button onClick={clearChat}>Effacer</button>
      </div>
      
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default ChatComponent;
```

#### API Complète - Hook React

**État disponible :**
- `messages`: Array des messages de la conversation
- `isLoading`: Boolean indiquant si une requête est en cours
- `error`: String d'erreur ou null
- `isInitialized`: Boolean indiquant si le chat est initialisé
- `currentModel`: String du modèle actuel
- `streamingMessage`: String du message en cours de streaming
- `isStreaming`: Boolean indiquant si le streaming est actif
- `messageCount`: Number du nombre de messages
- `lastMessage`: Dernier message ou null

**Méthodes disponibles :**
- `sendMessage(content)`: Envoie un message et retourne la réponse complète
- `sendMessageStream(content)`: Envoie un message avec streaming
- `clearChat()`: Efface l'historique de conversation
- `changeModel(model)`: Change le modèle IA utilisé
- `cancelRequest()`: Annule la requête en cours
- `initialize()`: Initialise manuellement le chat
- `availableModels`: Objet des modèles disponibles

### Hook Simple : `useSimpleDuckChat`

Un hook simplifié pour des interactions basiques.

```jsx
import React, { useState } from 'react';
import { useSimpleDuckChat } from 'duckduckgo-chat-interface/hooks/react';
import { Models } from 'duckduckgo-chat-interface';

function SimpleChat() {
  const { response, isLoading, error, askQuestion } = useSimpleDuckChat(Models.Claude3);
  const [question, setQuestion] = useState('');

  const handleAskQuestion = async () => {
    if (question.trim()) {
      await askQuestion(question);
      setQuestion('');
    }
  };

  return (
    <div>
      <input 
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Posez votre question..."
      />
      <button onClick={handleAskQuestion} disabled={isLoading}>
        {isLoading ? 'Traitement...' : 'Demander'}
      </button>
      
      {response && <div className="response">{response}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

### Exemple avec Streaming

```jsx
function StreamingChat() {
  const {
    messages,
    streamingMessage,
    isStreaming,
    sendMessageStream
  } = useDuckDuckGoChat();

  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim()) {
      await sendMessageStream(input);
      setInput('');
    }
  };

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      
      {isStreaming && streamingMessage && (
        <div className="streaming">
          {streamingMessage}
          <span className="cursor">|</span>
        </div>
      )}
      
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend}>Envoyer</button>
    </div>
  );
}
```

### Intégration Next.js

#### App Router
```jsx
// app/chat/page.js
'use client';
import { useDuckDuckGoChat } from 'duckduckgo-chat-interface/hooks/react';

export default function ChatPage() {
  const { messages, sendMessage } = useDuckDuckGoChat();
  
  return (
    <div>
      {/* Votre interface de chat */}
    </div>
  );
}
```

#### Pages Router
```jsx
// pages/chat.js
import { useDuckDuckGoChat } from 'duckduckgo-chat-interface/hooks/react';

export default function ChatPage() {
  const { messages, sendMessage } = useDuckDuckGoChat();
  
  return <div>{/* Interface */}</div>;
}
```

## 🟢 Vue.js / Nuxt.js

### Composable Principal : `useDuckDuckGoChat`

Un composable Vue.js avec réactivité complète utilisant la Composition API.

#### Import
```javascript
import { useDuckDuckGoChat } from 'duckduckgo-chat-interface/hooks/vue';
import { Models } from 'duckduckgo-chat-interface';
```

#### Utilisation de base
```vue
<template>
  <div class="chat">
    <div class="messages">
      <div 
        v-for="message in messages" 
        :key="message.id"
        :class="['message', message.role]"
      >
        <strong>{{ message.role }}:</strong> {{ message.content }}
      </div>
    </div>
    
    <form @submit.prevent="handleSend">
      <input 
        v-model="input" 
        :disabled="!canSendMessage"
        placeholder="Tapez votre message..."
      />
      <button type="submit" :disabled="!canSendMessage">
        {{ isLoading ? 'Envoi...' : 'Envoyer' }}
      </button>
      <button type="button" @click="clearChat">Effacer</button>
    </form>
    
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDuckDuckGoChat } from 'duckduckgo-chat-interface/hooks/vue';
import { Models } from 'duckduckgo-chat-interface';

const {
  messages,
  isLoading,
  error,
  canSendMessage,
  sendMessage,
  clearChat
} = useDuckDuckGoChat(Models.GPT4Mini);

const input = ref('');

const handleSend = async () => {
  if (input.value.trim()) {
    await sendMessage(input.value);
    input.value = '';
  }
};
</script>

<style scoped>
.chat { 
  max-width: 600px; 
  margin: 0 auto; 
  padding: 20px; 
}
.messages { 
  height: 400px; 
  overflow-y: auto; 
  border: 1px solid #ddd; 
  padding: 10px; 
  margin-bottom: 10px; 
}
.message { 
  margin-bottom: 10px; 
  padding: 8px; 
  border-radius: 4px; 
}
.message.user { 
  background: #e3f2fd; 
}
.message.assistant { 
  background: #f3e5f5; 
}
form { 
  display: flex; 
  gap: 10px; 
}
input { 
  flex: 1; 
  padding: 8px; 
}
.error { 
  color: red; 
  margin-top: 10px; 
}
</style>
```

#### API Complète - Composable Vue

**État réactif (Ref) :**
- `messages`: Ref<Array> des messages
- `isLoading`: Ref<Boolean> état de chargement
- `error`: Ref<String|null> erreur éventuelle
- `isInitialized`: Ref<Boolean> état d'initialisation
- `currentModel`: Ref<String> modèle actuel
- `streamingMessage`: Ref<String> message en streaming
- `isStreaming`: Ref<Boolean> état de streaming

**État calculé (Computed) :**
- `messageCount`: Ref<Number> nombre de messages
- `lastMessage`: Ref<Object|null> dernier message
- `canSendMessage`: Ref<Boolean> possibilité d'envoyer

**Méthodes :**
- `sendMessage(content)`: Envoie un message
- `sendMessageStream(content)`: Envoie avec streaming
- `clearChat()`: Efface la conversation
- `changeModel(model)`: Change le modèle
- `removeMessage(id)`: Supprime un message spécifique
- `cancelRequest()`: Annule la requête
- `initialize()`: Initialise manuellement

### Composable Simple : `useSimpleDuckChat`

```vue
<template>
  <div>
    <input v-model="question" placeholder="Votre question..." />
    <button @click="askQuestion(question)" :disabled="isLoading">
      {{ isLoading ? 'Traitement...' : 'Demander' }}
    </button>
    
    <div v-if="response" class="response">{{ response }}</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSimpleDuckChat } from 'duckduckgo-chat-interface/hooks/vue';
import { Models } from 'duckduckgo-chat-interface';

const { response, isLoading, error, askQuestion } = useSimpleDuckChat(Models.Claude3);
const question = ref('');
</script>
```

### Composable Persistant : `usePersistentDuckChat`

Sauvegarde automatique dans localStorage.

```vue
<template>
  <div>
    <div class="controls">
      <button @click="loadHistory">Charger l'historique</button>
      <button @click="saveHistory">Sauvegarder</button>
      <button @click="clearHistory">Supprimer tout</button>
    </div>
    
    <div class="messages">
      <div v-for="message in messages" :key="message.id" class="message">
        {{ message.content }}
        <button @click="removeMessage(message.id)" class="remove-btn">×</button>
      </div>
    </div>
    
    <form @submit.prevent="handleSendMessage">
      <input
        v-model="inputMessage"
        placeholder="Tapez votre message..."
        :disabled="!canSendMessage"
      />
      <button type="submit" :disabled="!canSendMessage || !inputMessage.trim()">
        {{ isLoading ? 'Envoi...' : 'Envoyer' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePersistentDuckChat } from 'duckduckgo-chat-interface/hooks/vue';
import { Models } from 'duckduckgo-chat-interface';

const {
  messages,
  isLoading,
  canSendMessage,
  sendMessage,
  removeMessage,
  loadHistory,
  saveHistory,
  clearHistory
} = usePersistentDuckChat('my-chat-key', Models.Llama);

const inputMessage = ref('');

const handleSendMessage = async () => {
  if (inputMessage.value.trim()) {
    await sendMessage(inputMessage.value);
    inputMessage.value = '';
  }
};
</script>
```

### Intégration Nuxt.js 3

```vue
<!-- pages/chat.vue -->
<template>
  <div>
    <!-- Interface de chat -->
  </div>
</template>

<script setup>
import { useDuckDuckGoChat } from 'duckduckgo-chat-interface/hooks/vue';

const { messages, sendMessage } = useDuckDuckGoChat();
</script>
```

## 📖 API Reference

### DuckDuckGoChat Class

#### Constructor

```javascript
new DuckDuckGoChat(model = Models.GPT4Mini)
```

- `model`: The model to use (optional, defaults to `Models.GPT4Mini`)

#### Methods

##### `initialize()`

Initializes the chat session and obtains necessary tokens.

```javascript
await chat.initialize();
```

##### `sendMessage(content)`

Sends a message and returns the complete response.

```javascript
const response = await chat.sendMessage("Your message");
```

##### `sendMessageStream(content, onChunk)`

Sends a message and processes the response with streaming.

```javascript
const response = await chat.sendMessageStream(
  "Your message",
  (chunk) => console.log(chunk)
);
```

##### `clear()`

Clears conversation history and resets the session.

```javascript
await chat.clear();
```

##### `setModel(model)`

Changes the model used for next messages.

```javascript
chat.setModel(Models.Claude3);
```

##### `getHistory()`

Returns the complete message history.

```javascript
const history = chat.getHistory();
```

##### `getAvailableModels()` (static)

Returns the list of available models.

```javascript
const models = DuckDuckGoChat.getAvailableModels();
```

## 🔧 Configuration Avancée

### Gestion d'erreurs personnalisée

#### React
```jsx
const { error, sendMessage } = useDuckDuckGoChat();

const handleSendWithRetry = async (message) => {
  try {
    await sendMessage(message);
  } catch (err) {
    console.error('Erreur envoi:', err);
    // Logique de retry personnalisée
  }
};
```

#### Vue.js
```vue
<script setup>
const { error, sendMessage } = useDuckDuckGoChat();

const handleSendWithRetry = async (message) => {
  try {
    await sendMessage(message);
  } catch (err) {
    console.error('Erreur envoi:', err);
    // Logique de retry personnalisée
  }
};
</script>
```

### Streaming avancé

```jsx
// React - Traitement personnalisé du streaming
const { sendMessageStream } = useDuckDuckGoChat();

const handleStreamWithProcessing = async (message) => {
  const response = await sendMessageStream(message);
  // Traitement post-streaming
  console.log('Réponse complète:', response);
};
```

## 🚀 Optimisations de Performance

### React - Mémoisation
```jsx
import { memo, useMemo } from 'react';

const ChatMessage = memo(({ message }) => (
  <div className={`message ${message.role}`}>
    {message.content}
  </div>
));

function OptimizedChat() {
  const { messages } = useDuckDuckGoChat();
  
  const memoizedMessages = useMemo(() => 
    messages.map(msg => <ChatMessage key={msg.id} message={msg} />),
    [messages]
  );

  return <div>{memoizedMessages}</div>;
}
```

### Vue - Optimisations de rendu
```vue
<template>
  <div>
    <!-- v-memo pour optimiser le rendu de listes -->
    <div 
      v-for="message in messages" 
      :key="message.id"
      v-memo="[message.content, message.role]"
      :class="['message', message.role]"
    >
      {{ message.content }}
    </div>
  </div>
</template>
```

## 🔐 Sécurité et Bonnes Pratiques

### Validation des entrées
```javascript
const validateInput = (input) => {
  if (!input || input.trim().length === 0) return false;
  if (input.length > 4000) return false; // Limite de caractères
  return true;
};
```

### Limitation de taux
```javascript
const RATE_LIMIT = 2000; // 2 secondes entre messages
let lastSent = 0;

const canSend = () => {
  return Date.now() - lastSent > RATE_LIMIT;
};
```

## 🔧 Error Handling

```javascript
import { DuckDuckGoChat } from 'duckduckgo-chat-interface';

async function robustExample() {
  const chat = new DuckDuckGoChat();
  
  try {
    await chat.initialize();
    const response = await chat.sendMessage("Hello!");
    console.log(response);
  } catch (error) {
    if (error.message.includes('418') || error.message.includes('429')) {
      console.log('Rate limited, retrying in 5 seconds...');
      setTimeout(() => robustExample(), 5000);
    } else {
      console.error('Chat error:', error);
    }
  }
}
```

## 📚 Examples

### Complete Chat Interface (React)

```jsx
import React, { useState } from 'react';
import { useDuckDuckGoChat } from 'duckduckgo-chat-interface/hooks/react';
import { Models } from 'duckduckgo-chat-interface';

function CompleteChat() {
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
    availableModels
  } = useDuckDuckGoChat(Models.GPT4Mini);

  const [input, setInput] = useState('');
  const [useStreaming, setUseStreaming] = useState(true);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    try {
      if (useStreaming) {
        await sendMessageStream(input);
      } else {
        await sendMessage(input);
      }
      setInput('');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <select 
          value={currentModel} 
          onChange={(e) => changeModel(e.target.value)}
        >
          {Object.entries(availableModels).map(([key, value]) => (
            <option key={key} value={value}>{key}</option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={useStreaming}
            onChange={(e) => setUseStreaming(e.target.checked)}
          />
          Streaming
        </label>
        <button onClick={clearChat}>Clear</button>
      </div>

      <div style={{ 
        height: '400px', 
        border: '1px solid #ddd', 
        overflowY: 'auto', 
        padding: '10px',
        marginBottom: '10px'
      }}>
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            style={{ 
              marginBottom: '10px',
              padding: '8px',
              backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f3e5f5',
              borderRadius: '4px'
            }}
          >
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
        
        {isStreaming && streamingMessage && (
          <div style={{ 
            padding: '8px',
            backgroundColor: '#fff3e0',
            borderRadius: '4px',
            borderLeft: '3px solid #ff9800'
          }}>
            <strong>assistant:</strong> {streamingMessage}
            <span style={{ animation: 'blink 1s infinite' }}>|</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button onClick={handleSend} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error}
        </div>
      )}
    </div>
  );
}

export default CompleteChat;
```

### Complete Chat Interface (Vue.js)

```vue
<template>
  <div class="chat-app">
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
      <button @click="clearChat">Clear</button>
    </div>

    <div class="messages">
      <div
        v-for="(message, idx) in messages"
        :key="idx"
        :class="['message', message.role]"
      >
        <strong>{{ message.role }}:</strong> {{ message.content }}
      </div>
      
      <div v-if="isStreaming && streamingMessage" class="message streaming">
        <strong>assistant:</strong> {{ streamingMessage }}
        <span class="cursor">|</span>
      </div>
    </div>

    <div class="input-section">
      <input
        v-model="input"
        @keyup.enter="handleSend"
        :disabled="isLoading"
        placeholder="Type your message..."
      />
      <button @click="handleSend" :disabled="isLoading">
        {{ isLoading ? 'Sending...' : 'Send' }}
      </button>
    </div>

    <div v-if="error" class="error">
      Error: {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDuckDuckGoChat } from 'duckduckgo-chat-interface/hooks/vue';
import { Models } from 'duckduckgo-chat-interface';

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
  availableModels
} = useDuckDuckGoChat(Models.GPT4Mini);

const input = ref('');
const useStreaming = ref(true);

const handleSend = async () => {
  if (!input.value.trim()) return;
  
  try {
    if (useStreaming.value) {
      await sendMessageStream(input.value);
    } else {
      await sendMessage(input.value);
    }
    input.value = '';
  } catch (err) {
    console.error('Error:', err);
  }
};
</script>

<style scoped>
.chat-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.messages {
  height: 400px;
  border: 1px solid #ddd;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 10px;
}

.message {
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 4px;
}

.message.user {
  background-color: #e3f2fd;
}

.message.assistant {
  background-color: #f3e5f5;
}

.message.streaming {
  background-color: #fff3e0;
  border-left: 3px solid #ff9800;
}

.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.input-section {
  display: flex;
  gap: 10px;
}

.input-section input {
  flex: 1;
  padding: 8px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
```

Check the `examples/` folder for complete implementations:
- `examples/react-example.jsx` - Complete React interface
- `examples/vue-example.vue` - Complete Vue.js interface

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This project is based on reverse engineering of the DuckDuckGo Chat API and is for educational purposes. Use responsibly and in accordance with DuckDuckGo's terms of service.
