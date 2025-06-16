import React, { useState } from 'react';
import { useDuckDuckGoChat, useSimpleDuckChat } from '../hooks/react.js';
import { Models } from '../index.js';

// Exemple d'interface de chat complète avec React
function ChatInterface() {
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

  const [inputMessage, setInputMessage] = useState('');
  const [useStreaming, setUseStreaming] = useState(true);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    try {
      if (useStreaming) {
        await sendMessageStream(inputMessage);
      } else {
        await sendMessage(inputMessage);
      }
      setInputMessage('');
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
    }
  };

  const handleModelChange = (e) => {
    changeModel(e.target.value);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>🦆 DuckDuckGo Chat Interface</h2>
        <div className="controls">
          <select value={currentModel} onChange={handleModelChange}>
            {Object.entries(availableModels).map(([key, value]) => (
              <option key={key} value={value}>
                {key}
              </option>
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
          <button onClick={clearChat} disabled={isLoading}>
            Effacer
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id || message.timestamp}
            className={`message ${message.role}`}
          >
            <div className="message-header">
              <span className="role">{message.role}</span>
              <span className="timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="message-content">{message.content}</div>
          </div>
        ))}

        {isStreaming && streamingMessage && (
          <div className="message assistant streaming">
            <div className="message-header">
              <span className="role">assistant</span>
              <span className="streaming-indicator">En cours...</span>
            </div>
            <div className="message-content">{streamingMessage}</div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <strong>Erreur:</strong> {error}
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Tapez votre message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !inputMessage.trim()}>
          {isLoading ? 'Envoi...' : 'Envoyer'}
        </button>
      </form>

      <div className="status-bar">
        Messages: {messageCount} | Modèle: {currentModel}
      </div>
    </div>
  );
}

// Exemple d'utilisation simple avec React
function SimpleChat() {
  const { response, isLoading, error, askQuestion } = useSimpleDuckChat(Models.Claude3);
  const [question, setQuestion] = useState('');

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      await askQuestion(question);
      setQuestion('');
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  return (
    <div className="simple-chat">
      <h3>💬 Chat Simple</h3>
      
      <form onSubmit={handleAskQuestion}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Posez votre question..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !question.trim()}>
          {isLoading ? 'Traitement...' : 'Demander'}
        </button>
      </form>

      {error && <div className="error">Erreur: {error}</div>}
      
      {response && (
        <div className="response">
          <h4>Réponse:</h4>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

// Composant principal avec exemples
function App() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="app">
      <nav className="tabs">
        <button 
          className={activeTab === 'chat' ? 'active' : ''}
          onClick={() => setActiveTab('chat')}
        >
          Chat Complet
        </button>
        <button 
          className={activeTab === 'simple' ? 'active' : ''}
          onClick={() => setActiveTab('simple')}
        >
          Chat Simple
        </button>
      </nav>

      <div className="content">
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'simple' && <SimpleChat />}
      </div>

      <style jsx>{`
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
        }
        
        .tabs button.active {
          border-bottom-color: #007bff;
          color: #007bff;
        }
        
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 600px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .controls {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        
        .controls select, .controls button {
          padding: 5px 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          background: white;
        }
        
        .message {
          margin-bottom: 15px;
          padding: 10px;
          border-radius: 8px;
          max-width: 80%;
        }
        
        .message.user {
          background: #007bff;
          color: white;
          margin-left: auto;
        }
        
        .message.assistant {
          background: #f1f3f4;
          margin-right: auto;
        }
        
        .message.streaming {
          opacity: 0.8;
          border-left: 3px solid #007bff;
        }
        
        .message-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.8em;
          margin-bottom: 5px;
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
          background: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 4px;
          margin: 10px 0;
        }
        
        .input-form {
          display: flex;
          padding: 15px;
          background: #f8f9fa;
          border-top: 1px solid #e0e0e0;
        }
        
        .input-form input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-right: 10px;
        }
        
        .input-form button {
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .input-form button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .status-bar {
          padding: 8px 15px;
          background: #e9ecef;
          font-size: 0.9em;
          border-top: 1px solid #e0e0e0;
        }
        
        .simple-chat {
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: white;
        }
        
        .simple-chat form {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .simple-chat input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        
        .simple-chat button {
          padding: 10px 20px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .error {
          background: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 4px;
          margin: 10px 0;
        }
        
        .response {
          background: #d4edda;
          color: #155724;
          padding: 15px;
          border-radius: 4px;
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
}

export default App; 