import fetch from 'node-fetch';
import { CookieJar } from 'tough-cookie';

/**
 * Configuration for personnalized chat
 */
export class ChatConfig {
  constructor(options = {}) {
    // General configuration
    this.timeout = options.timeout || 30000; // 30s default
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 2000; // 2s default
    
    // Intelligent rate limiting
    this.rateLimiting = {
      enabled: options.rateLimiting?.enabled ?? true,
      maxRequestsPerMinute: options.rateLimiting?.maxRequestsPerMinute || 10,
      maxRequestsPerHour: options.rateLimiting?.maxRequestsPerHour || 100,
      _requestTimes: [], // Request history
      _hourlyRequestTimes: []
    };
    
    // Configuration duckduckgo tools
    this.tools = {
      webSearch: options.tools?.webSearch ?? false,
      newsSearch: options.tools?.newsSearch ?? false,
      videosSearch: options.tools?.videosSearch ?? false,
      localSearch: options.tools?.localSearch ?? false,
      weatherForecast: options.tools?.weatherForecast ?? false
    };
    
    // Advanced options
    this.userAgent = options.userAgent || 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36';
    this.language = options.language || 'fr-FR,fr;q=0.6';
    this.enableLogging = options.enableLogging ?? false;
  }

  /**
   * Checks if a request can be sent according to rate limiting rules
   */
  canMakeRequest() {
    if (!this.rateLimiting.enabled) return true;

    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const oneHourAgo = now - 3600000;

    // Clean old request history
    this.rateLimiting._requestTimes = this.rateLimiting._requestTimes.filter(time => time > oneMinuteAgo);
    this.rateLimiting._hourlyRequestTimes = this.rateLimiting._hourlyRequestTimes.filter(time => time > oneHourAgo);

    // Check limits
    const requestsLastMinute = this.rateLimiting._requestTimes.length;
    const requestsLastHour = this.rateLimiting._hourlyRequestTimes.length;

    return requestsLastMinute < this.rateLimiting.maxRequestsPerMinute && 
           requestsLastHour < this.rateLimiting.maxRequestsPerHour;
  }

  /**
   * Records a new request in the history
   */
  recordRequest() {
    if (!this.rateLimiting.enabled) return;

    const now = Date.now();
    this.rateLimiting._requestTimes.push(now);
    this.rateLimiting._hourlyRequestTimes.push(now);
  }

  /**
   * Calculates wait time before next possible request
   */
  getWaitTimeMs() {
    if (!this.rateLimiting.enabled || this.canMakeRequest()) return 0;

    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Find oldest request within the minute
    const oldestRequestInMinute = this.rateLimiting._requestTimes
      .filter(time => time > oneMinuteAgo)
      .sort()[0];

    if (oldestRequestInMinute) {
      return Math.max(0, oldestRequestInMinute + 60000 - now);
    }

    return 0;
  }

  /**
   * Converts tool configuration to DuckDuckGo API format
   * Available tools vary by model
   */
  getToolChoicePayload(model = Models.GPT4Mini) {
    const baseTools = {
      NewsSearch: this.tools.newsSearch,
      VideosSearch: this.tools.videosSearch,
      LocalSearch: this.tools.localSearch,
      WeatherForecast: this.tools.weatherForecast
    };

    // WebSearch is only available for GPT-4o mini
    if (model === Models.GPT4Mini) {
      return {
        WebSearch: this.tools.webSearch,
        ...baseTools
      };
    }

    return baseTools;
  }

  /**
   * Enables or disables all tools
   */
  setAllTools(enabled) {
    this.tools.webSearch = enabled;
    this.tools.newsSearch = enabled;
    this.tools.videosSearch = enabled;
    this.tools.localSearch = enabled;
    this.tools.weatherForecast = enabled;
  }

  /**
   * Predefined configuration for web search (GPT-4o mini only)
   */
  static webSearchMode() {
    return new ChatConfig({
      tools: {
        webSearch: true,
        newsSearch: false,
        videosSearch: false,
        localSearch: false,
        weatherForecast: false
      }
    });
  }

  /**
   * Predefined configuration for news search
   */
  static newsMode() {
    return new ChatConfig({
      tools: {
        webSearch: false,
        newsSearch: true,
        videosSearch: false,
        localSearch: false,
        weatherForecast: false
      }
    });
  }

  /**
   * Predefined configuration for local search and weather
   */
  static localMode() {
    return new ChatConfig({
      tools: {
        webSearch: false,
        newsSearch: false,
        videosSearch: false,
        localSearch: true,
        weatherForecast: true
      }
    });
  }

  /**
   * Predefined configuration for high volume usage
   */
  static highVolumeMode() {
    return new ChatConfig({
      rateLimiting: {
        enabled: true,
        maxRequestsPerMinute: 20,
        maxRequestsPerHour: 500
      },
      maxRetries: 5,
      retryDelay: 1000
    });
  }

  /**
   * Logs information if logging is enabled
   */
  log(message, level = 'info') {
    if (this.enableLogging) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    }
  }
}

/**
 * Available models for DuckDuckGo chat
 */
export const Models = {
  GPT4Mini: 'gpt-4o-mini',
  Claude3: 'claude-3-haiku-20240307',
  Llama: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
  Mixtral: 'mistralai/Mistral-Small-24B-Instruct-2501',
  O4Mini: 'o4-mini'
};

/**
 * DuckDuckGo API URLs
 */
const API_URLS = {
  STATUS: 'https://duckduckgo.com/duckchat/v1/status',
  CHAT: 'https://duckduckgo.com/duckchat/v1/chat'
};

/**
 * Dynamic headers extracted from reverse engineering
 */
const DYNAMIC_HEADERS = {
  FE_SIGNALS: 'eyJzdGFydCI6MTc0OTgyODU3NzE1NiwiZXZlbnRzIjpbeyJuYW1lIjoic3RhcnROZXdDaGF0IiwiZGVsdGEiOjYwfV0sImVuZCI6NTM4MX0=',
  FE_VERSION: 'serp_20250613_094749_ET-cafd73f97f51c983eb30',
  VQD_HASH_1: 'eyJzZXJ2ZXJfaGFzaGVzIjpbIm5oWlUrcVZ3d3dzODFPVStDTm4vVkZJcS9DbXBSeGxYY2E5cHpGQ0JVZUk9IiwiajRNNmNBRzRheVFqQ21kWkN0a1IzOFY3eVRpd1gvZ2RmcDFueFhEdlV3cz0iXSwiY2xpZW50X2hhc2hlcyI6WyJpRTNqeXRnSm0xZGJaZlo1bW81M1NmaVAxdXUxeEdzY0F5RnB3V2NVOUtrPSIsInJaRGtaR2h4S0JEL1JuY00xVVNraHZNM3pLdEJzQmlzSlJTWFF4L2QzRFU9Il0sInNpZ25hbHMiOnt9LCJtZXRhIjp7InYiOiIzIiwiY2hhbGxlbmdlX2lkIjoiODU3NjA5YjlmMTg2NThlMWM0MzZhZWI2MGM0MDc1ZjdhYWNmYmI0OTlhY2Y4NTVmNDJkNWRjZmM5MTViNDhiOGg4amJ0IiwidGltZXN0YW1wIjoiMTc0OTgyODU3NjQ5NyIsIm9yaWdpbiI6Imh0dHBzOi8vZHVja2R1Y2tnby5jb20iLCJzdGFjayI6IkVycm9yXG5hdCBiYSAoaHR0cHM6Ly9kdWNrZHVja2dvLmNvbS9kaXN0L3dwbS5jaGF0LmNhZmQ3M2Y5N2Y1MWM5ODNlYjMwLmpzOjE6NzQ4MDMpXG5hdCBhc3luYyBkaXNwYXRjaFNlcnZpY2VJbml0aWFsVlFEIChodHRwczovL2R1Y2tkdWNrZ28uY29tL2Rpc3Qvd3BtLmNoYXQuY2FmZDczZjk3ZjUxYzk4M2ViMzAuanM6MTo5OTUyOSkifX0='
};

/**
 * Required cookies configuration
 */
const REQUIRED_COOKIES = [
  { name: '5', value: '1' },
  { name: 'dcm', value: '3' },
  { name: 'dcs', value: '1' },
  { name: 'duckassist-opt-in-count', value: '1' },
  { name: 'isRecentChatOn', value: '1' },
  { name: 'preferredDuckAiModel', value: '3' }
];

/**
 * Gets the VQD token required for authentication
 */
async function getVQD() {
  try {
    const cookieJar = new CookieJar();
    
    // Add required cookies
    for (const cookie of REQUIRED_COOKIES) {
      await cookieJar.setCookie(`${cookie.name}=${cookie.value}; Domain=.duckduckgo.com`, 'https://duckduckgo.com');
    }

    const response = await fetch(API_URLS.STATUS, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'fr-FR,fr;q=0.6',
        'Cache-Control': 'no-store',
        'DNT': '1',
        'Priority': 'u=1, i',
        'Referer': 'https://duckduckgo.com/',
        'Sec-CH-UA': '"Brave";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
        'Sec-CH-UA-Mobile': '?0',
        'Sec-CH-UA-Platform': '"Linux"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-GPC': '1',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
        'x-vqd-accept': '1',
        'Cookie': await cookieJar.getCookieString('https://duckduckgo.com')
      }
    });

    return response.headers.get('x-vqd-4');
  } catch (error) {
    console.error('Error retrieving VQD:', error);
    return null;
  }
}

/**
 * Main class for managing a chat session
 */
export class DuckDuckGoChat {
  constructor(model = Models.GPT4Mini, config = null) {
    this.model = model;
    this.config = config || new ChatConfig();
    this.messages = [];
    this.vqd = null;
    this.retryCount = 0;
    this.cookieJar = new CookieJar();
    this._initializeCookies();
  }

  /**
   * Initializes required cookies
   */
  async _initializeCookies() {
    for (const cookie of REQUIRED_COOKIES) {
      await this.cookieJar.setCookie(`${cookie.name}=${cookie.value}; Domain=.duckduckgo.com`, 'https://duckduckgo.com');
    }
  }

  /**
   * Initializes the chat session
   */
  async initialize() {
    this.vqd = await getVQD();
    if (!this.vqd) {
      throw new Error('Unable to obtain VQD token');
    }
    return this;
  }

  /**
   * Sends a message and returns the complete response
   */
  async sendMessage(content, images = null) {
    // Check rate limiting
    await this._handleRateLimit();

    if (!this.vqd) {
      await this.initialize();
    }

    const messageContent = this._formatMessageContent(content, images);
    this.config.log(`Sending message: ${typeof content === 'string' ? content.substring(0, 50) : 'Message with images'}...`);

    // Add user message to history
    this.messages.push({
      role: 'user',
      content: messageContent
    });

    const payload = {
      model: this.model,
      metadata: {
        toolChoice: this.config.getToolChoicePayload(this.model)
      },
      messages: this.messages,
      canUseTools: true
    };

    try {
      const response = await fetch(API_URLS.CHAT, {
        method: 'POST',
        headers: {
          'Accept': 'text/event-stream',
          'Accept-Language': 'fr-FR,fr;q=0.6',
          'Content-Type': 'application/json',
          'DNT': '1',
          'Origin': 'https://duckduckgo.com',
          'Priority': 'u=1, i',
          'Referer': 'https://duckduckgo.com/',
          'Sec-CH-UA': '"Brave";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
          'Sec-CH-UA-Mobile': '?0',
          'Sec-CH-UA-Platform': '"Linux"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-GPC': '1',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
          'x-fe-signals': DYNAMIC_HEADERS.FE_SIGNALS,
          'x-fe-version': DYNAMIC_HEADERS.FE_VERSION,
          'x-vqd-4': this.vqd,
          'x-vqd-hash-1': DYNAMIC_HEADERS.VQD_HASH_1,
          'Cookie': await this.cookieJar.getCookieString('https://duckduckgo.com')
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        // Error handling with automatic retry
        if (response.status === 418 || response.status === 429) {
          if (this.retryCount < this.config.maxRetries) {
            this.retryCount++;
            this.config.log(`🔄 Automatic retry (attempt ${this.retryCount}/${this.config.maxRetries})...`, 'warn');
            await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
            this.vqd = await getVQD();
            return this.sendMessage(content);
          }
        }
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      // Update VQD for next requests
      const newVqd = response.headers.get('x-vqd-4');
      if (newVqd) {
        this.vqd = newVqd;
      }

      this.retryCount = 0;

      // Process streaming
      const fullResponse = await this._processStreamResponse(response);
      
      // Add response to history
      this.messages.push({
        role: 'assistant',
        content: fullResponse
      });

      return fullResponse;
    } catch (error) {
      throw new Error(`Error sending message: ${error.message}`);
    }
  }

  /**
   * Sends a message and returns a stream
   */
  async sendMessageStream(content, onChunk, images = null) {
    // Check rate limiting
    await this._handleRateLimit();

    if (!this.vqd) {
      await this.initialize();
    }

    const messageContent = this._formatMessageContent(content, images);
    this.config.log(`Sending streaming message: ${typeof content === 'string' ? content.substring(0, 50) : 'Message with images'}...`);

    // Add user message to history
    this.messages.push({
      role: 'user',
      content: messageContent
    });

    const payload = {
      model: this.model,
      metadata: {
        toolChoice: this.config.getToolChoicePayload(this.model)
      },
      messages: this.messages,
      canUseTools: true
    };

    try {
      const response = await fetch(API_URLS.CHAT, {
        method: 'POST',
        headers: {
          'Accept': 'text/event-stream',
          'Accept-Language': 'fr-FR,fr;q=0.6',
          'Content-Type': 'application/json',
          'DNT': '1',
          'Origin': 'https://duckduckgo.com',
          'Priority': 'u=1, i',
          'Referer': 'https://duckduckgo.com/',
          'Sec-CH-UA': '"Brave";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
          'Sec-CH-UA-Mobile': '?0',
          'Sec-CH-UA-Platform': '"Linux"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-GPC': '1',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
          'x-fe-signals': DYNAMIC_HEADERS.FE_SIGNALS,
          'x-fe-version': DYNAMIC_HEADERS.FE_VERSION,
          'x-vqd-4': this.vqd,
          'x-vqd-hash-1': DYNAMIC_HEADERS.VQD_HASH_1,
          'Cookie': await this.cookieJar.getCookieString('https://duckduckgo.com')
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      // Update VQD
      const newVqd = response.headers.get('x-vqd-4');
      if (newVqd) {
        this.vqd = newVqd;
      }

      return this._processStreamResponseWithCallback(response, onChunk);
    } catch (error) {
      throw new Error(`Error sending message: ${error.message}`);
    }
  }

  /**
   * Processes streaming response and returns complete content
   */
  async _processStreamResponse(response) {
    let fullResponse = '';
    const decoder = new TextDecoder();

    return new Promise((resolve, reject) => {
      let buffer = '';

      response.body.on('data', (chunk) => {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep last incomplete line in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === 'data: [DONE]') {
            resolve(fullResponse);
            return;
          }

          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.message) {
                fullResponse += data.message;
              }
            } catch (error) {
              // Ignorer les erreurs de parsing JSON
            }
          }
        }
      });

      response.body.on('end', () => {
        resolve(fullResponse);
      });

      response.body.on('error', (error) => {
        reject(new Error(`Erreur lecture stream: ${error.message}`));
      });
    });
  }

  /**
   * Processes streaming response with callback
   */
  async _processStreamResponseWithCallback(response, onChunk) {
    let fullResponse = '';
    const decoder = new TextDecoder();

    return new Promise((resolve, reject) => {
      let buffer = '';

      response.body.on('data', (chunk) => {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep last incomplete line in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === 'data: [DONE]') {
            // Add complete response to history
            this.messages.push({
              role: 'assistant',
              content: fullResponse
            });
            resolve(fullResponse);
            return;
          }

          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.message) {
                fullResponse += data.message;
                if (onChunk) {
                  onChunk(data.message);
                }
              }
            } catch (error) {
              // Ignorer les erreurs de parsing JSON
            }
          }
        }
      });

      response.body.on('end', () => {
        // Add complete response to history
        this.messages.push({
          role: 'assistant',
          content: fullResponse
        });
        resolve(fullResponse);
      });

      response.body.on('error', (error) => {
        reject(new Error(`Erreur lecture stream: ${error.message}`));
      });
    });
  }

  /**
   * Formats message content to support images (GPT-4o mini only)
   */
  _formatMessageContent(content, images = null) {
    // If no images or model doesn't support images, return simple text
    if (!images || !Array.isArray(images) || this.model !== Models.GPT4Mini) {
      return content;
    }

    // Format for GPT-4o mini with images
    const contentArray = [
      {
        type: "text",
        text: content
      }
    ];

    // Add images in required format
    for (const image of images) {
      if (image.base64 && image.mimeType) {
        contentArray.push({
          type: "image",
          mimeType: image.mimeType,
          image: `data:${image.mimeType};base64,${image.base64}`
        });
      }
    }

    return contentArray;
  }

  /**
   * Handles rate limiting before sending a request
   */
  async _handleRateLimit() {
    if (!this.config.canMakeRequest()) {
      const waitTime = this.config.getWaitTimeMs();
      if (waitTime > 0) {
        this.config.log(`⏳ Rate limit reached, waiting ${waitTime}ms...`, 'warn');
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  /**
   * Configures available tools for next requests
   */
  configureTools(toolConfig) {
    Object.assign(this.config.tools, toolConfig);
    this.config.log(`🔧 Tools configured: ${JSON.stringify(this.config.tools)}`);
  }

  /**
   * Enables web search (GPT-4o mini only)
   */
  enableWebSearch() {
    if (this.model === Models.GPT4Mini) {
      this.config.tools.webSearch = true;
      this.config.log('🌐 Web search enabled');
    } else {
      this.config.log('⚠️ Web search is only available for GPT-4o mini', 'warn');
    }
  }

  /**
   * Enables news search
   */
  enableNewsSearch() {
    this.config.tools.newsSearch = true;
    this.config.log('📰 News search enabled');
  }

  /**
   * Enables local search and weather
   */
  enableLocalFeatures() {
    this.config.tools.localSearch = true;
    this.config.tools.weatherForecast = true;
    this.config.log('🌍 Local features enabled');
  }

  /**
   * Checks if current model supports images
   */
  supportsImages() {
    return this.model === Models.GPT4Mini;
  }

  /**
   * Checks if current model supports advanced tools
   */
  supportsAdvancedTools() {
    return this.model === Models.GPT4Mini;
  }

  /**
   * Clears conversation history
   */
  async clear() {
    this.messages = [];
    this.vqd = await getVQD();
    this.retryCount = 0;
    this.config.log('🧹 History cleared');
  }

  /**
   * Changes the used model
   */
  setModel(model) {
    this.model = model;
  }

  /**
   * Gets message history
   */
  getHistory() {
    return [...this.messages];
  }

  /**
   * Gets available models
   */
  static getAvailableModels() {
    return Object.values(Models);
  }
}

// Default export
export default DuckDuckGoChat;
