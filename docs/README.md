# DuckDuckGo Chat Interface Documentation

A Node.js interface for DuckDuckGo AI Chat with support for multiple models, WebSearch, and images.

## 📚 Documentation

- **[Quick Start](./quick-start.md)** - Get started in 5 minutes
- **[API Reference](./api-reference.md)** - Complete API documentation
- **[Examples](./examples.md)** - Practical usage examples

## 🧠 Supported Models

| Model | WebSearch | Images | Best For |
|-------|:---------:|:------:|----------|
| **GPT-4o mini** | ✅ | ✅ | General purpose, search |
| **Claude 3 Haiku** | ❌ | ❌ | Creative writing |
| **Llama 3.3 70B** | ❌ | ❌ | Programming |
| **Mistral Small** | ❌ | ❌ | Analysis, reasoning |
| **o4-mini** | ❌ | ❌ | Fast responses |

## ✨ Key Features

- **5 AI Models** - Choose the best for your use case
- **WebSearch** - Real-time internet search (GPT-4o mini)
- **Image Support** - Send and analyze images (GPT-4o mini)
- **Rate Limiting** - Built-in protection against rate limits
- **Streaming** - Real-time response streaming
- **TypeScript** - Full type support
- **Configuration** - Flexible setup options

## 🚀 Quick Example

```javascript
import { DuckDuckGoChat, Models } from 'duckduckgo-chat-interface';

const chat = new DuckDuckGoChat(Models.GPT4Mini);
await chat.initialize();

const response = await chat.sendMessage("Hello!");
console.log(response);
```

---

**Need help?** Check the [examples](./examples.md) or [API reference](./api-reference.md). 