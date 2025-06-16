// Test of advanced features: WebSearch and Images for GPT-4o mini
import { DuckDuckGoChat, ChatConfig, Models } from '../index.js';
import { readFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Advanced DuckDuckGo Chat features test\n');

// ===== Test 1: WebSearch with GPT-4o mini =====
async function testWebSearch() {
  console.log('🌐 Test 1: WebSearch with GPT-4o mini');
  
  const config = ChatConfig.webSearchMode();
  config.enableLogging = true;
  
  const chat = new DuckDuckGoChat(Models.GPT4Mini, config);
  await chat.initialize();
  
  console.log('Model supports advanced tools:', chat.supportsAdvancedTools());
  
  // Enable web search
  chat.enableWebSearch();
  
  const response = await chat.sendMessage("What are the latest news about artificial intelligence today?");
  console.log('Response with WebSearch:', response.substring(0, 200) + '...\n');
}

// ===== Test 2: WebSearch with other model (should fail) =====
async function testWebSearchWithOtherModel() {
  console.log('⚠️ Test 2: WebSearch with Claude (should display a warning)');
  
  const config = new ChatConfig({ enableLogging: true });
  const chat = new DuckDuckGoChat(Models.Claude3, config);
  await chat.initialize();
  
  console.log('Model supports advanced tools:', chat.supportsAdvancedTools());
  
  // Try to enable web search (should display a warning)
  chat.enableWebSearch();
  
  console.log();
}

// ===== Test 3: Image support (simulated) =====
async function testImageSupport() {
  console.log('🖼️ Test 3: Image support with GPT-4o mini');
  
  const config = new ChatConfig({ enableLogging: true });
  const chat = new DuckDuckGoChat(Models.GPT4Mini, config);
  await chat.initialize();
  
  console.log('Model supports images:', chat.supportsImages());
  
  // Simulate a base64 image (small transparent pixel)
  const fakeImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  
  const images = [{
    base64: fakeImageBase64,
    mimeType: 'image/png'
  }];
  
  try {
    const response = await chat.sendMessage("Describe this image", images);
    console.log('Response with image:', response.substring(0, 150) + '...\n');
  } catch (error) {
    console.log('Error with image:', error.message + '\n');
  }
}

// ===== Test 4: All tools configuration for GPT-4o mini =====
async function testAllToolsGPT4() {
  console.log('🔧 Test 4: All tools with GPT-4o mini');
  
  const config = new ChatConfig({
    enableLogging: true,
    tools: {
      webSearch: true,
      newsSearch: true,
      videosSearch: true,
      localSearch: true,
      weatherForecast: true
    }
  });
  
  const chat = new DuckDuckGoChat(Models.GPT4Mini, config);
  await chat.initialize();
  
  const response = await chat.sendMessage("Find me information about the weather in Paris and the latest technology news");
  console.log('Response with all tools:', response.substring(0, 200) + '...\n');
}

// ===== Test 5: Payload comparison according to model =====
async function testPayloadComparison() {
  console.log('📋 Test 5: Payload comparison according to model');
  
  const config = new ChatConfig({
    enableLogging: true,
    tools: {
      webSearch: true,
      newsSearch: true,
      videosSearch: false,
      localSearch: false,
      weatherForecast: false
    }
  });
  
  console.log('Payload for GPT-4o mini:', JSON.stringify(config.getToolChoicePayload(Models.GPT4Mini), null, 2));
  console.log('Payload for Claude3:', JSON.stringify(config.getToolChoicePayload(Models.Claude3), null, 2));
  console.log('Payload for Llama:', JSON.stringify(config.getToolChoicePayload(Models.Llama), null, 2));
  console.log();
}

// ===== Test 6: Rate limiting with GPT-4o mini =====
async function testRateLimitingAdvanced() {
  console.log('⏱️ Test 6: Rate limiting with advanced features');
  
  const config = new ChatConfig({
    enableLogging: true,
    rateLimiting: {
      enabled: true,
      maxRequestsPerMinute: 2,
      maxRequestsPerHour: 10
    },
    tools: {
      webSearch: true
    }
  });
  
  const chat = new DuckDuckGoChat(Models.GPT4Mini, config);
  await chat.initialize();
  
  for (let i = 1; i <= 3; i++) {
    try {
      const start = Date.now();
      const response = await chat.sendMessage(`Question ${i}: What time is it?`);
      const duration = Date.now() - start;
      console.log(`Question ${i}: Received in ${duration}ms`);
    } catch (error) {
      console.log(`Question ${i}: Error - ${error.message}`);
    }
  }
  console.log();
}

// ===== Test 7: Stream with images =====
async function testStreamWithImages() {
  console.log('📺 Test 7: Streaming with images');
  
  const config = new ChatConfig({ enableLogging: true });
  const chat = new DuckDuckGoChat(Models.GPT4Mini, config);
  await chat.initialize();
  
  const fakeImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  
  const images = [{
    base64: fakeImageBase64,
    mimeType: 'image/png'
  }];
  
  try {
    console.log('Streaming in progress...');
    let streamedText = '';
    
    const response = await chat.sendMessageStream(
      "Briefly analyze this image",
      (chunk) => {
        streamedText += chunk;
        process.stdout.write(chunk);
      },
      images
    );
    
    console.log('\n\nStream completed. Total length:', response.length);
    console.log();
  } catch (error) {
    console.log('Error during streaming with image:', error.message + '\n');
  }
}

// Utility function to wait
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== Execute all tests =====
async function runAllAdvancedTests() {
  try {
    console.log('⏳ Starting tests with delays to respect the API...\n');
    
    await testWebSearch();
    console.log('⏳ Waiting 5 seconds...\n');
    await sleep(5000);
    
    await testWebSearchWithOtherModel();
    console.log('⏳ Waiting 3 seconds...\n');
    await sleep(3000);
    
    await testImageSupport();
    console.log('⏳ Waiting 5 seconds...\n');
    await sleep(5000);
    
    await testAllToolsGPT4();
    console.log('⏳ Waiting 5 seconds...\n');
    await sleep(5000);
    
    await testPayloadComparison();
    console.log('⏳ Waiting 3 seconds...\n');
    await sleep(3000);
    
    await testRateLimitingAdvanced();
    console.log('⏳ Waiting 5 seconds...\n');
    await sleep(5000);
    
    await testStreamWithImages();
    
    console.log('✅ All advanced tests completed!');
  } catch (error) {
    console.error('❌ Error during advanced tests:', error.message);
    console.error(error.stack);
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllAdvancedTests();
} 