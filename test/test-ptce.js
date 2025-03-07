// test-ptce.js
const axios = require('axios');

async function testPTCE() {
  try {
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:3000/api/ptce/health');
    console.log('Health check response:', healthResponse.data);
    
    // Test model comparison
    const testModels = {
      model1: {
        id: "test-model-1",
        name: "Warrior Model",
        prompt: "A powerful warrior model",
        finalThumbnailUrl: "https://example.com/thumb1.jpg",
        finalModelUrl: "https://example.com/model1.glb",
        video_url: "https://example.com/video1.mp4",
        texture_urls: ["https://example.com/texture1.jpg"],
        attributes: {
          attack_power: 85,
          defense: 70,
          speed_agility: 75,
          strategy: 60,
          endurance: 80
        },
        ip_address: "127.0.0.1",
        secretKey: "test-key-1"
      },
      model2: {
        id: "test-model-2",
        name: "Mage Model",
        prompt: "A powerful mage model",
        finalThumbnailUrl: "https://example.com/thumb2.jpg",
        finalModelUrl: "https://example.com/model2.glb",
        video_url: "https://example.com/video2.mp4",
        texture_urls: ["https://example.com/texture2.jpg"],
        attributes: {
          attack_power: 70,
          defense: 60,
          speed_agility: 65,
          strategy: 90,
          endurance: 60
        },
        ip_address: "127.0.0.1",
        secretKey: "test-key-2"
      }
    };
    
    console.log('Testing PTCE with sample models...');
    const response = await axios.post('http://localhost:3000/api/ptce/determine-winner', testModels);
    
    console.log('\n=== PTCE Test Results ===');
    console.log(`Match ID: ${response.data.matchId}`);
    console.log(`Winner: ${response.data.winner.name} (ID: ${response.data.winner.id})`);
    console.log('Scores:');
    Object.entries(response.data.scores).forEach(([id, score]) => {
      console.log(`  ${id}: ${score}`);
    });
    console.log(`Confidence: ${response.data.confidence}`);
    console.log(`Reasoning: ${response.data.reasoning}`);
    
    return response.data;
  } catch (error) {
    console.error('Error testing PTCE:', error.response ? error.response.data : error.message);
  }
}

testPTCE();