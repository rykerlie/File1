import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { chromium, Browser, Page, BrowserContext } from 'playwright';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export interface WebActionResult {
  success: boolean;
  data: any;
  screenshot?: string;
  actions: string[];
  executionTime: number;
  error?: string;
}

export interface BrowserOptions {
  headless?: boolean;
  waitForNetworkIdle?: boolean;
  viewportWidth?: number;
  viewportHeight?: number;
  userAgent?: string;
  delayBetweenActions?: number;
}

export interface AdvancedOptions {
  maxInteractions?: number;
  screenshotOnError?: boolean;
  returnScreenshots?: boolean;
  customSelectors?: string;
  successCriteria?: string;
}

export class AIWebAutomationService {
  private executeFunctions: IExecuteFunctions;
  private aiProvider: string;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;

  constructor(executeFunctions: IExecuteFunctions, aiProvider: string) {
    this.executeFunctions = executeFunctions;
    this.aiProvider = aiProvider;
    this.initializeAI();
  }

  private async initializeAI(): Promise<void> {
    try {
      if (this.aiProvider === 'openai') {
        const credentials = await this.executeFunctions.getCredentials('openAiApi');
        this.openai = new OpenAI({
          apiKey: credentials.apiKey as string,
        });
      } else if (this.aiProvider === 'anthropic') {
        const credentials = await this.executeFunctions.getCredentials('anthropicApi');
        this.anthropic = new Anthropic({
          apiKey: credentials.apiKey as string,
        });
      }
    } catch (error) {
      console.warn('AI credentials not found, will use basic automation without AI decision-making');
    }
  }

  private async initializeBrowser(options: BrowserOptions): Promise<void> {
    const browserOptions = {
      headless: options.headless !== false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
      ],
    };

    this.browser = await chromium.launch(browserOptions);
    
    this.context = await this.browser.newContext({
      viewport: {
        width: options.viewportWidth || 1920,
        height: options.viewportHeight || 1080,
      },
      userAgent: options.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    this.page = await this.context.newPage();

    // Set up realistic human-like behavior
    await this.page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    });

    // Add random delays to mouse movements
    await this.page.addInitScript(() => {
      const originalClick = HTMLElement.prototype.click;
      HTMLElement.prototype.click = function() {
        const delay = Math.random() * 100 + 50; // 50-150ms delay
        setTimeout(() => originalClick.call(this), delay);
      };
    });
  }

  private async closeResources(): Promise<void> {
    try {
      if (this.page) await this.page.close();
      if (this.context) await this.context.close();
      if (this.browser) await this.browser.close();
    } catch (error) {
      console.warn('Error closing browser resources:', error);
    }
  }

  private async makeAIDecision(
    prompt: string,
    pageContent: string,
    screenshot?: string
  ): Promise<string> {
    if (!this.openai && !this.anthropic) {
      throw new NodeOperationError(
        this.executeFunctions.getNode(),
        'AI provider not configured. Please add OpenAI or Anthropic credentials.'
      );
    }

    const systemPrompt = `You are an AI agent that can control a web browser. Your task is to analyze the current webpage and decide what action to take next.

Available actions:
- click(selector): Click an element
- type(selector, text): Type text into an input field
- scroll(direction, amount): Scroll the page (up/down, pixels)
- wait(milliseconds): Wait for a specified time
- extract(selector): Extract text from an element
- screenshot(): Take a screenshot
- complete(): Mark the task as complete

Respond with a JSON object containing:
{
  "action": "action_name",
  "selector": "css_selector_if_needed",
  "value": "value_if_needed",
  "reasoning": "explanation_of_why_this_action"
}

Current page content (first 2000 characters):
${pageContent.substring(0, 2000)}

User task: ${prompt}`;

    try {
      if (this.aiProvider === 'openai' && this.openai) {
        const messages: any[] = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ];

        if (screenshot) {
          messages.push({
            role: 'user',
            content: [
              { type: 'text', text: 'Here is a screenshot of the current page:' },
              { type: 'image_url', image_url: { url: `data:image/png;base64,${screenshot}` } }
            ]
          });
        }

        const response = await this.openai.chat.completions.create({
          model: 'gpt-4-vision-preview',
          messages,
          max_tokens: 500,
        });

        return response.choices[0]?.message?.content || '{"action": "complete", "reasoning": "No action determined"}';
      } else if (this.aiProvider === 'anthropic' && this.anthropic) {
        let content = systemPrompt + '\n\nUser: ' + prompt;
        
        if (screenshot) {
          content += '\n\nI am also providing a screenshot of the current page for visual context.';
        }

        const response = await this.anthropic.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 500,
          messages: [
            {
              role: 'user',
              content: screenshot ? [
                { type: 'text', text: content },
                { type: 'image', source: { type: 'base64', media_type: 'image/png', data: screenshot } }
              ] : content
            }
          ],
        });

        return response.content[0].type === 'text' ? response.content[0].text : '{"action": "complete", "reasoning": "No action determined"}';
      }
    } catch (error) {
      console.warn('AI decision-making failed, falling back to basic automation:', error);
      return '{"action": "complete", "reasoning": "AI decision failed"}';
    }

    return '{"action": "complete", "reasoning": "No AI provider available"}';
  }

  private async executeAction(action: any, delayBetweenActions: number): Promise<string> {
    if (!this.page) throw new Error('Page not initialized');

    await this.page.waitForTimeout(delayBetweenActions || 1000);

    switch (action.action) {
      case 'click':
        await this.page.click(action.selector, { timeout: 5000 });
        return `Clicked element: ${action.selector}`;

      case 'type':
        await this.page.fill(action.selector, action.value);
        return `Typed "${action.value}" into: ${action.selector}`;

      case 'scroll':
        const scrollAmount = action.value || 500;
        if (action.direction === 'up') {
          await this.page.evaluate((amount) => window.scrollBy(0, -amount), scrollAmount);
        } else {
          await this.page.evaluate((amount) => window.scrollBy(0, amount), scrollAmount);
        }
        return `Scrolled ${action.direction} by ${scrollAmount}px`;

      case 'wait':
        await this.page.waitForTimeout(action.value || 1000);
        return `Waited ${action.value || 1000}ms`;

      case 'extract':
        const text = await this.page.textContent(action.selector);
        return `Extracted text: ${text}`;

      case 'screenshot':
        const screenshot = await this.page.screenshot({ encoding: 'base64' });
        return `Screenshot taken`;

      case 'complete':
        return 'Task marked as complete';

      default:
        return `Unknown action: ${action.action}`;
    }
  }

  private async humanLikeDelay(): Promise<void> {
    // Add random human-like delays between 100-300ms
    const delay = Math.random() * 200 + 100;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  async navigateAndInteract(
    url: string,
    taskDescription: string,
    browserOptions: BrowserOptions,
    advancedOptions: AdvancedOptions
  ): Promise<WebActionResult> {
    const startTime = Date.now();
    const actions: string[] = [];
    
    try {
      await this.initializeBrowser(browserOptions);
      if (!this.page) throw new Error('Failed to initialize browser');

      // Navigate to the URL
      await this.page.goto(url, { 
        waitUntil: browserOptions.waitForNetworkIdle ? 'networkidle' : 'domcontentloaded',
        timeout: 30000 
      });
      actions.push(`Navigated to: ${url}`);

      let screenshot = '';
      if (advancedOptions.returnScreenshots) {
        screenshot = await this.page.screenshot({ encoding: 'base64' });
      }

      const maxInteractions = advancedOptions.maxInteractions || 10;
      let interactionCount = 0;

      while (interactionCount < maxInteractions) {
        await this.humanLikeDelay();

        // Get current page content
        const pageContent = await this.page.content();
        const visibleText = await this.page.innerText('body');

        // Check success criteria if provided
        if (advancedOptions.successCriteria) {
          const currentUrl = this.page.url();
          const criteriaResult = this.evaluateSuccessCriteria(
            advancedOptions.successCriteria,
            currentUrl,
            visibleText
          );
          
          if (criteriaResult) {
            actions.push(`Success criteria met: ${advancedOptions.successCriteria}`);
            break;
          }
        }

        // Get AI decision for next action
        const aiResponse = await this.makeAIDecision(
          taskDescription,
          pageContent,
          advancedOptions.returnScreenshots ? screenshot : undefined
        );

        let nextAction;
        try {
          nextAction = JSON.parse(aiResponse);
        } catch (error) {
          // Fallback if AI response is not valid JSON
          nextAction = { action: 'complete', reasoning: 'Invalid AI response format' };
        }

        if (nextAction.action === 'complete') {
          actions.push(`Task completed: ${nextAction.reasoning}`);
          break;
        }

        // Execute the action
        const actionResult = await this.executeAction(nextAction, browserOptions.delayBetweenActions || 1000);
        actions.push(`${actionResult} (Reasoning: ${nextAction.reasoning})`);

        interactionCount++;

        // Take updated screenshot if needed
        if (advancedOptions.returnScreenshots) {
          screenshot = await this.page.screenshot({ encoding: 'base64' });
        }
      }

      // Get final page data
      const finalUrl = this.page.url();
      const finalContent = await this.page.innerText('body');

      return {
        success: true,
        data: {
          finalUrl,
          content: finalContent.substring(0, 1000), // Limit content size
          interactionCount,
        },
        screenshot: advancedOptions.returnScreenshots ? screenshot : undefined,
        actions,
        executionTime: Date.now() - startTime,
      };

    } catch (error) {
      let errorScreenshot = '';
      if (advancedOptions.screenshotOnError && this.page) {
        try {
          errorScreenshot = await this.page.screenshot({ encoding: 'base64' });
        } catch (screenshotError) {
          console.warn('Failed to take error screenshot:', screenshotError);
        }
      }

      return {
        success: false,
        data: {},
        screenshot: errorScreenshot,
        actions,
        executionTime: Date.now() - startTime,
        error: error.message,
      };
    } finally {
      await this.closeResources();
    }
  }

  async extractInformation(
    url: string,
    taskDescription: string,
    extractionRules: any,
    browserOptions: BrowserOptions,
    advancedOptions: AdvancedOptions
  ): Promise<WebActionResult> {
    const startTime = Date.now();
    const actions: string[] = [];

    try {
      await this.initializeBrowser(browserOptions);
      if (!this.page) throw new Error('Failed to initialize browser');

      await this.page.goto(url, { 
        waitUntil: browserOptions.waitForNetworkIdle ? 'networkidle' : 'domcontentloaded',
        timeout: 30000 
      });
      actions.push(`Navigated to: ${url}`);

      const extractedData: any = {};

      if (extractionRules.cssSelector) {
        // Direct CSS selector extraction
        const elements = await this.page.locator(extractionRules.cssSelector);
        const count = await elements.count();
        
        if (count > 0) {
          if (count === 1) {
            extractedData[extractionRules.dataName || 'data'] = await elements.first().innerText();
          } else {
            const allTexts = [];
            for (let i = 0; i < count; i++) {
              allTexts.push(await elements.nth(i).innerText());
            }
            extractedData[extractionRules.dataName || 'data'] = allTexts;
          }
        }
      } else {
        // AI-powered extraction
        const pageContent = await this.page.content();
        const extractionPrompt = `Extract the following data from the webpage: ${extractionRules.extractionDescription || taskDescription}`;
        
        const aiResponse = await this.makeAIDecision(extractionPrompt, pageContent);
        
        try {
          const parsedResponse = JSON.parse(aiResponse);
          extractedData[extractionRules.dataName || 'extracted'] = parsedResponse;
        } catch (error) {
          extractedData[extractionRules.dataName || 'extracted'] = aiResponse;
        }
      }

      actions.push(`Extracted data: ${Object.keys(extractedData).join(', ')}`);

      return {
        success: true,
        data: extractedData,
        screenshot: advancedOptions.returnScreenshots ? await this.page.screenshot({ encoding: 'base64' }) : undefined,
        actions,
        executionTime: Date.now() - startTime,
      };

    } catch (error) {
      return {
        success: false,
        data: {},
        actions,
        executionTime: Date.now() - startTime,
        error: error.message,
      };
    } finally {
      await this.closeResources();
    }
  }

  async fillForm(
    url: string,
    taskDescription: string,
    formData: any,
    browserOptions: BrowserOptions,
    advancedOptions: AdvancedOptions
  ): Promise<WebActionResult> {
    const startTime = Date.now();
    const actions: string[] = [];

    try {
      await this.initializeBrowser(browserOptions);
      if (!this.page) throw new Error('Failed to initialize browser');

      await this.page.goto(url, { 
        waitUntil: browserOptions.waitForNetworkIdle ? 'networkidle' : 'domcontentloaded',
        timeout: 30000 
      });
      actions.push(`Navigated to: ${url}`);

      // Fill form fields based on formData
      for (const field of Array.isArray(formData) ? formData : [formData]) {
        if (!field.fieldName || !field.fieldValue) continue;

        await this.humanLikeDelay();

        // Try to find the field by various methods
        let selector = '';
        const fieldName = field.fieldName.toLowerCase();
        
        // Try different selector strategies
        const possibleSelectors = [
          `input[name="${field.fieldName}"]`,
          `input[id="${field.fieldName}"]`,
          `input[placeholder*="${field.fieldName}"]`,
          `label:has-text("${field.fieldName}") + input`,
          `input[type="${field.fieldType}"]`,
        ];

        for (const possibleSelector of possibleSelectors) {
          try {
            const element = this.page.locator(possibleSelector).first();
            if (await element.isVisible()) {
              selector = possibleSelector;
              break;
            }
          } catch (error) {
            continue;
          }
        }

        if (selector) {
          switch (field.fieldType) {
            case 'checkbox':
              await this.page.check(selector);
              actions.push(`Checked checkbox: ${field.fieldName}`);
              break;
            case 'select':
              await this.page.selectOption(selector, field.fieldValue);
              actions.push(`Selected option "${field.fieldValue}" in: ${field.fieldName}`);
              break;
            default:
              await this.page.fill(selector, field.fieldValue);
              actions.push(`Filled field "${field.fieldName}" with: ${field.fieldValue}`);
          }
        } else {
          actions.push(`Could not find field: ${field.fieldName}`);
        }
      }

      // Try to submit the form
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:has-text("Submit")',
        'button:has-text("Send")',
        'button:has-text("Login")',
        'button:has-text("Sign")',
      ];

      for (const submitSelector of submitSelectors) {
        try {
          const submitButton = this.page.locator(submitSelector).first();
          if (await submitButton.isVisible()) {
            await submitButton.click();
            actions.push(`Clicked submit button: ${submitSelector}`);
            break;
          }
        } catch (error) {
          continue;
        }
      }

      await this.page.waitForTimeout(2000); // Wait for form submission

      return {
        success: true,
        data: {
          finalUrl: this.page.url(),
          formFieldsFilled: actions.filter(action => action.includes('Filled')).length,
        },
        screenshot: advancedOptions.returnScreenshots ? await this.page.screenshot({ encoding: 'base64' }) : undefined,
        actions,
        executionTime: Date.now() - startTime,
      };

    } catch (error) {
      return {
        success: false,
        data: {},
        actions,
        executionTime: Date.now() - startTime,
        error: error.message,
      };
    } finally {
      await this.closeResources();
    }
  }

  async searchAndClick(
    url: string,
    taskDescription: string,
    browserOptions: BrowserOptions,
    advancedOptions: AdvancedOptions
  ): Promise<WebActionResult> {
    const startTime = Date.now();
    const actions: string[] = [];

    try {
      await this.initializeBrowser(browserOptions);
      if (!this.page) throw new Error('Failed to initialize browser');

      await this.page.goto(url, { 
        waitUntil: browserOptions.waitForNetworkIdle ? 'networkidle' : 'domcontentloaded',
        timeout: 30000 
      });
      actions.push(`Navigated to: ${url}`);

      // Use AI to find and click the target element
      const pageContent = await this.page.content();
      const clickPrompt = `Find and click the element described in: ${taskDescription}`;
      
      const aiResponse = await this.makeAIDecision(clickPrompt, pageContent);
      
      let clickAction;
      try {
        clickAction = JSON.parse(aiResponse);
      } catch (error) {
        throw new Error('AI could not determine what to click');
      }

      if (clickAction.action === 'click' && clickAction.selector) {
        await this.page.click(clickAction.selector);
        actions.push(`Clicked element: ${clickAction.selector} (${clickAction.reasoning})`);
        
        await this.page.waitForTimeout(2000); // Wait for any navigation or changes
      }

      return {
        success: true,
        data: {
          finalUrl: this.page.url(),
          clickedElement: clickAction.selector,
          reasoning: clickAction.reasoning,
        },
        screenshot: advancedOptions.returnScreenshots ? await this.page.screenshot({ encoding: 'base64' }) : undefined,
        actions,
        executionTime: Date.now() - startTime,
      };

    } catch (error) {
      return {
        success: false,
        data: {},
        actions,
        executionTime: Date.now() - startTime,
        error: error.message,
      };
    } finally {
      await this.closeResources();
    }
  }

  async monitorChanges(
    url: string,
    taskDescription: string,
    browserOptions: BrowserOptions,
    advancedOptions: AdvancedOptions
  ): Promise<WebActionResult> {
    const startTime = Date.now();
    const actions: string[] = [];

    try {
      await this.initializeBrowser(browserOptions);
      if (!this.page) throw new Error('Failed to initialize browser');

      await this.page.goto(url, { 
        waitUntil: browserOptions.waitForNetworkIdle ? 'networkidle' : 'domcontentloaded',
        timeout: 30000 
      });
      actions.push(`Started monitoring: ${url}`);

      let previousContent = await this.page.content();
      const monitoringDuration = 30000; // Monitor for 30 seconds
      const checkInterval = 2000; // Check every 2 seconds
      const startMonitoring = Date.now();

      const changes: any[] = [];

      while (Date.now() - startMonitoring < monitoringDuration) {
        await this.page.waitForTimeout(checkInterval);
        
        const currentContent = await this.page.content();
        
        if (currentContent !== previousContent) {
          const timestamp = new Date().toISOString();
          changes.push({
            timestamp,
            description: 'Page content changed',
            url: this.page.url(),
          });
          
          actions.push(`Change detected at ${timestamp}`);
          previousContent = currentContent;
        }
      }

      return {
        success: true,
        data: {
          monitoringDuration: monitoringDuration / 1000,
          changesDetected: changes.length,
          changes,
        },
        screenshot: advancedOptions.returnScreenshots ? await this.page.screenshot({ encoding: 'base64' }) : undefined,
        actions,
        executionTime: Date.now() - startTime,
      };

    } catch (error) {
      return {
        success: false,
        data: {},
        actions,
        executionTime: Date.now() - startTime,
        error: error.message,
      };
    } finally {
      await this.closeResources();
    }
  }

  private evaluateSuccessCriteria(criteria: string, url: string, content: string): boolean {
    try {
      // Simple criteria evaluation - can be extended
      if (criteria.includes('URL contains')) {
        const urlPattern = criteria.match(/URL contains "([^"]+)"/)?.[1];
        return urlPattern ? url.includes(urlPattern) : false;
      }
      
      if (criteria.includes('text') && criteria.includes('visible')) {
        const textPattern = criteria.match(/text "([^"]+)" is visible/)?.[1];
        return textPattern ? content.includes(textPattern) : false;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }
}