# AI Web Agent for n8n

## Overview

The AI Web Agent is a powerful n8n custom node that enables AI-powered web automation. It can interact with websites like a human user, making intelligent decisions about what actions to take based on natural language instructions.

## Features

- **🤖 AI-Powered Decision Making**: Uses OpenAI GPT-4 or Anthropic Claude to make intelligent decisions about web interactions
- **🌐 Human-like Browsing**: Mimics human behavior with realistic delays, mouse movements, and browser patterns
- **📝 Form Automation**: Intelligently fills out web forms with validation and error handling
- **🔍 Data Extraction**: Extracts specific information from web pages using AI or CSS selectors
- **👀 Visual Screenshots**: Takes screenshots for debugging and visual confirmation
- **⏱️ Website Monitoring**: Monitors websites for changes and responds accordingly
- **🔄 Multi-Operation Support**: Navigate, extract, fill forms, search & click, and monitor operations

## Installation

### Prerequisites

1. **n8n** installed and running
2. **Node.js** 18+ 
3. **AI Provider API Keys** (OpenAI or Anthropic)

### Setup Steps

1. **Install Dependencies**:
   ```bash
   npm install playwright openai @anthropic-ai/sdk
   ```

2. **Install Playwright Browsers**:
   ```bash
   npx playwright install chromium
   ```

3. **Add AI Credentials to n8n**:
   - Go to Settings > Credentials in n8n
   - Add OpenAI API or Anthropic API credentials

4. **Register the Custom Node**:
   - Place the `AIWebAgent.node.ts` file in your n8n custom nodes directory
   - Restart n8n

## Operations

### 1. Navigate and Interact

Navigates to a website and performs intelligent interactions based on AI decisions.

**Use Cases**:
- General website navigation
- Multi-step workflows
- Interactive exploration

**Example Configuration**:
```json
{
  "operation": "navigate",
  "url": "https://example.com",
  "taskDescription": "Find the contact page and click on it",
  "aiProvider": "openai",
  "browserOptions": {
    "headless": true,
    "delayBetweenActions": 1500
  },
  "advancedOptions": {
    "maxInteractions": 10,
    "successCriteria": "URL contains 'contact'"
  }
}
```

### 2. Extract Information

Extracts specific data from web pages using AI-powered analysis or CSS selectors.

**Use Cases**:
- Data scraping
- Content monitoring
- Information gathering

**Example Configuration**:
```json
{
  "operation": "extract",
  "url": "https://news.ycombinator.com",
  "taskDescription": "Extract the top 5 story titles and their scores",
  "extractionRules": [
    {
      "dataName": "stories",
      "extractionDescription": "Get story titles and scores from the front page",
      "cssSelector": ".storylink"
    }
  ]
}
```

### 3. Fill Form

Intelligently fills out web forms with error handling and validation.

**Use Cases**:
- Account registration
- Contact forms
- Survey completion
- Data entry automation

**Example Configuration**:
```json
{
  "operation": "fillForm",
  "url": "https://forms.example.com/contact",
  "taskDescription": "Fill out the contact form completely",
  "formData": [
    {
      "fieldName": "name",
      "fieldValue": "John Doe",
      "fieldType": "text"
    },
    {
      "fieldName": "email",
      "fieldValue": "john@example.com",
      "fieldType": "email"
    }
  ]
}
```

### 4. Search and Click

Finds and clicks specific elements using AI-powered element detection.

**Use Cases**:
- Button clicking
- Link navigation
- Element interaction

**Example Configuration**:
```json
{
  "operation": "searchClick",
  "url": "https://example.com",
  "taskDescription": "Find and click the 'Sign Up' button"
}
```

### 5. Monitor Changes

Monitors websites for changes and responds accordingly.

**Use Cases**:
- Price monitoring
- Content change detection
- Real-time updates

**Example Configuration**:
```json
{
  "operation": "monitor",
  "url": "https://example-shop.com/product/123",
  "taskDescription": "Monitor for price changes or stock availability"
}
```

## Configuration Options

### Browser Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `headless` | boolean | `true` | Run browser in headless mode |
| `waitForNetworkIdle` | boolean | `true` | Wait for network to be idle |
| `viewportWidth` | number | `1920` | Browser viewport width |
| `viewportHeight` | number | `1080` | Browser viewport height |
| `userAgent` | string | Chrome default | Custom user agent string |
| `delayBetweenActions` | number | `1000` | Delay between actions (ms) |

### Advanced Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxInteractions` | number | `10` | Maximum number of interactions |
| `screenshotOnError` | boolean | `true` | Take screenshot on errors |
| `returnScreenshots` | boolean | `false` | Include screenshots in response |
| `customSelectors` | string | `""` | Custom CSS selectors to focus on |
| `successCriteria` | string | `""` | Criteria to determine success |

## AI Providers

### OpenAI (GPT-4)
- **Model**: `gpt-4-vision-preview`
- **Features**: Vision capabilities, excellent reasoning
- **Best for**: Complex decision-making, visual analysis

### Anthropic (Claude)
- **Model**: `claude-3-sonnet-20240229`
- **Features**: Strong reasoning, good at following instructions
- **Best for**: Structured tasks, reliable automation

### Local Models
- **Setup**: Requires local AI model setup
- **Features**: Privacy, no external API calls
- **Best for**: Sensitive data, offline environments

## Best Practices

### 1. Task Descriptions

Write clear, specific task descriptions:

✅ **Good**: "Login using the email field and password field, then navigate to the dashboard"

❌ **Bad**: "Do login stuff"

### 2. Success Criteria

Define clear success criteria when possible:

```json
{
  "successCriteria": "URL contains 'dashboard' or text 'Welcome' is visible"
}
```

### 3. Human-like Behavior

Use realistic delays to avoid detection:

```json
{
  "browserOptions": {
    "delayBetweenActions": 2000,
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  }
}
```

### 4. Error Handling

Always enable error screenshots for debugging:

```json
{
  "advancedOptions": {
    "screenshotOnError": true,
    "maxInteractions": 5
  }
}
```

### 5. Form Field Mapping

Use multiple strategies for form field detection:

```json
{
  "formData": [
    {
      "fieldName": "email",
      "fieldValue": "user@example.com",
      "fieldType": "email"
    }
  ]
}
```

## Common Use Cases

### 1. E-commerce Automation

```javascript
// Search for products and compare prices
const workflow = {
  "nodes": [
    {
      "name": "Search Products",
      "type": "aiWebAgent",
      "parameters": {
        "operation": "navigate",
        "url": "https://shop.example.com",
        "taskDescription": "Search for 'laptop' and find the cheapest option under $1000"
      }
    },
    {
      "name": "Extract Product Info",
      "type": "aiWebAgent", 
      "parameters": {
        "operation": "extract",
        "taskDescription": "Extract product name, price, and rating for the selected item"
      }
    }
  ]
};
```

### 2. Lead Generation

```javascript
// Automate contact form submissions
const leadGenWorkflow = {
  "nodes": [
    {
      "name": "Fill Contact Form",
      "type": "aiWebAgent",
      "parameters": {
        "operation": "fillForm",
        "url": "https://company.example.com/contact",
        "taskDescription": "Submit inquiry about AI automation services",
        "formData": [
          {
            "fieldName": "company",
            "fieldValue": "{{$json.companyName}}",
            "fieldType": "text"
          },
          {
            "fieldName": "message", 
            "fieldValue": "Interested in AI automation solutions for our business",
            "fieldType": "text"
          }
        ]
      }
    }
  ]
};
```

### 3. Social Media Management

```javascript
// Automate social media posts
const socialWorkflow = {
  "nodes": [
    {
      "name": "Post to LinkedIn",
      "type": "aiWebAgent",
      "parameters": {
        "operation": "navigate",
        "url": "https://linkedin.com",
        "taskDescription": "Login and create a post about AI automation trends",
        "browserOptions": {
          "headless": false,
          "delayBetweenActions": 3000
        }
      }
    }
  ]
};
```

### 4. Price Monitoring

```javascript
// Monitor product prices
const priceMonitor = {
  "nodes": [
    {
      "name": "Check Price",
      "type": "aiWebAgent",
      "parameters": {
        "operation": "extract",
        "url": "https://shop.example.com/product/123",
        "taskDescription": "Extract the current price of the product",
        "extractionRules": [
          {
            "dataName": "price",
            "extractionDescription": "Get the product price",
            "cssSelector": ".price, .cost, [data-price]"
          }
        ]
      }
    }
  ]
};
```

## Troubleshooting

### Common Issues

1. **Element Not Found**
   - Check if the element exists and is visible
   - Try using AI-powered detection instead of CSS selectors
   - Increase wait times

2. **AI Decision Failures**
   - Verify AI credentials are configured
   - Check task description clarity
   - Review page content accessibility

3. **Browser Timeouts**
   - Increase timeout values
   - Check network connectivity
   - Verify website accessibility

4. **Form Filling Issues**
   - Use multiple field identification strategies
   - Check field types and validation
   - Enable error screenshots

### Debug Tips

1. **Enable Screenshots**:
   ```json
   {
     "advancedOptions": {
       "returnScreenshots": true,
       "screenshotOnError": true
     }
   }
   ```

2. **Use Non-Headless Mode** for testing:
   ```json
   {
     "browserOptions": {
       "headless": false
     }
   }
   ```

3. **Check Action Logs** in the execution result

4. **Test with Simple Tasks** first

## Security Considerations

1. **Credentials**: Store sensitive data in n8n credentials, not in workflows
2. **Rate Limiting**: Use appropriate delays to avoid being blocked
3. **User Agents**: Use realistic user agents
4. **Legal Compliance**: Ensure compliance with website terms of service
5. **Data Privacy**: Handle extracted data according to privacy regulations

## Performance Optimization

1. **Use Headless Mode** for production workflows
2. **Set Appropriate Timeouts** based on website performance
3. **Limit Max Interactions** to prevent infinite loops
4. **Cache Results** when possible
5. **Use Parallel Execution** for multiple sites

## Example Workflows

See `examples/ai-web-agent-workflows.json` for complete workflow examples including:

- Login and data extraction
- E-commerce product search
- Social media automation
- Website monitoring
- Form automation with validation

## Support and Contributing

For issues, questions, or contributions:

1. Check the documentation first
2. Review existing workflows and examples
3. Test with simple scenarios
4. Provide detailed error information
5. Include screenshots when reporting issues

The AI Web Agent makes web automation accessible through natural language instructions while maintaining the power and flexibility needed for complex automation tasks.