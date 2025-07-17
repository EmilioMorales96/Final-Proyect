/**
 * Test de los endpoints públicos para verificar que el frontend puede acceder
 */

console.log('🧪 Testing Public Endpoints...');
console.log('='.repeat(50));

// Test public tickets endpoint
async function testPublicTickets() {
  try {
    console.log('\n📋 Testing public tickets endpoint...');
    
    const response = await fetch('http://localhost:3000/api/support/public-tickets');
    const data = await response.text();
    
    console.log('📡 Response Status:', response.status);
    
    if (response.ok) {
      const jsonData = JSON.parse(data);
      console.log('✅ Public tickets endpoint working!');
      console.log('🎫 Total tickets:', jsonData.total);
      if (jsonData.tickets.length > 0) {
        console.log('📄 Latest ticket:', jsonData.tickets[0].summary);
      }
    } else {
      console.log('❌ Public tickets failed:', data);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Test public Dropbox files endpoint
async function testPublicDropboxFiles() {
  try {
    console.log('\n📁 Testing public Dropbox files endpoint...');
    
    const response = await fetch('http://localhost:3000/api/support/public-dropbox-files');
    const data = await response.text();
    
    console.log('📡 Response Status:', response.status);
    
    if (response.ok) {
      const jsonData = JSON.parse(data);
      console.log('✅ Public Dropbox files endpoint working!');
      console.log('📁 Total files in Dropbox:', jsonData.totalFiles);
      if (jsonData.files.length > 0) {
        console.log('📄 Latest file:', jsonData.files[0].name);
      }
    } else {
      console.log('❌ Public Dropbox files failed:', data);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Run tests
async function runTests() {
  await testPublicTickets();
  await testPublicDropboxFiles();
  
  console.log('\n✅ Public endpoints tests completed!');
  console.log('💡 The frontend should now be able to access these endpoints without authentication.');
}

runTests();
