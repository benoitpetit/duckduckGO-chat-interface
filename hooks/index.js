// Export des hooks React
export { 
  useDuckDuckGoChat as useReactDuckDuckGoChat,
  useSimpleDuckChat as useReactSimpleDuckChat
} from './react.js';

// Export des composables Vue
export { 
  useDuckDuckGoChat as useVueDuckDuckGoChat,
  useSimpleDuckChat as useVueSimpleDuckChat,
  usePersistentDuckChat as useVuePersistentDuckChat
} from './vue.js';

// Export des types
export * from './types.d.ts';

// Re-export des modèles et classes principales pour faciliter l'import
export { Models, DuckDuckGoChat } from '../index.js'; 