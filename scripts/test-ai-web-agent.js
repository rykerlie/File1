#!/usr/bin/env node

const { chromium } = require('playwright');

async function testAIWebAgent() {
  console.log('🧪 Testing AI Web Agent setup...');
  
  let browser;
  try {
    // Test browser launch
    console.log('🌐 Testing browser launch...');
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Test navigation
    console.log('📄 Testing navigation...');
    await page.goto('https://example.com', { timeout: 10000 });
    const title = await page.title();
    console.log(`   Page title: ${title}`);
    
    // Test element interaction
    console.log('🔍 Testing element detection...');
    const links = await page.locator('a').count();
    console.log(`   Found ${links} links on the page`);
    
    await browser.close();
    console.log('✅ AI Web Agent setup test completed successfully!');
    
    console.log('\n📋 Next steps:');
    console.log('1. Add your AI provider API keys to .env.ai-web-agent');
    console.log('2. Configure n8n credentials for OpenAI or Anthropic');
    console.log('3. Import the AI Web Agent node into your n8n instance');
    console.log('4. Try the example workflows in examples/ai-web-agent-workflows.json');
    console.log('5. Read the documentation in docs/AI_WEB_AGENT_GUIDE.md');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('- Ensure you have internet connectivity');
    console.log('- Check that Playwright installed correctly: npx playwright install');
    console.log('- Verify Node.js version is 18+: node --version');
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testAIWebAgent();
