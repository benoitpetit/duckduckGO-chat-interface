// Export des hooks React browser-compatible
export { 
  useDuckDuckGoChat as useReactDuckDuckGoChat,
  useSimpleDuckChat as useReactSimpleDuckChat
} from './react.js';

// Export des composables Vue browser-compatible
export { 
  useDuckDuckGoChat as useVueDuckDuckGoChat,
  useSimpleDuckChat as useVueSimpleDuckChat,
  usePersistentDuckChat as useVuePersistentDuckChat
} from './vue.js';

// Export des utilitaires browser
export { 
  Models,
  BrowserDuckDuckGoChat,
  getVQD,
  sendChatMessage
} from './browser.js';

// Export des types
export * from './types.d.ts'; 