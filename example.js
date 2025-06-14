import { DuckDuckGoChat, Models } from './index.js';

/**
 * Exemple d'utilisation interactive du package DuckDuckGo Chat Interface
 */
async function interactiveExample() {
  console.log('🤖 Exemple d\'utilisation interactive du package DuckDuckGo Chat Interface\n');

  // Créer une nouvelle session avec le modèle GPT-4 Mini
  const chat = new DuckDuckGoChat(Models.GPT4Mini);

  try {
    // Initialiser la session
    console.log('🔄 Initialisation de la session...');
    await chat.initialize();
    console.log('✅ Session initialisée avec succès!\n');

    // Exemple 1: Message simple
    console.log('📝 Exemple 1: Envoi d\'un message simple');
    console.log('Question: "Qu\'est-ce que DuckDuckGo ?"');
    const response1 = await chat.sendMessage("Qu'est-ce que DuckDuckGo ?");
    console.log('Réponse:', response1.substring(0, 200) + '...\n');

    // Exemple 2: Conversation avec contexte
    console.log('📝 Exemple 2: Conversation avec contexte');
    console.log('Question: "Peux-tu résumer ta réponse précédente en une phrase ?"');
    const response2 = await chat.sendMessage("Peux-tu résumer ta réponse précédente en une phrase ?");
    console.log('Réponse:', response2 + '\n');

    // Exemple 3: Streaming
    console.log('📝 Exemple 3: Utilisation du streaming');
    console.log('Question: "Raconte-moi une courte histoire"');
    console.log('Réponse en streaming:');
    const response3 = await chat.sendMessageStream(
      "Raconte-moi une très courte histoire sur un robot",
      (chunk) => {
        process.stdout.write(chunk);
      }
    );
    console.log('\n');

    // Exemple 4: Changement de modèle
    console.log('📝 Exemple 4: Changement de modèle vers Claude');
    chat.setModel(Models.Claude3);
    const response4 = await chat.sendMessage("Bonjour ! Quel modèle d'IA êtes-vous ?");
    console.log('Réponse:', response4.substring(0, 150) + '...\n');

    // Afficher l'historique
    console.log('📊 Historique de la conversation:');
    const history = chat.getHistory();
    history.forEach((msg, index) => {
      console.log(`${index + 1}. [${msg.role}]: ${msg.content.substring(0, 50)}...`);
    });

    // Effacer l'historique
    console.log('\n🗑️  Effacement de l\'historique...');
    await chat.clear();
    console.log('✅ Historique effacé');

    // Vérifier que l'historique est vide
    const newHistory = chat.getHistory();
    console.log(`📊 Nouveau historique: ${newHistory.length} messages\n`);

    // Afficher les modèles disponibles
    console.log('🎯 Modèles disponibles:');
    const models = DuckDuckGoChat.getAvailableModels();
    models.forEach(model => console.log(`  - ${model}`));

    console.log('\n✅ Exemple terminé avec succès!');

  } catch (error) {
    console.error('❌ Erreur durant l\'exemple:', error.message);
  }
}

/**
 * Exemple de gestion d'erreurs
 */
async function errorHandlingExample() {
  console.log('\n🛡️  Exemple de gestion d\'erreurs\n');

  const chat = new DuckDuckGoChat();

  try {
    // Tentative d'envoi sans initialisation
    await chat.sendMessage("Test sans initialisation");
  } catch (error) {
    console.log('✅ Erreur gérée correctement:', error.message);
  }

  try {
    // Initialisation normale
    await chat.initialize();
    console.log('✅ Initialisation réussie après gestion d\'erreur');
  } catch (error) {
    console.error('❌ Erreur d\'initialisation:', error.message);
  }
}

// Exécuter les exemples
async function runExamples() {
  await interactiveExample();
  await errorHandlingExample();
}

runExamples().catch(console.error);
