export interface ImageContent {
  base64: string;
  mimeType: string;
}

export interface MessageContentText {
  type: 'text';
  text: string;
}

export interface MessageContentImage {
  type: 'image';
  mimeType: string;
  image: string;
}

export type MessageContent = string | (MessageContentText | MessageContentImage)[];

export interface Message {
  role: 'user' | 'assistant';
  content: MessageContent;
}

export interface ToolChoice {
  WebSearch?: boolean;
  NewsSearch: boolean;
  VideosSearch: boolean;
  LocalSearch: boolean;
  WeatherForecast: boolean;
}

export interface ToolConfig {
  webSearch?: boolean;
  newsSearch?: boolean;
  videosSearch?: boolean;
  localSearch?: boolean;
  weatherForecast?: boolean;
}

export interface RateLimitConfig {
  enabled?: boolean;
  maxRequestsPerMinute?: number;
  maxRequestsPerHour?: number;
}

export interface ChatConfigOptions {
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  rateLimiting?: RateLimitConfig;
  tools?: ToolConfig;
  userAgent?: string;
  language?: string;
  enableLogging?: boolean;
}

export declare class ChatConfig {
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  rateLimiting: {
    enabled: boolean;
    maxRequestsPerMinute: number;
    maxRequestsPerHour: number;
    _requestTimes: number[];
    _hourlyRequestTimes: number[];
  };
  tools: {
    webSearch: boolean;
    newsSearch: boolean;
    videosSearch: boolean;
    localSearch: boolean;
    weatherForecast: boolean;
  };
  userAgent: string;
  language: string;
  enableLogging: boolean;

  constructor(options?: ChatConfigOptions);
  
  canMakeRequest(): boolean;
  recordRequest(): void;
  getWaitTimeMs(): number;
  getToolChoicePayload(model?: string): ToolChoice;
  setAllTools(enabled: boolean): void;
  log(message: string, level?: string): void;
  
  static webSearchMode(): ChatConfig;
  static newsMode(): ChatConfig;
  static localMode(): ChatConfig;
  static highVolumeMode(): ChatConfig;
}

export interface Metadata {
  toolChoice: ToolChoice;
}

export interface ChatPayload {
  model: string;
  metadata: Metadata;
  messages: Message[];
  canUseTools: boolean;
}

export declare const Models: {
  readonly GPT4Mini: 'gpt-4o-mini';
  readonly Claude3: 'claude-3-haiku-20240307';
  readonly Llama: 'meta-llama/Llama-3.3-70B-Instruct-Turbo';
  readonly Mixtral: 'mistralai/Mistral-Small-24B-Instruct-2501';
  readonly O4Mini: 'o4-mini';
};

export declare class DuckDuckGoChat {
  constructor(model?: string, config?: ChatConfig);
  
  /**
   * Initialize the chat session
   */
  initialize(): Promise<DuckDuckGoChat>;
  
  /**
   * Send a message and return the complete response
   */
  sendMessage(content: string, images?: ImageContent[]): Promise<string>;
  
  /**
   * Send a message and return a stream with callback
   */
  sendMessageStream(content: string, onChunk?: (chunk: string) => void, images?: ImageContent[]): Promise<string>;
  
  /**
   * Configure available tools for next requests
   */
  configureTools(toolConfig: ToolConfig): void;
  
  /**
   * Enable web search (GPT-4o mini only)
   */
  enableWebSearch(): void;
  
  /**
   * Enable news search
   */
  enableNewsSearch(): void;
  
  /**
   * Enable local search and weather features
   */
  enableLocalFeatures(): void;
  
  /**
   * Check if the current model supports images
   */
  supportsImages(): boolean;
  
  /**
   * Check if the current model supports advanced tools
   */
  supportsAdvancedTools(): boolean;
  
  /**
   * Clear conversation history
   */
  clear(): Promise<void>;
  
  /**
   * Change the model used
   */
  setModel(model: string): void;
  
  /**
   * Get message history
   */
  getHistory(): Message[];
  
  /**
   * Get available models
   */
  static getAvailableModels(): string[];
}

export default DuckDuckGoChat;
