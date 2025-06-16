// Examples of using DuckDuckGo interface with advanced configuration
import { DuckDuckGoChat, ChatConfig, Models } from '../index.js';

console.log('🦆 Testing DuckDuckGo Chat interface with advanced configuration\n');

// ===== Example 1: Basic configuration =====
async function basicExample() {
  console.log('📝 Example 1: Basic configuration');
  
  const chat = new DuckDuckGoChat(Models.GPT4Mini);
  await chat.initialize();
  
  const response = await chat.sendMessage("Hello, how are you?");
  console.log('Response:', response.substring(0, 100) + '...\n');
}

// ===== Example 2: Configuration with logging =====
async function exampleWithLogging() {
  console.log('📝 Example 2: Configuration with logging');
  
  const config = new ChatConfig({
    enableLogging: true,
    timeout: 10000,
    maxRetries: 2
  });
  
  const chat = new DuckDuckGoChat(Models.Claude3, config);
  await chat.initialize();
  
  const response = await chat.sendMessage("Explain artificial intelligence");
  console.log('Response with logging:', response.substring(0, 100) + '...\n');
}

// ===== Example 3: Tool configuration for news =====
async function newsExample() {
  console.log('📝 Example 3: News search');
  
  const config = ChatConfig.newsMode();
  config.enableLogging = true;
  
  const chat = new DuckDuckGoChat(Models.GPT4Mini, config);
  await chat.initialize();
  
  // Enable news search
  chat.enableNewsSearch();
  
  const response = await chat.sendMessage("What are the latest technology news?");
  console.log('News response:', response.substring(0, 150) + '...\n');
}

// ===== Example 4: Local configuration and weather =====
async function localExample() {
  console.log('📝 Example 4: Local features and weather');
  
  const config = ChatConfig.localMode();
  config.enableLogging = true;
  
  const chat = new DuckDuckGoChat(Models.Mixtral, config);
  await chat.initialize();
  
  // Enable local features
  chat.enableLocalFeatures();
  
  const response = await chat.sendMessage("What's the weather like in Paris today?");
  console.log('Weather response:', response.substring(0, 150) + '...\n');
}

// ===== Example 5: Custom tool configuration =====
async function customToolsExample() {
  console.log('📝 Example 5: Custom tool configuration');
  
  const config = new ChatConfig({
    enableLogging: true,
    tools: {
      newsSearch: true,
      videosSearch: true,
      localSearch: false,
      weatherForecast: false
    }
  });
  
  const chat = new DuckDuckGoChat(Models.Llama, config);
  await chat.initialize();
  
  // Manual tool configuration
  chat.configureTools({
    newsSearch: true,
    videosSearch: true,
    localSearch: false,
    weatherForecast: false
  });
  
  const response = await chat.sendMessage("Find me videos about machine learning");
  console.log('Video response:', response.substring(0, 150) + '...\n');
}

// ===== Example 6: Rate limiting for intensive usage =====
async function rateLimitingExample() {
  console.log('📝 Example 6: Rate limiting test');
  
  const config = new ChatConfig({
    enableLogging: true,
    rateLimiting: {
      enabled: true,
      maxRequestsPerMinute: 3, // Very low limit for demo
      maxRequestsPerHour: 10
    },
    retryDelay: 1000
  });
  
  const chat = new DuckDuckGoChat(Models.GPT4Mini, config);
  await chat.initialize();
  
  // Send multiple messages to test rate limiting
  console.log('Sending 5 messages to test rate limiting...');
  
  for (let i = 1; i <= 5; i++) {
    try {
      const start = Date.now();
      const response = await chat.sendMessage(`Test message number ${i}`);
      const duration = Date.now() - start;
      console.log(`Message ${i}: Received in ${duration}ms - ${response.substring(0, 50)}...`);
    } catch (error) {
      console.log(`Message ${i}: Error - ${error.message}`);
    }
  }
  console.log();
}

// ===== Example 7: High performance configuration =====
async function highPerformanceExample() {
  console.log('📝 Example 7: High performance configuration');
  
  const config = ChatConfig.highVolumeMode();
  config.enableLogging = true;
  
  const chat = new DuckDuckGoChat(Models.O4Mini, config);
  await chat.initialize();
  
  const response = await chat.sendMessage("Summarize the benefits of AI in one sentence");
  console.log('High performance response:', response + '\n');
}

// Utility function to wait
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== Execute all examples =====
async function runAllExamples() {
  try {
    console.log('⏳ Starting examples with delays to respect API...\n');
    
    await basicExample();
    console.log('⏳ Waiting 3 seconds...\n');
    await sleep(3000);
    
    await exampleWithLogging();
    console.log('⏳ Waiting 3 seconds...\n');
    await sleep(3000);
    
    await newsExample();
    console.log('⏳ Waiting 4 seconds...\n');
    await sleep(4000);
    
    await localExample();
    console.log('⏳ Waiting 4 seconds...\n');
    await sleep(4000);
    
    await customToolsExample();
    console.log('⏳ Waiting 4 seconds...\n');
    await sleep(4000);
    
    await rateLimitingExample();
    console.log('⏳ Waiting 3 seconds...\n');
    await sleep(3000);
    
    await highPerformanceExample();
    
    console.log('✅ All examples executed successfully!');
  } catch (error) {
    console.error('❌ Error during example execution:', error.message);
  }
}

// Execute if file is called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples();
}