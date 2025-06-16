# Quick Start Guide

Get up and running with DuckDuckGo Chat Interface in minutes.

## Installation

```bash
npm install duckduckgo-chat-interface
```

## Basic Usage

### 1. Simple Chat

```javascript
import { DuckDuckGoChat, Models } from 'duckduckgo-chat-interface';

// Create chat instance
const chat = new DuckDuckGoChat(Models.GPT4Mini);

// Initialize (required)
await chat.initialize();

// Send message
const response = await chat.sendMessage("Hello, how are you?");
console.log(response);
```

### 2. With WebSearch

```javascript
import { DuckDuckGoChat, Models, ChatConfig } from 'duckduckgo-chat-interface';

// Use preset configuration
const config = ChatConfig.webSearchMode();
const chat = new DuckDuckGoChat(Models.GPT4Mini, config);

await chat.initialize();

// Enable web search
chat.enableWebSearch();

const response = await chat.sendMessage("What's the latest news about AI?");
console.log(response);
```

### 3. With Images

```javascript
const images = [{
  base64: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...", // Your base64 image
  mimeType: 'image/jpeg'
}];

const response = await chat.sendMessage("What's in this image?", images);
console.log(response);
```

### 4. Streaming Response

```javascript
const response = await chat.sendMessageStream(
  "Tell me a story",
  (chunk) => process.stdout.write(chunk) // Real-time output
);

console.log("\nFull response:", response);
```

## Configuration Options

### Preset Configurations

```javascript
// Web search optimized
const config = ChatConfig.webSearchMode();

// News focused
const config = ChatConfig.newsMode();

// Local search and weather
const config = ChatConfig.localMode();

// High volume usage
const config = ChatConfig.highVolumeMode();
```

### Custom Configuration

```javascript
import { ChatConfig } from 'duckduckgo-chat-interface';

const config = new ChatConfig({
  timeout: 30000,
  maxRetries: 3,
  enableLogging: true,
  rateLimiting: {
    enabled: true,
    maxRequestsPerMinute: 10
  },
  tools: {
    webSearch: true,
    newsSearch: false
  }
});
```

## Model Selection

```javascript
// GPT-4o mini (supports WebSearch + Images)
const chat = new DuckDuckGoChat(Models.GPT4Mini);

// Claude 3 Haiku (creative writing)
const chat = new DuckDuckGoChat(Models.Claude3);

// Llama 3.3 70B (programming)
const chat = new DuckDuckGoChat(Models.Llama);

// Mistral Small (analysis)
const chat = new DuckDuckGoChat(Models.Mixtral);

// o4-mini (fast responses)
const chat = new DuckDuckGoChat(Models.O4Mini);
```

## Important Notes

- **Always call `initialize()`** before sending messages
- **WebSearch and Images** only work with GPT-4o mini
- **Rate limiting** is enabled by default
- **Auto-retry** handles temporary errors

## Next Steps

- Check [Examples](./examples.md) for more use cases
- Read [API Reference](./api-reference.md) for complete documentation
- Explore the `/examples` folder in the package 