# 🦆 DuckDuckGo AI Chat Interface

<p align="center">
  <img src="./logo.png" width="200" alt="DuckDuckGo AI Chat Interface Logo">
  <br>
  <strong>🚀 Powerful Node.js Interface for DuckDuckGo AI Chat</strong><br>
  <em>Advanced Configuration • Intelligent Rate Limiting • Image Support • WebSearch</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-14.0+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js Version">
  <img src="https://img.shields.io/badge/NPM-Package-red?style=for-the-badge&logo=npm" alt="NPM Package">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/TypeScript-Full%20Support-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
</p>

<p align="center">
  <a href="#-installation">Installation</a> •
  <a href="#-quick-usage">Quick Usage</a> •
  <a href="./docs/">Documentation</a> •
  <a href="./examples/">Examples</a>
</p>

---

## ✨ Key Features

### 🧠 **5 Advanced AI Models**
- **GPT-4o mini** - Versatile + WebSearch + Image Support
- **Claude 3 Haiku** - Excellent for creative writing
- **Llama 3.3 70B** - Optimized for programming
- **Mistral Small** - Advanced analysis and reasoning
- **o4-mini** - Ultra-fast for quick responses

### 🔧 **Advanced Configuration**
- **Intelligent rate limiting** - Automatic protection
- **Configurable tools** - WebSearch, news, weather, local search
- **Logging system** - Debugging and monitoring
- **Automatic retry** - Robust error recovery
- **Optimized presets** - Ready-to-use configurations

### 📱 **Flexible Interfaces**
- **Simple messages** - Intuitive API
- **Real-time streaming** - Progressive responses
- **Multimodal support** - Images with GPT-4o mini
- **Persistent sessions** - Conversation history
- **Complete TypeScript** - IntelliSense and validation

---

## 📦 Installation

```bash
npm install duckduckgo-chat-interface
```

## 🚀 Quick Usage

### Basic Example

```javascript
import { DuckDuckGoChat, Models } from 'duckduckgo-chat-interface';

const chat = new DuckDuckGoChat(Models.GPT4Mini);
await chat.initialize();

const response = await chat.sendMessage("Hello, how are you?");
console.log(response);
```

### With WebSearch (GPT-4o mini)

```javascript
import { DuckDuckGoChat, ChatConfig, Models } from 'duckduckgo-chat-interface';

const config = ChatConfig.webSearchMode();
const chat = new DuckDuckGoChat(Models.GPT4Mini, config);
await chat.initialize();

chat.enableWebSearch();
const response = await chat.sendMessage("Latest AI news?");
console.log(response);
```

### Image Support

```javascript
const images = [{
  base64: imageBase64String,
  mimeType: 'image/jpeg'
}];

const response = await chat.sendMessage("Describe this image", images);
console.log(response);
```

### Real-time Streaming

```javascript
const response = await chat.sendMessageStream(
  "Tell me a story",
  (chunk) => process.stdout.write(chunk)
);
```

---

## 📚 Documentation

- **[🚀 Quick Start](./docs/quick-start.md)** - Get started in 5 minutes
- **[📋 API Reference](./docs/api-reference.md)** - Complete API documentation
- **[💡 Examples](./docs/examples.md)** - Practical usage examples

---

## 📊 Models and Capabilities

| Model | WebSearch | Images | Strength | Recommended Usage |
|--------|:---------:|:------:|-------|------------------|
| **GPT-4o mini** | ✅ | ✅ | Versatile | General questions, search |
| **Claude 3 Haiku** | ❌ | ❌ | Creativity | Writing, explanations |
| **Llama 3.3 70B** | ❌ | ❌ | Technical | Code, programming |
| **Mistral Small** | ❌ | ❌ | Logic | Analysis, reasoning |
| **o4-mini** | ❌ | ❌ | Speed | Quick responses |

---

## 🔧 Configuration Presets

```javascript
// WebSearch mode (GPT-4o mini)
const config = ChatConfig.webSearchMode();

// News mode
const config = ChatConfig.newsMode();

// Local mode (weather + local search)
const config = ChatConfig.localMode();

// High performance mode
const config = ChatConfig.highVolumeMode();
```

---

## 📈 Examples

Explore detailed examples in the [`examples/`](./examples/) folder:

- **[`test.js`](./examples/test.js)** - Basic examples and configuration
- **[`test-advanced.js`](./examples/test-advanced.js)** - Advanced features
- **[`test-simple.js`](./examples/test-simple.js)** - Simple tests and validation

---

## 🛡️ Compatibility

- **Node.js** : >= 14.0.0
- **TypeScript** : Full support with types
- **ES Modules** : Native ESM format
- **Backward compatibility** : 100% with 1.x versions

---

## 🚨 Important Notes

- **WebSearch and images** only with GPT-4o mini
- **Rate limiting enabled by default** to protect API
- **`initialize()` required** before sending messages
- **Automatic retry** on temporary errors

---

## 📞 Support and Community

- **📚 Documentation** : [docs/](./docs/)
- **💻 Examples** : [examples/](./examples/)
- **🐛 Issues** : [GitHub Issues](https://github.com/benoitpetit/duckduckGO-chat-interface/issues)
- **💬 Discussions** : [GitHub Discussions](https://github.com/benoitpetit/duckduckGO-chat-interface/discussions)

---

## 📜 License

MIT License - see [LICENSE](./LICENSE) for details.

---

<p align="center">
  <strong>🏁 Ready to start?</strong><br>
  Follow the <a href="./docs/quick-start.md">Quick Start Guide</a>!
</p>
