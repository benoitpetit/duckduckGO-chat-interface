# API Reference

Complete reference for DuckDuckGo Chat Interface.

## Classes

### DuckDuckGoChat

Main chat interface class.

#### Constructor

```javascript
new DuckDuckGoChat(model?, config?)
```

- `model` (string, optional): Model to use (default: GPT4Mini)
- `config` (ChatConfig, optional): Configuration options

#### Methods

##### `initialize(): Promise<DuckDuckGoChat>`

Initialize the chat session. **Required before sending messages.**

```javascript
await chat.initialize();
```

##### `sendMessage(content, images?): Promise<string>`

Send a message and get the complete response.

- `content` (string): Message text
- `images` (ImageContent[], optional): Array of images (GPT-4o mini only)

```javascript
const response = await chat.sendMessage("Hello!");
```

##### `sendMessageStream(content, onChunk?, images?): Promise<string>`

Send a message with streaming response.

- `content` (string): Message text
- `onChunk` (function, optional): Callback for each chunk
- `images` (ImageContent[], optional): Array of images

```javascript
const response = await chat.sendMessageStream(
  "Tell me a story",
  (chunk) => process.stdout.write(chunk)
);
```

##### Configuration Methods

```javascript
// Configure tools
chat.configureTools({ webSearch: true, newsSearch: false });

// Enable specific features
chat.enableWebSearch();
chat.enableNewsSearch();
chat.enableLocalFeatures();

// Change model
chat.setModel(Models.Claude3);

// Clear conversation history
await chat.clear();
```

##### Utility Methods

```javascript
// Check capabilities
chat.supportsImages(); // boolean
chat.supportsAdvancedTools(); // boolean

// Get conversation history
const history = chat.getHistory(); // Message[]

// Get available models
const models = DuckDuckGoChat.getAvailableModels(); // string[]
```

---

## Configuration

### ChatConfig

Configuration class for customizing behavior.

#### Constructor

```javascript
new ChatConfig(options?)
```

#### Options

```javascript
{
  timeout: number,              // Request timeout (default: 30000ms)
  maxRetries: number,           // Max retry attempts (default: 3)
  retryDelay: number,           // Delay between retries (default: 1000ms)
  enableLogging: boolean,       // Enable console logging (default: false)
  language: string,             // Response language (default: 'en')
  userAgent: string,            // Custom user agent
  rateLimiting: {
    enabled: boolean,           // Enable rate limiting (default: true)
    maxRequestsPerMinute: number, // Requests per minute (default: 10)
    maxRequestsPerHour: number    // Requests per hour (default: 100)
  },
  tools: {
    webSearch: boolean,         // Enable web search
    newsSearch: boolean,        // Enable news search
    videosSearch: boolean,      // Enable video search
    localSearch: boolean,       // Enable local search
    weatherForecast: boolean    // Enable weather
  }
}
```

#### Preset Methods

```javascript
// Optimized configurations
ChatConfig.webSearchMode();    // Web search enabled
ChatConfig.newsMode();         // News search enabled
ChatConfig.localMode();        // Local + weather enabled
ChatConfig.highVolumeMode();   // Higher rate limits
```

---

## Constants

### Models

Available AI models.

```javascript
import { Models } from 'duckduckgo-chat-interface';

Models.GPT4Mini    // 'gpt-4o-mini' (WebSearch + Images)
Models.Claude3     // 'claude-3-haiku-20240307'
Models.Llama       // 'meta-llama/Llama-3.3-70B-Instruct-Turbo'
Models.Mixtral     // 'mistralai/Mistral-Small-24B-Instruct-2501'
Models.O4Mini      // 'o4-mini'
```

---

## Interfaces

### ImageContent

For sending images with messages.

```javascript
interface ImageContent {
  base64: string;      // Base64 encoded image data
  mimeType: string;    // MIME type (e.g., 'image/jpeg')
}
```

### Message

Conversation message format.

```javascript
interface Message {
  role: 'user' | 'assistant';
  content: string;
}
```

### ToolConfig

Tool configuration options.

```javascript
interface ToolConfig {
  webSearch?: boolean;
  newsSearch?: boolean;
  videosSearch?: boolean;
  localSearch?: boolean;
  weatherForecast?: boolean;
}
```

---

## Error Handling

The library handles errors automatically with retry logic. Common errors:

- **Rate limit exceeded**: Automatic wait and retry
- **Network timeout**: Automatic retry with backoff
- **Invalid model**: Throws error immediately
- **Missing initialization**: Throws error immediately

```javascript
try {
  const response = await chat.sendMessage("Hello");
} catch (error) {
  console.error('Chat error:', error.message);
}
```

---

## TypeScript Support

Full TypeScript support with complete type definitions:

```typescript
import { DuckDuckGoChat, Models, ChatConfig, ImageContent } from 'duckduckgo-chat-interface';

const chat: DuckDuckGoChat = new DuckDuckGoChat(Models.GPT4Mini);
const response: string = await chat.sendMessage("Hello");
``` 