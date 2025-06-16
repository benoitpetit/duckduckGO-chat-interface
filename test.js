import { DuckDuckGoChat, Models } from './index.js';

async function testBasicUsage() {
  console.log('🧪 Test d\'utilisation basique...');
  
  try {
    const chat = new DuckDuckGoChat(Models.GPT4Mini);
    await chat.initialize();
    
    console.log('✅ Initialisation réussie');
    
    const response = await chat.sendMessage("Bonjour ! Pouvez-vous me dire bonjour en retour ?");
    console.log('✅ Message envoyé, réponse reçue:');
    console.log(response.substring(0, 100) + '...');
    
    const history = chat.getHistory();
    console.log(`✅ Historique: ${history.length} messages`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

async function testStreamUsage() {
  console.log('\n🧪 Test d\'utilisation avec streaming...');
  
  try {
    const chat = new DuckDuckGoChat(Models.Claude3);
    await chat.initialize();
    
    console.log('✅ Initialisation réussie');
    
    let chunks = 0;
    const response = await chat.sendMessageStream(
      "Comptez de 1 à 5",
      (chunk) => {
        chunks++;
        process.stdout.write('.');
      }
    );
    
    console.log(`\n✅ Streaming terminé, ${chunks} chunks reçus`);
    console.log('Réponse:', response.substring(0, 100) + '...');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

async function testModelSwitching() {
  console.log('\n🧪 Test de changement de modèle...');
  
  try {
    const chat = new DuckDuckGoChat();
    await chat.initialize();
    
    console.log('✅ Modèle par défaut initialisé');
    
    chat.setModel(Models.Llama);
    console.log('✅ Modèle changé vers Llama');
    
    const models = DuckDuckGoChat.getAvailableModels();
    console.log(`✅ ${models.length} modèles disponibles:`, models);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Démarrage des tests du package DuckDuckGo Chat Interface\n');
  
  await testBasicUsage();
  await testStreamUsage();
  await testModelSwitching();
  
  console.log('\n✅ Tests terminés !');
}

runAllTests().catch(console.error);
