import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  ILoadOptionsFunctions,
  INodePropertyOptions,
} from 'n8n-workflow';
import { AIWebAutomationService } from '../services/ai-web-automation-service';

export class AIWebAgent implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'AI Web Agent',
    name: 'aiWebAgent',
    icon: 'file:ai-web-agent.svg',
    group: ['ai', 'automation'],
    version: 1,
    description: 'AI-powered agent that can interact with websites like a human',
    defaults: {
      name: 'AI Web Agent',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'openAiApi',
        required: false,
      },
      {
        name: 'anthropicApi',
        required: false,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Navigate and Interact',
            value: 'navigate',
            description: 'Navigate to a website and perform human-like interactions',
          },
          {
            name: 'Extract Information',
            value: 'extract',
            description: 'Extract specific information from a webpage using AI',
          },
          {
            name: 'Fill Form',
            value: 'fillForm',
            description: 'Fill out web forms intelligently',
          },
          {
            name: 'Search and Click',
            value: 'searchClick',
            description: 'Search for elements and click them naturally',
          },
          {
            name: 'Monitor Changes',
            value: 'monitor',
            description: 'Monitor webpage for changes and respond accordingly',
          },
        ],
        default: 'navigate',
      },
      {
        displayName: 'Target URL',
        name: 'url',
        type: 'string',
        default: '',
        placeholder: 'https://example.com',
        description: 'The URL to interact with',
        required: true,
      },
      {
        displayName: 'AI Provider',
        name: 'aiProvider',
        type: 'options',
        options: [
          {
            name: 'OpenAI GPT-4',
            value: 'openai',
          },
          {
            name: 'Claude',
            value: 'anthropic',
          },
          {
            name: 'Local Model',
            value: 'local',
          },
        ],
        default: 'openai',
        description: 'Choose the AI provider for decision-making',
      },
      {
        displayName: 'Task Description',
        name: 'taskDescription',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        placeholder: 'Describe what you want the AI agent to do on this website...',
        description: 'Natural language description of the task to perform',
        required: true,
      },
      {
        displayName: 'Browser Options',
        name: 'browserOptions',
        type: 'collection',
        placeholder: 'Add Browser Option',
        default: {},
        options: [
          {
            displayName: 'Headless',
            name: 'headless',
            type: 'boolean',
            default: true,
            description: 'Run browser in headless mode',
          },
          {
            displayName: 'Wait for Network Idle',
            name: 'waitForNetworkIdle',
            type: 'boolean',
            default: true,
            description: 'Wait for network to be idle before proceeding',
          },
          {
            displayName: 'Viewport Width',
            name: 'viewportWidth',
            type: 'number',
            default: 1920,
            description: 'Browser viewport width',
          },
          {
            displayName: 'Viewport Height',
            name: 'viewportHeight',
            type: 'number',
            default: 1080,
            description: 'Browser viewport height',
          },
          {
            displayName: 'User Agent',
            name: 'userAgent',
            type: 'string',
            default: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            description: 'Custom user agent string',
          },
          {
            displayName: 'Delay Between Actions (ms)',
            name: 'delayBetweenActions',
            type: 'number',
            default: 1000,
            description: 'Delay between actions to appear more human-like',
          },
        ],
      },
      {
        displayName: 'Advanced Options',
        name: 'advancedOptions',
        type: 'collection',
        placeholder: 'Add Advanced Option',
        default: {},
        displayOptions: {
          show: {
            operation: ['navigate', 'extract', 'fillForm'],
          },
        },
        options: [
          {
            displayName: 'Max Interactions',
            name: 'maxInteractions',
            type: 'number',
            default: 10,
            description: 'Maximum number of interactions to perform',
          },
          {
            displayName: 'Screenshot on Error',
            name: 'screenshotOnError',
            type: 'boolean',
            default: true,
            description: 'Take screenshot when an error occurs',
          },
          {
            displayName: 'Return Screenshots',
            name: 'returnScreenshots',
            type: 'boolean',
            default: false,
            description: 'Include screenshots in the response',
          },
          {
            displayName: 'Custom CSS Selectors',
            name: 'customSelectors',
            type: 'string',
            typeOptions: {
              rows: 3,
            },
            default: '',
            placeholder: 'button.submit, input[type="email"], .login-form',
            description: 'Comma-separated CSS selectors to focus on',
          },
          {
            displayName: 'Success Criteria',
            name: 'successCriteria',
            type: 'string',
            default: '',
            placeholder: 'URL contains "dashboard" or text "Welcome" is visible',
            description: 'Criteria to determine if the task was successful',
          },
        ],
      },
      {
        displayName: 'Form Data',
        name: 'formData',
        type: 'collection',
        placeholder: 'Add Form Field',
        default: {},
        displayOptions: {
          show: {
            operation: ['fillForm'],
          },
        },
        options: [
          {
            displayName: 'Field Name',
            name: 'fieldName',
            type: 'string',
            default: '',
            description: 'Name or label of the form field',
          },
          {
            displayName: 'Field Value',
            name: 'fieldValue',
            type: 'string',
            default: '',
            description: 'Value to enter in the field',
          },
          {
            displayName: 'Field Type',
            name: 'fieldType',
            type: 'options',
            options: [
              { name: 'Text', value: 'text' },
              { name: 'Email', value: 'email' },
              { name: 'Password', value: 'password' },
              { name: 'Select', value: 'select' },
              { name: 'Checkbox', value: 'checkbox' },
              { name: 'Radio', value: 'radio' },
            ],
            default: 'text',
            description: 'Type of the form field',
          },
        ],
      },
      {
        displayName: 'Extraction Rules',
        name: 'extractionRules',
        type: 'collection',
        placeholder: 'Add Extraction Rule',
        default: {},
        displayOptions: {
          show: {
            operation: ['extract'],
          },
        },
        options: [
          {
            displayName: 'Data Name',
            name: 'dataName',
            type: 'string',
            default: '',
            description: 'Name for the extracted data',
          },
          {
            displayName: 'Extraction Description',
            name: 'extractionDescription',
            type: 'string',
            default: '',
            placeholder: 'Extract the product price from the page',
            description: 'Description of what data to extract',
          },
          {
            displayName: 'CSS Selector (Optional)',
            name: 'cssSelector',
            type: 'string',
            default: '',
            description: 'Specific CSS selector to target',
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;
      const url = this.getNodeParameter('url', i) as string;
      const aiProvider = this.getNodeParameter('aiProvider', i) as string;
      const taskDescription = this.getNodeParameter('taskDescription', i) as string;
      const browserOptions = this.getNodeParameter('browserOptions', i, {}) as any;
      const advancedOptions = this.getNodeParameter('advancedOptions', i, {}) as any;

      try {
        const webAutomationService = new AIWebAutomationService(this, aiProvider);
        let result: any;

        switch (operation) {
          case 'navigate':
            result = await webAutomationService.navigateAndInteract(
              url,
              taskDescription,
              browserOptions,
              advancedOptions
            );
            break;

          case 'extract':
            const extractionRules = this.getNodeParameter('extractionRules', i, {}) as any;
            result = await webAutomationService.extractInformation(
              url,
              taskDescription,
              extractionRules,
              browserOptions,
              advancedOptions
            );
            break;

          case 'fillForm':
            const formData = this.getNodeParameter('formData', i, {}) as any;
            result = await webAutomationService.fillForm(
              url,
              taskDescription,
              formData,
              browserOptions,
              advancedOptions
            );
            break;

          case 'searchClick':
            result = await webAutomationService.searchAndClick(
              url,
              taskDescription,
              browserOptions,
              advancedOptions
            );
            break;

          case 'monitor':
            result = await webAutomationService.monitorChanges(
              url,
              taskDescription,
              browserOptions,
              advancedOptions
            );
            break;

          default:
            throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
        }

        returnData.push({
          json: {
            operation,
            url,
            taskDescription,
            success: result.success,
            result: result.data,
            screenshot: result.screenshot,
            actions: result.actions,
            metadata: {
              timestamp: new Date().toISOString(),
              executionTime: result.executionTime,
              aiProvider,
            },
          },
        });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error.message,
              operation,
              url,
              taskDescription,
            },
          });
        } else {
          throw error;
        }
      }
    }

    return [returnData];
  }
}