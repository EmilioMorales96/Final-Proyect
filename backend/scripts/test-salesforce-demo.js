/**
 * Test del endpoint demo de Salesforce
 */

console.log('🏢 Testing Salesforce Demo Endpoint...');
console.log('='.repeat(50));

const testData = {
  company: "Tech Solutions Demo Corp",
  phone: "+1-555-0123", 
  website: "https://techsolutions-demo.com",
  industry: "Technology",
  annualRevenue: "5000000",
  numberOfEmployees: "150"
};

async function testSalesforceDemo() {
  try {
    console.log('📊 Creating account in Salesforce...');
    console.log('🏢 Company:', testData.company);
    
    const response = await fetch('http://localhost:3000/api/salesforce/demo-create-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const data = await response.text();
    
    console.log('📡 Response Status:', response.status);
    
    if (response.ok) {
      const jsonData = JSON.parse(data);
      console.log('✅ Salesforce integration working!');
      console.log('🎯 Account ID:', jsonData.salesforce.account.id);
      console.log('🔗 Account URL:', jsonData.salesforce.account.url);
      if (jsonData.salesforce.contact) {
        console.log('👤 Contact ID:', jsonData.salesforce.contact.id);
        console.log('🔗 Contact URL:', jsonData.salesforce.contact.url);
      }
      console.log('📄 Message:', jsonData.message);
    } else {
      console.log('❌ Salesforce demo failed:', data);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Run test
testSalesforceDemo();
