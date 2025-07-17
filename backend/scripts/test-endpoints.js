/**
 * Test del endpoint de tickets desde el frontend
 * Para verificar que la integración funciona end-to-end
 */

console.log('🎫 Testing Support Ticket Endpoint...');

const ticketData = {
  summary: "Test ticket from script",
  priority: "High", 
  description: "Este es un ticket de prueba para verificar la integración completa con Dropbox y Power Automate"
};

async function testCreateTicket() {
  try {
    const response = await fetch('http://localhost:3000/api/support/test-ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData)
    });

    const data = await response.text();
    
    console.log('📡 Response Status:', response.status);
    console.log('📄 Response Data:', data);

    if (response.ok) {
      try {
        const jsonData = JSON.parse(data);
        console.log('✅ Ticket created successfully!');
        console.log('🎫 Ticket ID:', jsonData.ticket.id);
        console.log('☁️ Cloud Upload:', jsonData.cloudUpload);
      } catch (e) {
        console.log('✅ Request successful, but response format:', data);
      }
    } else {
      console.log('❌ Request failed:', response.status);
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Run the test
async function runTest() {
  await testCreateTicket();
  console.log('\n✅ Test completed!');
  console.log('� Now check your Dropbox folder to see if the file was uploaded!');
}

runTest();
