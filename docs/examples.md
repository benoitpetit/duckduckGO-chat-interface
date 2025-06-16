# Examples

Practical examples for common use cases.

## Basic Examples

### Simple Q&A

```javascript
import { DuckDuckGoChat, Models } from 'duckduckgo-chat-interface';

const chat = new DuckDuckGoChat(Models.GPT4Mini);
await chat.initialize();

const response = await chat.sendMessage("What is the capital of France?");
console.log(response); // "The capital of France is Paris."
```

### Multiple Messages (Conversation)

```javascript
const chat = new DuckDuckGoChat(Models.Claude3);
await chat.initialize();

// First message
await chat.sendMessage("My name is John");

// Follow-up (maintains context)
const response = await chat.sendMessage("What's my name?");
console.log(response); // "Your name is John."
```

---

## WebSearch Examples

### Latest News

```javascript
import { DuckDuckGoChat, Models, ChatConfig } from 'duckduckgo-chat-interface';

const config = ChatConfig.webSearchMode();
const chat = new DuckDuckGoChat(Models.GPT4Mini, config);
await chat.initialize();

chat.enableWebSearch();

const response = await chat.sendMessage("What are the latest AI developments in 2024?");
console.log(response); // Recent news with sources
```

### Research Query

```javascript
const chat = new DuckDuckGoChat(Models.GPT4Mini);
await chat.initialize();

chat.enableWebSearch();

const response = await chat.sendMessage(
  "Compare the performance of electric vs gas cars in 2024"
);
console.log(response); // Detailed comparison with current data
```

---

## Image Analysis

### Analyze Image

```javascript
import fs from 'fs';

const chat = new DuckDuckGoChat(Models.GPT4Mini);
await chat.initialize();

// Load image
const imageData = fs.readFileSync('path/to/image.jpg', 'base64');

const images = [{
  base64: imageData,
  mimeType: 'image/jpeg'
}];

const response = await chat.sendMessage("What do you see in this image?", images);
console.log(response);
```

### OCR (Text Recognition)

```javascript
const images = [{
  base64: documentImageBase64,
  mimeType: 'image/png'
}];

const response = await chat.sendMessage(
  "Extract all text from this document",
  images
);
console.log(response); // Extracted text
```

---

## Streaming Examples

### Real-time Chat

```javascript
const chat = new DuckDuckGoChat(Models.GPT4Mini);
await chat.initialize();

let fullResponse = "";

const response = await chat.sendMessageStream(
  "Tell me a creative story about space exploration",
  (chunk) => {
    process.stdout.write(chunk); // Show progress
    fullResponse += chunk;
  }
);

console.log("\n--- Complete Response ---");
console.log(fullResponse);
```

### Progress Indicator

```javascript
let dots = "";
const response = await chat.sendMessageStream(
  "Explain quantum computing",
  (chunk) => {
    dots += ".";
    process.stdout.write(`\rThinking${dots}`);
  }
);

console.log("\nResponse:", response);
```

---

## Model-Specific Examples

### Code Generation (Llama)

```javascript
const chat = new DuckDuckGoChat(Models.Llama);
await chat.initialize();

const response = await chat.sendMessage(`
Create a Python function that calculates fibonacci numbers efficiently.
Include error handling and documentation.
`);

console.log(response); // Optimized Python code
```

### Creative Writing (Claude)

```javascript
const chat = new DuckDuckGoChat(Models.Claude3);
await chat.initialize();

const response = await chat.sendMessage(`
Write a short poem about the beauty of coding.
Make it inspiring and metaphorical.
`);

console.log(response); // Creative poem
```

### Fast Responses (o4-mini)

```javascript
const chat = new DuckDuckGoChat(Models.O4Mini);
await chat.initialize();

const response = await chat.sendMessage("Quick fact about JavaScript");
console.log(response); // Fast, concise answer
```

---

## Advanced Configuration

### Custom Rate Limiting

```javascript
const config = new ChatConfig({
  rateLimiting: {
    enabled: true,
    maxRequestsPerMinute: 5,  // Slower rate
    maxRequestsPerHour: 50
  },
  enableLogging: true
});

const chat = new DuckDuckGoChat(Models.GPT4Mini, config);
```

### Multiple Tools Enabled

```javascript
const config = new ChatConfig({
  tools: {
    webSearch: true,
    newsSearch: true,
    localSearch: true,
    weatherForecast: true
  }
});

const chat = new DuckDuckGoChat(Models.GPT4Mini, config);
await chat.initialize();

// Configure all tools
chat.enableWebSearch();
chat.enableNewsSearch();
chat.enableLocalFeatures();

const response = await chat.sendMessage("Weather in New York and latest tech news");
```

---

## Error Handling

### Basic Error Handling

```javascript
try {
  const chat = new DuckDuckGoChat(Models.GPT4Mini);
  await chat.initialize();
  
  const response = await chat.sendMessage("Hello");
  console.log(response);
} catch (error) {
  console.error('Error:', error.message);
}
```

### Retry Logic

```javascript
const config = new ChatConfig({
  maxRetries: 5,
  retryDelay: 2000,
  timeout: 60000
});

const chat = new DuckDuckGoChat(Models.GPT4Mini, config);

try {
  await chat.initialize();
  const response = await chat.sendMessage("Complex query");
  console.log(response);
} catch (error) {
  console.error('Failed after retries:', error.message);
}
```

---

## Utility Examples

### Check Model Capabilities

```javascript
const chat = new DuckDuckGoChat(Models.GPT4Mini);

console.log('Supports images:', chat.supportsImages()); // true
console.log('Supports tools:', chat.supportsAdvancedTools()); // true

// Switch to different model
chat.setModel(Models.Claude3);
console.log('Supports images:', chat.supportsImages()); // false
```

### Conversation Management

```javascript
const chat = new DuckDuckGoChat(Models.GPT4Mini);
await chat.initialize();

await chat.sendMessage("Remember: my favorite color is blue");
await chat.sendMessage("What's my favorite color?"); // "Blue"

// Get conversation history
const history = chat.getHistory();
console.log(`Conversation has ${history.length} messages`);

// Clear conversation
await chat.clear();
const response = await chat.sendMessage("What's my favorite color?");
// Won't remember previous conversation
```

---

## Real-World Use Cases

### Document Analysis

```javascript
// Analyze PDF content (converted to images)
const pages = [image1Base64, image2Base64, image3Base64];

const chat = new DuckDuckGoChat(Models.GPT4Mini);
await chat.initialize();

for (let i = 0; i < pages.length; i++) {
  const images = [{ base64: pages[i], mimeType: 'image/png' }];
  const response = await chat.sendMessage(`Summarize page ${i + 1}`, images);
  console.log(`Page ${i + 1} Summary:`, response);
}
```

### Interactive Assistant

```javascript
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const chat = new DuckDuckGoChat(Models.GPT4Mini);
await chat.initialize();
chat.enableWebSearch();

console.log("Chat started! Type 'exit' to quit.");

const askQuestion = () => {
  rl.question('You: ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }
    
    try {
      const response = await chat.sendMessage(input);
      console.log('Assistant:', response);
    } catch (error) {
      console.log('Error:', error.message);
    }
    
    askQuestion();
  });
};

askQuestion();
``` 