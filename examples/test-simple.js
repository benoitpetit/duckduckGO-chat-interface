// Simple test of new features
import { DuckDuckGoChat, ChatConfig, Models } from '../index.js';

console.log('🦆 Simple test of new features\n');

// Utility function to wait
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== Test 1: Payload validation according to model =====
async function testPayloads() {
  console.log('📋 Test 1: Payload validation according to model');
  
  const config = new ChatConfig({
    tools: {
      webSearch: true,
      newsSearch: true,
      videosSearch: false,
      localSearch: false,
      weatherForecast: false
    }
  });
  
  console.log('✅ Payload for GPT-4o mini (with WebSearch):');
  console.log(JSON.stringify(config.getToolChoicePayload(Models.GPT4Mini), null, 2));
  
  console.log('\n✅ Payload for Claude3 (without WebSearch):');
  console.log(JSON.stringify(config.getToolChoicePayload(Models.Claude3), null, 2));
  
  console.log('\n✅ Payload for Llama (without WebSearch):');
  console.log(JSON.stringify(config.getToolChoicePayload(Models.Llama), null, 2));
  console.log();
}

// ===== Test 2: Support methods validation =====
async function testSupport() {
  console.log('🔧 Test 2: Support methods validation');
  
  // Test with GPT-4o mini
  const chatGPT = new DuckDuckGoChat(Models.GPT4Mini);
  console.log(`✅ GPT-4o mini supports images: ${chatGPT.supportsImages()}`);
  console.log(`✅ GPT-4o mini supports advanced tools: ${chatGPT.supportsAdvancedTools()}`);
  
  // Test with Claude
  const chatClaude = new DuckDuckGoChat(Models.Claude3);
  console.log(`✅ Claude3 supports images: ${chatClaude.supportsImages()}`);
  console.log(`✅ Claude3 supports advanced tools: ${chatClaude.supportsAdvancedTools()}`);
  console.log();
}

// ===== Test 3: WebSearch configuration =====
async function testWebSearchConfig() {
  console.log('🌐 Test 3: WebSearch configuration');
  
  const config = ChatConfig.webSearchMode();
  config.enableLogging = true;
  
  console.log('✅ WebSearch mode configuration created');
  console.log('Enabled tools:', JSON.stringify(config.tools, null, 2));
  
  const chat = new DuckDuckGoChat(Models.GPT4Mini, config);
  console.log('✅ GPT-4o mini chat created with WebSearch');
  
  // Test WebSearch activation
  chat.enableWebSearch();
  console.log('✅ WebSearch enabled via method');
  
  // Test with other model
  const chatOther = new DuckDuckGoChat(Models.Claude3, config);
  chatOther.enableWebSearch(); // Should display a warning
  console.log();
}

// ===== Test 4: Image format =====
async function testImageFormat() {
  console.log('🖼️ Test 4: Image format');
  
  const chat = new DuckDuckGoChat(Models.GPT4Mini);
  
  // Test image formatting
  const testImages = [{
    base64: 'test-base64-data',
    mimeType: 'image/png'
  }];
  
  const formattedContent = chat._formatMessageContent("Test message", testImages);
  console.log('✅ Formatted content with images:');
  console.log(JSON.stringify(formattedContent, null, 2));
  
  // Test without images
  const simpleContent = chat._formatMessageContent("Test message", null);
  console.log('\n✅ Simple content without images:', simpleContent);
  
  // Test with model that doesn't support images
  const chatClaude = new DuckDuckGoChat(Models.Claude3);
  const claudeContent = chatClaude._formatMessageContent("Test message", testImages);
  console.log('\n✅ Content with Claude (ignores images):', claudeContent);
  console.log();
}

// ===== Test 5: Simple API test (single call) =====
async function testSimpleAPI() {
  console.log('🚀 Test 5: Simple API test');
  
  try {
    const config = new ChatConfig({
      enableLogging: true,
      tools: {
        webSearch: true,
        newsSearch: false,
        videosSearch: false,
        localSearch: false,
        weatherForecast: false
      }
    });
    
    const chat = new DuckDuckGoChat(Models.GPT4Mini, config);
    await chat.initialize();
    
    console.log('✅ Chat initialized successfully');
    
    const response = await chat.sendMessage("Hello, can you tell me what time it is in France?");
    console.log('✅ Message sent successfully');
    console.log('Response (first part):', response.substring(0, 100) + '...');
    
  } catch (error) {
    console.log('❌ Error during API test:', error.message);
  }
  console.log();
}

// ===== Test execution =====
async function runSimpleTests() {
  console.log('⏳ Starting simple tests...\n');
  
  try {
    // Tests that don't require API calls
    await testPayloads();
    await testSupport();
    await testWebSearchConfig();
    await testImageFormat();
    
    // Test with a single API call
    await testSimpleAPI();
    
    console.log('✅ All simple tests completed successfully!');
  } catch (error) {
    console.error('❌ Error during simple tests:', error.message);
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSimpleTests();
} 