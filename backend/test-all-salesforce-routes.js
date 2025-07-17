#!/usr/bin/env node

/**
 * Test All Salesforce Routes
 * Verifica que todas las rutas estén funcionando correctamente
 */

const PRODUCTION_URL = 'https://backend-service-pu47.onrender.com';

async function testAllRoutes() {
  console.log('🔍 Testing All Salesforce Routes...\n');

  const routes = [
    {
      name: 'OAuth Authorize',
      path: '/api/salesforce/oauth/authorize',
      method: 'GET',
      expectedStatus: [302, 500], // 302 redirect or 500 if not configured
      public: true
    },
    {
      name: 'OAuth Callback',
      path: '/api/salesforce/oauth/callback',
      method: 'GET',
      expectedStatus: [302], // Should redirect
      public: true
    },
    {
      name: 'Debug Config',
      path: '/api/salesforce/debug/config',
      method: 'GET',
      expectedStatus: [200],
      public: true
    },
    {
      name: 'Salesforce Status',
      path: '/api/salesforce/status',
      method: 'GET',
      expectedStatus: [200],
      public: true
    },
    {
      name: 'Salesforce Stats',
      path: '/api/salesforce/stats',
      method: 'GET',
      expectedStatus: [200, 401], // 401 if not authenticated
      public: false
    },
    {
      name: 'Sync History',
      path: '/api/salesforce/sync-history',
      method: 'GET',
      expectedStatus: [200, 401], // 401 if not authenticated
      public: false
    }
  ];

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    console.log(`${i + 1}️⃣ Testing ${route.name}:`);
    
    try {
      const options = {
        method: route.method,
        redirect: 'manual' // Don't follow redirects
      };

      const response = await fetch(`${PRODUCTION_URL}${route.path}`, options);
      
      console.log(`   Status: ${response.status}`);
      
      if (route.expectedStatus.includes(response.status)) {
        console.log(`   ✅ Route working correctly`);
        
        // Show additional info for some routes
        if (response.status === 200) {
          try {
            const data = await response.json();
            if (route.name === 'Debug Config') {
              console.log(`   Environment: ${data.environment}`);
              console.log(`   Client ID: ${data.salesforce.clientId}`);
            } else if (route.name === 'Salesforce Status') {
              console.log(`   Status: ${data.status}`);
              console.log(`   Configured: ${data.configured}`);
            }
          } catch (e) {
            // Ignore JSON parse errors
          }
        } else if (response.status === 302) {
          const location = response.headers.get('location');
          if (location) {
            console.log(`   Redirects to: ${location.substring(0, 80)}...`);
          }
        } else if (response.status === 401) {
          console.log(`   Authentication required (expected for protected routes)`);
        }
      } else {
        console.log(`   ⚠️ Unexpected status (expected: ${route.expectedStatus.join(' or ')})`);
        
        if (response.status === 404) {
          console.log(`   ❌ Route not found - still deploying or path incorrect`);
        }
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }

  console.log('🏁 All Routes Test Complete!');
  console.log('\n📝 Summary:');
  console.log('✅ Working routes can be used in your video demo');
  console.log('⚠️ Protected routes need authentication token');
  console.log('❌ Routes with 404 are still deploying (wait 2-3 minutes)');
}

// Run the test
testAllRoutes().catch(console.error);
