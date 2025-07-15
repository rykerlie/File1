#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🤖 Setting up AI Web Agent for n8n...\n');

// Function to run shell commands
function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed successfully\n`);
  } catch (error) {
    console.error(`❌ Error during ${description}:`, error.message);
    process.exit(1);
  }
}

// Function to check if a command exists
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check prerequisites
console.log('🔍 Checking prerequisites...');

if (!commandExists('node')) {
  console.error('❌ Node.js is not installed. Please install Node.js 18+ first.');
  process.exit(1);
}

if (!commandExists('npm')) {
  console.error('❌ npm is not installed. Please install npm first.');
  process.exit(1);
}

console.log('✅ Prerequisites check passed\n');

// Install core dependencies
runCommand('npm install playwright openai @anthropic-ai/sdk', 'Installing AI Web Agent dependencies');

// Install Playwright browsers
runCommand('npx playwright install chromium', 'Installing Playwright Chromium browser');

// Create directories if they don't exist
const directories = [
  'dist/n8n',
  'dist/services',
  'docs',
  'examples'
];

console.log('📁 Creating directory structure...');
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`   Created: ${dir}`);
  }
});
console.log('✅ Directory structure created\n');

// Copy example files if they don't exist
const exampleFiles = [
  {
    source: 'examples/ai-web-agent-workflows.json',
    description: 'AI Web Agent workflow examples'
  },
  {
    source: 'docs/AI_WEB_AGENT_GUIDE.md',
    description: 'AI Web Agent documentation'
  }
];

console.log('📋 Checking example files...');
exampleFiles.forEach(file => {
  if (fs.existsSync(file.source)) {
    console.log(`   ✅ ${file.description} already exists`);
  } else {
    console.log(`   ⚠️  ${file.description} not found`);
  }
});
console.log();

// Create environment file template
const envTemplate = `# AI Web Agent Environment Configuration

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic Configuration  
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Browser Configuration
BROWSER_HEADLESS=true
BROWSER_TIMEOUT=30000
DEFAULT_DELAY_BETWEEN_ACTIONS=1000

# Debug Configuration
DEBUG_SCREENSHOTS=true
DEBUG_LOGS=true

# n8n Configuration
N8N_CUSTOM_EXTENSIONS_DIR=./dist/n8n
`;

if (!fs.existsSync('.env.ai-web-agent')) {
  fs.writeFileSync('.env.ai-web-agent', envTemplate);
  console.log('📝 Created .env.ai-web-agent template file');
} else {
  console.log('📝 .env.ai-web-agent file already exists');
}

// Create a simple test script
const testScript = `#!/usr/bin/env node

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
    console.log(\`   Page title: \${title}\`);
    
    // Test element interaction
    console.log('🔍 Testing element detection...');
    const links = await page.locator('a').count();
    console.log(\`   Found \${links} links on the page\`);
    
    await browser.close();
    console.log('✅ AI Web Agent setup test completed successfully!');
    
    console.log('\\n📋 Next steps:');
    console.log('1. Add your AI provider API keys to .env.ai-web-agent');
    console.log('2. Configure n8n credentials for OpenAI or Anthropic');
    console.log('3. Import the AI Web Agent node into your n8n instance');
    console.log('4. Try the example workflows in examples/ai-web-agent-workflows.json');
    console.log('5. Read the documentation in docs/AI_WEB_AGENT_GUIDE.md');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\\n🔧 Troubleshooting tips:');
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
`;

fs.writeFileSync('scripts/test-ai-web-agent.js', testScript);
fs.chmodSync('scripts/test-ai-web-agent.js', '755');
console.log('🧪 Created test script: scripts/test-ai-web-agent.js\n');

// Create package.json scripts if they don't exist
const packageJsonPath = 'package.json';
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add AI Web Agent scripts
  const aiWebAgentScripts = {
    'setup:ai-web-agent': 'node scripts/setup-ai-web-agent.js',
    'test:ai-web-agent': 'node scripts/test-ai-web-agent.js',
    'build:ai-web-agent': 'tsc && cp src/n8n/*.node.ts dist/n8n/',
    'dev:ai-web-agent': 'npm run build:ai-web-agent && npm run test:ai-web-agent'
  };
  
  let scriptsAdded = false;
  Object.entries(aiWebAgentScripts).forEach(([script, command]) => {
    if (!packageJson.scripts[script]) {
      packageJson.scripts[script] = command;
      scriptsAdded = true;
    }
  });
  
  if (scriptsAdded) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('📦 Added AI Web Agent scripts to package.json');
  }
}

console.log('🎉 AI Web Agent setup completed!\n');

console.log('📋 Summary:');
console.log('✅ Dependencies installed');
console.log('✅ Playwright browser installed');
console.log('✅ Directory structure created');
console.log('✅ Environment template created');
console.log('✅ Test script created');
console.log('✅ npm scripts added');

console.log('\n🚀 Quick start:');
console.log('1. Run: npm run test:ai-web-agent');
console.log('2. Configure your AI API keys in .env.ai-web-agent');
console.log('3. Check out the examples in examples/ai-web-agent-workflows.json');
console.log('4. Read the guide in docs/AI_WEB_AGENT_GUIDE.md');

console.log('\n💡 Need help? Check the documentation or create an issue!');