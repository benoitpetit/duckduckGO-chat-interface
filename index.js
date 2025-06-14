import fetch from 'node-fetch';
import { CookieJar } from 'tough-cookie';

/**
 * Modèles disponibles pour le chat DuckDuckGo
 */
export const Models = {
  GPT4Mini: 'gpt-4o-mini',
  Claude3: 'claude-3-haiku-20240307',
  Llama: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
  Mixtral: 'mistralai/Mistral-Small-24B-Instruct-2501',
  O4Mini: 'o4-mini'
};

/**
 * URLs de l'API DuckDuckGo
 */
const API_URLS = {
  STATUS: 'https://duckduckgo.com/duckchat/v1/status',
  CHAT: 'https://duckduckgo.com/duckchat/v1/chat'
};

/**
 * Headers dynamiques extraits de la rétro-ingénierie
 */
const DYNAMIC_HEADERS = {
  FE_SIGNALS: 'eyJzdGFydCI6MTc0OTgyODU3NzE1NiwiZXZlbnRzIjpbeyJuYW1lIjoic3RhcnROZXdDaGF0IiwiZGVsdGEiOjYwfV0sImVuZCI6NTM4MX0=',
  FE_VERSION: 'serp_20250613_094749_ET-cafd73f97f51c983eb30',
  VQD_HASH_1: 'eyJzZXJ2ZXJfaGFzaGVzIjpbIm5oWlUrcVZ3d3dzODFPVStDTm4vVkZJcS9DbXBSeGxYY2E5cHpGQ0JVZUk9IiwiajRNNmNBRzRheVFqQ21kWkN0a1IzOFY3eVRpd1gvZ2RmcDFueFhEdlV3cz0iXSwiY2xpZW50X2hhc2hlcyI6WyJpRTNqeXRnSm0xZGJaZlo1bW81M1NmaVAxdXUxeEdzY0F5RnB3V2NVOUtrPSIsInJaRGtaR2h4S0JEL1JuY00xVVNraHZNM3pLdEJzQmlzSlJTWFF4L2QzRFU9Il0sInNpZ25hbHMiOnt9LCJtZXRhIjp7InYiOiIzIiwiY2hhbGxlbmdlX2lkIjoiODU3NjA5YjlmMTg2NThlMWM0MzZhZWI2MGM0MDc1ZjdhYWNmYmI0OTlhY2Y4NTVmNDJkNWRjZmM5MTViNDhiOGg4amJ0IiwidGltZXN0YW1wIjoiMTc0OTgyODU3NjQ5NyIsIm9yaWdpbiI6Imh0dHBzOi8vZHVja2R1Y2tnby5jb20iLCJzdGFjayI6IkVycm9yXG5hdCBiYSAoaHR0cHM6Ly9kdWNrZHVja2dvLmNvbS9kaXN0L3dwbS5jaGF0LmNhZmQ3M2Y5N2Y1MWM5ODNlYjMwLmpzOjE6NzQ4MDMpXG5hdCBhc3luYyBkaXNwYXRjaFNlcnZpY2VJbml0aWFsVlFEIChodHRwczovL2R1Y2tkdWNrZ28uY29tL2Rpc3Qvd3BtLmNoYXQuY2FmZDczZjk3ZjUxYzk4M2ViMzAuanM6MTo5OTUyOSkifX0='
};

/**
 * Configuration des cookies nécessaires
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
 * Obtient le token VQD nécessaire pour l'authentification
 */
async function getVQD() {
  try {
    const cookieJar = new CookieJar();
    
    // Ajouter les cookies requis
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
    console.error('Erreur lors de la récupération du VQD:', error);
    return null;
  }
}

/**
 * Classe principale pour gérer une session de chat
 */
export class DuckDuckGoChat {
  constructor(model = Models.GPT4Mini) {
    this.model = model;
    this.messages = [];
    this.vqd = null;
    this.retryCount = 0;
    this.cookieJar = new CookieJar();
    this._initializeCookies();
  }

  /**
   * Initialise les cookies requis
   */
  async _initializeCookies() {
    for (const cookie of REQUIRED_COOKIES) {
      await this.cookieJar.setCookie(`${cookie.name}=${cookie.value}; Domain=.duckduckgo.com`, 'https://duckduckgo.com');
    }
  }

  /**
   * Initialise la session de chat
   */
  async initialize() {
    this.vqd = await getVQD();
    if (!this.vqd) {
      throw new Error('Impossible d\'obtenir le token VQD');
    }
    return this;
  }

  /**
   * Envoie un message et retourne la réponse complète
   */
  async sendMessage(content) {
    if (!this.vqd) {
      await this.initialize();
    }

    // Ajouter le message utilisateur à l'historique
    this.messages.push({
      role: 'user',
      content: content
    });

    const payload = {
      model: this.model,
      metadata: {
        toolChoice: {
          NewsSearch: false,
          VideosSearch: false,
          LocalSearch: false,
          WeatherForecast: false
        }
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
        // Gestion des erreurs avec retry automatique
        if (response.status === 418 || response.status === 429) {
          if (this.retryCount < 3) {
            this.retryCount++;
            console.log(`🔄 Retry automatique (tentative ${this.retryCount}/3)...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.vqd = await getVQD();
            return this.sendMessage(content);
          }
        }
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      // Mettre à jour le VQD pour les prochaines requêtes
      const newVqd = response.headers.get('x-vqd-4');
      if (newVqd) {
        this.vqd = newVqd;
      }

      this.retryCount = 0;

      // Traiter le streaming
      const fullResponse = await this._processStreamResponse(response);
      
      // Ajouter la réponse à l'historique
      this.messages.push({
        role: 'assistant',
        content: fullResponse
      });

      return fullResponse;
    } catch (error) {
      throw new Error(`Erreur lors de l'envoi du message: ${error.message}`);
    }
  }

  /**
   * Envoie un message et retourne un stream
   */
  async sendMessageStream(content, onChunk) {
    if (!this.vqd) {
      await this.initialize();
    }

    // Ajouter le message utilisateur à l'historique
    this.messages.push({
      role: 'user',
      content: content
    });

    const payload = {
      model: this.model,
      metadata: {
        toolChoice: {
          NewsSearch: false,
          VideosSearch: false,
          LocalSearch: false,
          WeatherForecast: false
        }
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
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      // Mettre à jour le VQD
      const newVqd = response.headers.get('x-vqd-4');
      if (newVqd) {
        this.vqd = newVqd;
      }

      return this._processStreamResponseWithCallback(response, onChunk);
    } catch (error) {
      throw new Error(`Erreur lors de l'envoi du message: ${error.message}`);
    }
  }

  /**
   * Traite la réponse en streaming et retourne le contenu complet
   */
  async _processStreamResponse(response) {
    let fullResponse = '';
    const decoder = new TextDecoder();

    return new Promise((resolve, reject) => {
      let buffer = '';

      response.body.on('data', (chunk) => {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split('\n');
        
        // Garder la dernière ligne incomplète dans le buffer
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
   * Traite la réponse en streaming avec callback
   */
  async _processStreamResponseWithCallback(response, onChunk) {
    let fullResponse = '';
    const decoder = new TextDecoder();

    return new Promise((resolve, reject) => {
      let buffer = '';

      response.body.on('data', (chunk) => {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split('\n');
        
        // Garder la dernière ligne incomplète dans le buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === 'data: [DONE]') {
            // Ajouter la réponse complète à l'historique
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
        // Ajouter la réponse complète à l'historique
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
   * Efface l'historique de la conversation
   */
  async clear() {
    this.messages = [];
    this.vqd = await getVQD();
    this.retryCount = 0;
  }

  /**
   * Change le modèle utilisé
   */
  setModel(model) {
    this.model = model;
  }

  /**
   * Obtient l'historique des messages
   */
  getHistory() {
    return [...this.messages];
  }

  /**
   * Obtient les modèles disponibles
   */
  static getAvailableModels() {
    return Object.values(Models);
  }
}

// Export par défaut
export default DuckDuckGoChat;
