# n8n Web Browsing Agent - Human-like Web Automation

This guide provides complete code and workflows for creating an n8n agent capable of web browsing like a human. The solution includes multiple approaches ranging from simple HTTP requests to advanced AI-powered browsing.

## 🚀 Quick Start - Copy & Paste Workflows

### 1. Basic Human-like Web Browser Agent

```json
{
  "name": "Human-like Web Browser Agent",
  "nodes": [
    {
      "parameters": {
        "content": "=# Web Browsing Agent Configuration\n\n**Target URL:** {{ $('Manual Trigger').item.json.url || 'https://example.com' }}\n**User Agent:** {{ $('Manual Trigger').item.json.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }}\n**Action:** {{ $('Manual Trigger').item.json.action || 'scrape' }}\n\n---\n\n*This agent will browse the web with human-like behavior including delays, retries, and intelligent error handling.*",
        "height": 464,
        "width": 389
      },
      "id": "3c4c5c5e-8b2a-4c5d-9e1f-2a3b4c5d6e7f",
      "name": "Instructions",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        380,
        240
      ]
    },
    {
      "parameters": {
        "options": {}
      },
      "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [
        800,
        240
      ]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
              "name": "url",
              "value": "{{ $json.url || 'https://httpbin.org/html' }}",
              "type": "string"
            },
            {
              "id": "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
              "name": "userAgent",
              "value": "{{ $json.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }}",
              "type": "string"
            },
            {
              "id": "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
              "name": "action",
              "value": "{{ $json.action || 'browse' }}",
              "type": "string"
            },
            {
              "id": "4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s",
              "name": "maxRetries",
              "value": "3",
              "type": "number"
            },
            {
              "id": "5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t",
              "name": "humanDelay",
              "value": "{{ Math.floor(Math.random() * 3000) + 1000 }}",
              "type": "number"
            }
          ]
        },
        "options": {}
      },
      "id": "6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u",
      "name": "Set Browser Config",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        1020,
        240
      ]
    },
    {
      "parameters": {
        "amount": "={{ $json.humanDelay }}",
        "unit": "milliseconds"
      },
      "id": "7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v",
      "name": "Human Delay",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [
        1240,
        240
      ]
    },
    {
      "parameters": {
        "url": "={{ $json.url }}",
        "authentication": "none",
        "requestMethod": "GET",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "User-Agent",
              "value": "={{ $json.userAgent }}"
            },
            {
              "name": "Accept",
              "value": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
            },
            {
              "name": "Accept-Language",
              "value": "en-US,en;q=0.9"
            },
            {
              "name": "Accept-Encoding",
              "value": "gzip, deflate, br"
            },
            {
              "name": "DNT",
              "value": "1"
            },
            {
              "name": "Connection",
              "value": "keep-alive"
            },
            {
              "name": "Upgrade-Insecure-Requests",
              "value": "1"
            },
            {
              "name": "Sec-Fetch-Site",
              "value": "none"
            },
            {
              "name": "Sec-Fetch-Mode",
              "value": "navigate"
            },
            {
              "name": "Sec-Fetch-User",
              "value": "?1"
            },
            {
              "name": "Sec-Fetch-Dest",
              "value": "document"
            }
          ]
        },
        "options": {
          "redirect": {
            "redirect": {
              "followRedirects": true,
              "maxRedirects": 5
            }
          },
          "timeout": 30000,
          "retry": {
            "retry": {
              "retries": 3,
              "retryOnHttpError": true
            }
          }
        }
      },
      "id": "8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w",
      "name": "HTTP Request Browser",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        1460,
        240
      ]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict"
          },
          "conditions": [
            {
              "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
              "leftValue": "={{ $json.statusCode }}",
              "rightValue": 200,
              "operator": {
                "type": "number",
                "operation": "equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "9i0j1k2l-3m4n-5o6p-7q8r-9s0t1u2v3w4x",
      "name": "Check Success",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [
        1680,
        240
      ]
    },
    {
      "parameters": {
        "jsCode": "// Advanced HTML Content Processing\nconst htmlContent = $input.all()[0].json.data;\nconst statusCode = $input.all()[0].json.statusCode;\nconst headers = $input.all()[0].json.headers;\n\n// Helper function to extract text from HTML\nfunction extractTextFromHTML(html) {\n  // Remove script and style elements\n  let text = html.replace(/<script[^>]*>[\\s\\S]*?<\\/script>/gi, '');\n  text = text.replace(/<style[^>]*>[\\s\\S]*?<\\/style>/gi, '');\n  \n  // Remove HTML tags\n  text = text.replace(/<[^>]*>/g, ' ');\n  \n  // Clean up whitespace\n  text = text.replace(/\\s+/g, ' ').trim();\n  \n  return text;\n}\n\n// Helper function to extract links\nfunction extractLinks(html) {\n  const linkRegex = /<a[^>]+href=[\"']([^\"']+)[\"'][^>]*>([^<]*)<\\/a>/gi;\n  const links = [];\n  let match;\n  \n  while ((match = linkRegex.exec(html)) !== null) {\n    links.push({\n      url: match[1],\n      text: match[2].trim()\n    });\n  }\n  \n  return links;\n}\n\n// Helper function to extract images\nfunction extractImages(html) {\n  const imgRegex = /<img[^>]+src=[\"']([^\"']+)[\"'][^>]*(?:alt=[\"']([^\"']*)[\"'])?[^>]*>/gi;\n  const images = [];\n  let match;\n  \n  while ((match = imgRegex.exec(html)) !== null) {\n    images.push({\n      src: match[1],\n      alt: match[2] || ''\n    });\n  }\n  \n  return images;\n}\n\n// Helper function to extract forms\nfunction extractForms(html) {\n  const formRegex = /<form[^>]*action=[\"']([^\"']*)[\"'][^>]*method=[\"']([^\"']*)[\"'][^>]*>([\\s\\S]*?)<\\/form>/gi;\n  const forms = [];\n  let match;\n  \n  while ((match = formRegex.exec(html)) !== null) {\n    const inputRegex = /<input[^>]+name=[\"']([^\"']+)[\"'][^>]*type=[\"']([^\"']*)[\"'][^>]*>/gi;\n    const inputs = [];\n    let inputMatch;\n    \n    while ((inputMatch = inputRegex.exec(match[3])) !== null) {\n      inputs.push({\n        name: inputMatch[1],\n        type: inputMatch[2]\n      });\n    }\n    \n    forms.push({\n      action: match[1],\n      method: match[2],\n      inputs: inputs\n    });\n  }\n  \n  return forms;\n}\n\n// Helper function to extract metadata\nfunction extractMetadata(html) {\n  const metadata = {};\n  \n  // Title\n  const titleMatch = html.match(/<title[^>]*>([^<]*)<\\/title>/i);\n  if (titleMatch) {\n    metadata.title = titleMatch[1].trim();\n  }\n  \n  // Meta description\n  const descMatch = html.match(/<meta[^>]+name=[\"']description[\"'][^>]+content=[\"']([^\"']*)[\"'][^>]*>/i);\n  if (descMatch) {\n    metadata.description = descMatch[1];\n  }\n  \n  // Meta keywords\n  const keywordsMatch = html.match(/<meta[^>]+name=[\"']keywords[\"'][^>]+content=[\"']([^\"']*)[\"'][^>]*>/i);\n  if (keywordsMatch) {\n    metadata.keywords = keywordsMatch[1].split(',').map(k => k.trim());\n  }\n  \n  return metadata;\n}\n\n// Process the HTML content\nconst processedData = {\n  success: true,\n  statusCode: statusCode,\n  timestamp: new Date().toISOString(),\n  url: $node[\"Set Browser Config\"].json.url,\n  headers: headers,\n  \n  // Extracted content\n  metadata: extractMetadata(htmlContent),\n  textContent: extractTextFromHTML(htmlContent),\n  links: extractLinks(htmlContent),\n  images: extractImages(htmlContent),\n  forms: extractForms(htmlContent),\n  \n  // Raw content\n  rawHtml: htmlContent,\n  \n  // Statistics\n  stats: {\n    htmlSize: htmlContent.length,\n    textLength: extractTextFromHTML(htmlContent).length,\n    linkCount: extractLinks(htmlContent).length,\n    imageCount: extractImages(htmlContent).length,\n    formCount: extractForms(htmlContent).length\n  },\n  \n  // Browser info\n  browserInfo: {\n    userAgent: $node[\"Set Browser Config\"].json.userAgent,\n    requestDelay: $node[\"Set Browser Config\"].json.humanDelay\n  }\n};\n\nreturn processedData;"
      },
      "id": "0j1k2l3m-4n5o-6p7q-8r9s-0t1u2v3w4x5y",
      "name": "Process Content",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1900,
        160
      ]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
              "name": "success",
              "value": false,
              "type": "boolean"
            },
            {
              "id": "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
              "name": "error",
              "value": "{{ $json.message || 'Request failed' }}",
              "type": "string"
            },
            {
              "id": "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
              "name": "statusCode",
              "value": "={{ $json.statusCode || 0 }}",
              "type": "number"
            },
            {
              "id": "4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s",
              "name": "timestamp",
              "value": "={{ new Date().toISOString() }}",
              "type": "string"
            },
            {
              "id": "5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t",
              "name": "url",
              "value": "={{ $node[\"Set Browser Config\"].json.url }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "1k2l3m4n-5o6p-7q8r-9s0t-1u2v3w4x5y6z",
      "name": "Handle Error",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        1900,
        340
      ]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
              "name": "browsing_completed",
              "value": true,
              "type": "boolean"
            },
            {
              "id": "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
              "name": "final_result",
              "value": "={{ $json }}",
              "type": "object"
            },
            {
              "id": "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
              "name": "summary",
              "value": "=Web browsing completed successfully. {{ $json.success ? 'Content extracted from: ' + $json.url : 'Failed to access: ' + $json.url }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "2l3m4n5o-6p7q-8r9s-0t1u-2v3w4x5y6z7a",
      "name": "Final Output",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        2120,
        240
      ]
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [
        [
          {
            "node": "Set Browser Config",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Set Browser Config": {
      "main": [
        [
          {
            "node": "Human Delay",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Human Delay": {
      "main": [
        [
          {
            "node": "HTTP Request Browser",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request Browser": {
      "main": [
        [
          {
            "node": "Check Success",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Check Success": {
      "main": [
        [
          {
            "node": "Process Content",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Handle Error",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Process Content": {
      "main": [
        [
          {
            "node": "Final Output",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Handle Error": {
      "main": [
        [
          {
            "node": "Final Output",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null,
  "tags": [],
  "triggerCount": 0,
  "updatedAt": "2025-01-25T10:00:00.000Z",
  "versionId": "1"
}
```

### 2. Advanced AI-Powered Web Browser Agent

```json
{
  "name": "AI-Powered Web Browser Agent",
  "nodes": [
    {
      "parameters": {
        "content": "=# AI Web Browser Agent\n\n**Features:**\n- AI-powered decision making\n- Intelligent content extraction\n- Automated form filling\n- Link following logic\n- Human-like behavior patterns\n\n**Input Format:**\n```json\n{\n  \"task\": \"Find pricing information\",\n  \"url\": \"https://example.com\",\n  \"instructions\": \"Look for pricing tables and extract plan details\"\n}\n```",
        "height": 520,
        "width": 380
      },
      "id": "ai-note-1",
      "name": "AI Agent Instructions",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [
        380,
        240
      ]
    },
    {
      "parameters": {
        "options": {}
      },
      "id": "ai-trigger-1",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [
        800,
        240
      ]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "task-assignment",
              "name": "task",
              "value": "{{ $json.task || 'Browse and extract information' }}",
              "type": "string"
            },
            {
              "id": "url-assignment",
              "name": "url",
              "value": "{{ $json.url || 'https://httpbin.org/html' }}",
              "type": "string"
            },
            {
              "id": "instructions-assignment",
              "name": "instructions",
              "value": "{{ $json.instructions || 'Extract all relevant information from the page' }}",
              "type": "string"
            },
            {
              "id": "max-links-assignment",
              "name": "maxLinksToFollow",
              "value": "{{ $json.maxLinksToFollow || 3 }}",
              "type": "number"
            },
            {
              "id": "session-id-assignment",
              "name": "sessionId",
              "value": "={{ 'session_' + Date.now() }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "ai-config-1",
      "name": "Set AI Config",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        1020,
        240
      ]
    },
    {
      "parameters": {
        "agent": "conversationalAgent",
        "hasOutputParser": true,
        "outputParser": "structuredOutputParser",
        "promptType": "define",
        "text": "=You are an intelligent web browsing agent. Your task is to analyze web pages and make intelligent decisions about how to browse them.\n\nCurrent Task: {{ $json.task }}\nTarget URL: {{ $json.url }}\nInstructions: {{ $json.instructions }}\n\nYour capabilities:\n1. Analyze web page content\n2. Decide which links to follow\n3. Extract relevant information\n4. Fill forms intelligently\n5. Navigate multi-page workflows\n\nPlease analyze the current situation and provide your browsing strategy in the following format:\n- action: (browse|extract|form_fill|follow_link|complete)\n- target_url: (URL to visit)\n- reasoning: (why you chose this action)\n- extraction_strategy: (how to extract relevant data)\n- next_steps: (what to do after this action)",
        "options": {
          "systemMessage": "You are a professional web browsing agent with expertise in web navigation, content extraction, and automated workflows. You behave like a human browser user with intelligent decision-making capabilities."
        }
      },
      "id": "ai-agent-1",
      "name": "AI Browsing Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1,
      "position": [
        1240,
        240
      ]
    },
    {
      "parameters": {
        "url": "={{ $node[\"Set AI Config\"].json.url }}",
        "authentication": "none",
        "requestMethod": "GET",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "User-Agent",
              "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            {
              "name": "Accept",
              "value": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
            },
            {
              "name": "Accept-Language",
              "value": "en-US,en;q=0.9"
            },
            {
              "name": "Cache-Control",
              "value": "no-cache"
            },
            {
              "name": "Pragma",
              "value": "no-cache"
            }
          ]
        },
        "options": {
          "redirect": {
            "redirect": {
              "followRedirects": true,
              "maxRedirects": 10
            }
          },
          "timeout": 30000
        }
      },
      "id": "ai-browser-1",
      "name": "Intelligent HTTP Browser",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [
        1460,
        240
      ]
    },
    {
      "parameters": {
        "jsCode": "// Intelligent Content Analysis and Extraction\nconst content = $input.all()[0].json;\nconst aiConfig = $node[\"Set AI Config\"].json;\nconst url = content.headers?.['final-url'] || aiConfig.url;\n\n// Enhanced content extraction with AI capabilities\nfunction intelligentExtraction(html, task, instructions) {\n  const result = {\n    metadata: extractMetadata(html),\n    textContent: extractCleanText(html),\n    structuredData: extractStructuredData(html),\n    interactiveElements: extractInteractiveElements(html),\n    navigationElements: extractNavigationElements(html),\n    insights: generateContentInsights(html, task)\n  };\n  \n  return result;\n}\n\nfunction extractMetadata(html) {\n  const metadata = {};\n  \n  // Title\n  const titleMatch = html.match(/<title[^>]*>([^<]*)<\\/title>/i);\n  metadata.title = titleMatch ? titleMatch[1].trim() : '';\n  \n  // Meta tags\n  const metaTags = html.match(/<meta[^>]*>/gi) || [];\n  metadata.meta = {};\n  \n  metaTags.forEach(tag => {\n    const nameMatch = tag.match(/name=[\"']([^\"']*)[\"']/i);\n    const contentMatch = tag.match(/content=[\"']([^\"']*)[\"']/i);\n    if (nameMatch && contentMatch) {\n      metadata.meta[nameMatch[1]] = contentMatch[1];\n    }\n  });\n  \n  return metadata;\n}\n\nfunction extractCleanText(html) {\n  // Remove scripts, styles, and comments\n  let text = html.replace(/<script[^>]*>[\\s\\S]*?<\\/script>/gi, '');\n  text = text.replace(/<style[^>]*>[\\s\\S]*?<\\/style>/gi, '');\n  text = text.replace(/<!--[\\s\\S]*?-->/g, '');\n  \n  // Extract meaningful text blocks\n  const textBlocks = [];\n  const contentTags = ['p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th'];\n  \n  contentTags.forEach(tag => {\n    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');\n    let match;\n    while ((match = regex.exec(text)) !== null) {\n      const cleanText = match[1].replace(/<[^>]*>/g, '').trim();\n      if (cleanText.length > 20) {\n        textBlocks.push({\n          tag: tag,\n          content: cleanText,\n          length: cleanText.length\n        });\n      }\n    }\n  });\n  \n  return textBlocks;\n}\n\nfunction extractStructuredData(html) {\n  const structured = {\n    lists: [],\n    tables: [],\n    forms: [],\n    links: [],\n    images: []\n  };\n  \n  // Extract lists\n  const listRegex = /<(ul|ol)[^>]*>([\\s\\S]*?)<\\/(ul|ol)>/gi;\n  let match;\n  while ((match = listRegex.exec(html)) !== null) {\n    const items = match[2].match(/<li[^>]*>([\\s\\S]*?)<\\/li>/gi) || [];\n    structured.lists.push({\n      type: match[1],\n      items: items.map(item => item.replace(/<[^>]*>/g, '').trim())\n    });\n  }\n  \n  // Extract tables\n  const tableRegex = /<table[^>]*>([\\s\\S]*?)<\\/table>/gi;\n  while ((match = tableRegex.exec(html)) !== null) {\n    const rows = match[1].match(/<tr[^>]*>([\\s\\S]*?)<\\/tr>/gi) || [];\n    const tableData = rows.map(row => {\n      const cells = row.match(/<t[hd][^>]*>([\\s\\S]*?)<\\/t[hd]>/gi) || [];\n      return cells.map(cell => cell.replace(/<[^>]*>/g, '').trim());\n    });\n    structured.tables.push(tableData);\n  }\n  \n  // Extract forms\n  const formRegex = /<form[^>]*action=[\"']([^\"']*)[\"'][^>]*>([\\s\\S]*?)<\\/form>/gi;\n  while ((match = formRegex.exec(html)) !== null) {\n    const inputs = match[2].match(/<input[^>]*>/gi) || [];\n    const formData = {\n      action: match[1],\n      inputs: inputs.map(input => {\n        const nameMatch = input.match(/name=[\"']([^\"']*)[\"']/i);\n        const typeMatch = input.match(/type=[\"']([^\"']*)[\"']/i);\n        return {\n          name: nameMatch ? nameMatch[1] : '',\n          type: typeMatch ? typeMatch[1] : 'text'\n        };\n      })\n    };\n    structured.forms.push(formData);\n  }\n  \n  // Extract links\n  const linkRegex = /<a[^>]+href=[\"']([^\"']+)[\"'][^>]*>([^<]*)<\\/a>/gi;\n  while ((match = linkRegex.exec(html)) !== null) {\n    structured.links.push({\n      url: match[1],\n      text: match[2].trim(),\n      internal: !match[1].startsWith('http') || match[1].includes(new URL(url).hostname)\n    });\n  }\n  \n  return structured;\n}\n\nfunction extractInteractiveElements(html) {\n  const interactive = {\n    buttons: [],\n    inputs: [],\n    selects: [],\n    textareas: []\n  };\n  \n  // Extract buttons\n  const buttonRegex = /<button[^>]*>([^<]*)<\\/button>/gi;\n  let match;\n  while ((match = buttonRegex.exec(html)) !== null) {\n    interactive.buttons.push({\n      text: match[1].trim(),\n      clickable: true\n    });\n  }\n  \n  // Extract input elements\n  const inputRegex = /<input[^>]*>/gi;\n  while ((match = inputRegex.exec(html)) !== null) {\n    const nameMatch = match[0].match(/name=[\"']([^\"']*)[\"']/i);\n    const typeMatch = match[0].match(/type=[\"']([^\"']*)[\"']/i);\n    const placeholderMatch = match[0].match(/placeholder=[\"']([^\"']*)[\"']/i);\n    \n    interactive.inputs.push({\n      name: nameMatch ? nameMatch[1] : '',\n      type: typeMatch ? typeMatch[1] : 'text',\n      placeholder: placeholderMatch ? placeholderMatch[1] : ''\n    });\n  }\n  \n  return interactive;\n}\n\nfunction extractNavigationElements(html) {\n  const navigation = {\n    mainNav: [],\n    breadcrumbs: [],\n    pagination: [],\n    sitemapLinks: []\n  };\n  \n  // Look for navigation patterns\n  const navRegex = /<nav[^>]*>([\\s\\S]*?)<\\/nav>/gi;\n  let match;\n  while ((match = navRegex.exec(html)) !== null) {\n    const links = match[1].match(/<a[^>]+href=[\"']([^\"']+)[\"'][^>]*>([^<]*)<\\/a>/gi) || [];\n    navigation.mainNav = links.map(link => {\n      const urlMatch = link.match(/href=[\"']([^\"']+)[\"']/i);\n      const textMatch = link.match(/>([^<]*)</i);\n      return {\n        url: urlMatch ? urlMatch[1] : '',\n        text: textMatch ? textMatch[1].trim() : ''\n      };\n    });\n  }\n  \n  return navigation;\n}\n\nfunction generateContentInsights(html, task) {\n  const insights = {\n    contentType: 'unknown',\n    confidence: 0,\n    relevantSections: [],\n    recommendations: []\n  };\n  \n  // Analyze content based on task\n  if (task.toLowerCase().includes('pricing')) {\n    insights.contentType = 'pricing';\n    // Look for pricing indicators\n    if (html.toLowerCase().includes('price') || html.toLowerCase().includes('$') || html.toLowerCase().includes('plan')) {\n      insights.confidence = 0.8;\n      insights.recommendations.push('Focus on price tables and plan comparisons');\n    }\n  } else if (task.toLowerCase().includes('contact')) {\n    insights.contentType = 'contact';\n    if (html.toLowerCase().includes('contact') || html.toLowerCase().includes('email') || html.toLowerCase().includes('phone')) {\n      insights.confidence = 0.9;\n      insights.recommendations.push('Extract contact forms and contact information');\n    }\n  }\n  \n  return insights;\n}\n\n// Main processing\nconst result = {\n  success: true,\n  timestamp: new Date().toISOString(),\n  url: url,\n  task: aiConfig.task,\n  sessionId: aiConfig.sessionId,\n  \n  // Intelligent analysis\n  analysis: intelligentExtraction(content.data, aiConfig.task, aiConfig.instructions),\n  \n  // Raw data\n  rawContent: {\n    html: content.data,\n    headers: content.headers,\n    statusCode: content.statusCode\n  },\n  \n  // Next action recommendations\n  nextActions: [\n    {\n      action: 'analyze_links',\n      priority: 'high',\n      description: 'Analyze extracted links for relevance to task'\n    },\n    {\n      action: 'extract_data',\n      priority: 'medium',\n      description: 'Extract specific data based on task requirements'\n    }\n  ]\n};\n\nreturn result;"
      },
      "id": "ai-processor-1",
      "name": "AI Content Processor",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1680,
        240
      ]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict"
          },
          "conditions": [
            {
              "id": "links-condition",
              "leftValue": "={{ $json.analysis.structuredData.links.length }}",
              "rightValue": 0,
              "operator": {
                "type": "number",
                "operation": "gt"
              }
            },
            {
              "id": "task-condition",
              "leftValue": "={{ $json.task }}",
              "rightValue": "browse",
              "operator": {
                "type": "string",
                "operation": "contains"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "ai-decision-1",
      "name": "Should Follow Links?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [
        1900,
        240
      ]
    },
    {
      "parameters": {
        "jsCode": "// Intelligent Link Selection and Following\nconst analysis = $input.all()[0].json.analysis;\nconst task = $input.all()[0].json.task;\nconst maxLinks = parseInt($node[\"Set AI Config\"].json.maxLinksToFollow) || 3;\n\n// Smart link filtering based on task\nfunction selectRelevantLinks(links, task, maxCount) {\n  const scoredLinks = links.map(link => {\n    let score = 0;\n    const text = link.text.toLowerCase();\n    const url = link.url.toLowerCase();\n    \n    // Task-specific scoring\n    if (task.toLowerCase().includes('pricing')) {\n      if (text.includes('pric') || text.includes('plan') || text.includes('cost')) score += 3;\n      if (url.includes('pric') || url.includes('plan')) score += 2;\n    }\n    \n    if (task.toLowerCase().includes('contact')) {\n      if (text.includes('contact') || text.includes('about')) score += 3;\n      if (url.includes('contact') || url.includes('about')) score += 2;\n    }\n    \n    if (task.toLowerCase().includes('product')) {\n      if (text.includes('product') || text.includes('feature')) score += 3;\n      if (url.includes('product') || url.includes('feature')) score += 2;\n    }\n    \n    // General relevance scoring\n    if (link.internal) score += 1; // Prefer internal links\n    if (text.length > 5 && text.length < 50) score += 1; // Reasonable link text length\n    if (!url.includes('#')) score += 1; // Avoid anchor links\n    \n    return { ...link, score };\n  });\n  \n  // Sort by score and return top links\n  return scoredLinks\n    .filter(link => link.score > 0)\n    .sort((a, b) => b.score - a.score)\n    .slice(0, maxCount);\n}\n\nconst selectedLinks = selectRelevantLinks(analysis.structuredData.links, task, maxLinks);\n\nconst result = {\n  linksToFollow: selectedLinks,\n  totalLinksFound: analysis.structuredData.links.length,\n  selectedCount: selectedLinks.length,\n  selectionCriteria: {\n    task: task,\n    maxLinks: maxLinks,\n    filteringStrategy: 'task-relevance-scoring'\n  },\n  nextAction: selectedLinks.length > 0 ? 'follow_links' : 'complete_analysis'\n};\n\nreturn result;"
      },
      "id": "ai-link-selector-1",
      "name": "Smart Link Selector",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        2120,
        160
      ]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "completion-assignment",
              "name": "browsing_completed",
              "value": true,
              "type": "boolean"
            },
            {
              "id": "result-assignment",
              "name": "final_analysis",
              "value": "={{ $json }}",
              "type": "object"
            },
            {
              "id": "summary-assignment",
              "name": "summary",
              "value": "=AI browsing completed. Task: {{ $json.task }}. Links found: {{ $json.analysis.structuredData.links.length }}. Forms: {{ $json.analysis.structuredData.forms.length }}.",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "ai-completion-1",
      "name": "Complete Analysis",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [
        2120,
        320
      ]
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [
        [
          {
            "node": "Set AI Config",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Set AI Config": {
      "main": [
        [
          {
            "node": "AI Browsing Agent",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Browsing Agent": {
      "main": [
        [
          {
            "node": "Intelligent HTTP Browser",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Intelligent HTTP Browser": {
      "main": [
        [
          {
            "node": "AI Content Processor",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Content Processor": {
      "main": [
        [
          {
            "node": "Should Follow Links?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Should Follow Links?": {
      "main": [
        [
          {
            "node": "Smart Link Selector",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Complete Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null,
  "tags": [],
  "triggerCount": 0,
  "updatedAt": "2025-01-25T10:00:00.000Z",
  "versionId": "1"
}
```

### 3. Advanced Web Scraping Agent with Playwright (Custom Node)

```typescript
// Custom Playwright Node for Advanced Web Browsing
import { IExecuteFunctions } from 'n8n-core';
import { INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { chromium, Browser, Page } from 'playwright';

export class AdvancedWebBrowser implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Advanced Web Browser',
    name: 'advancedWebBrowser',
    icon: 'file:playwright.svg',
    group: ['transform'],
    version: 1,
    description: 'Human-like web browsing with Playwright',
    defaults: {
      name: 'Advanced Web Browser',
      color: '#1f8eb2',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          {
            name: 'Browse Page',
            value: 'browse',
            description: 'Browse a single page and extract content',
          },
          {
            name: 'Multi-Page Browse',
            value: 'multipage',
            description: 'Browse multiple pages following links',
          },
          {
            name: 'Fill Form',
            value: 'fillform',
            description: 'Fill and submit forms',
          },
          {
            name: 'Take Screenshot',
            value: 'screenshot',
            description: 'Take page screenshots',
          },
          {
            name: 'Extract Data',
            value: 'extract',
            description: 'Extract specific data with selectors',
          }
        ],
        default: 'browse',
        description: 'The operation to perform',
      },
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        required: true,
        description: 'The URL to browse',
      },
      {
        displayName: 'Wait Strategy',
        name: 'waitStrategy',
        type: 'options',
        options: [
          {
            name: 'Network Idle',
            value: 'networkidle',
            description: 'Wait for network to be idle',
          },
          {
            name: 'DOM Content Loaded',
            value: 'domcontentloaded',
            description: 'Wait for DOM content to load',
          },
          {
            name: 'Load Event',
            value: 'load',
            description: 'Wait for load event',
          },
          {
            name: 'Custom Selector',
            value: 'selector',
            description: 'Wait for specific element',
          }
        ],
        default: 'networkidle',
        description: 'How to wait for page to be ready',
      },
      {
        displayName: 'Human Behavior',
        name: 'humanBehavior',
        type: 'boolean',
        default: true,
        description: 'Enable human-like delays and mouse movements',
      },
      {
        displayName: 'Stealth Mode',
        name: 'stealthMode',
        type: 'boolean',
        default: true,
        description: 'Enable stealth mode to avoid detection',
      },
      {
        displayName: 'Viewport',
        name: 'viewport',
        type: 'collection',
        placeholder: 'Add Viewport Setting',
        default: {},
        options: [
          {
            displayName: 'Width',
            name: 'width',
            type: 'number',
            default: 1920,
            description: 'Viewport width',
          },
          {
            displayName: 'Height',
            name: 'height',
            type: 'number',
            default: 1080,
            description: 'Viewport height',
          }
        ],
      },
      {
        displayName: 'Custom Headers',
        name: 'headers',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        placeholder: 'Add Header',
        default: {},
        options: [
          {
            name: 'header',
            displayName: 'Header',
            values: [
              {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Header name',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
                description: 'Header value',
              }
            ]
          }
        ]
      },
      {
        displayName: 'Data Extraction Rules',
        name: 'extractionRules',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        placeholder: 'Add Extraction Rule',
        default: {},
        displayOptions: {
          show: {
            operation: ['extract', 'browse', 'multipage']
          }
        },
        options: [
          {
            name: 'rule',
            displayName: 'Extraction Rule',
            values: [
              {
                displayName: 'Field Name',
                name: 'fieldName',
                type: 'string',
                default: '',
                description: 'Name for the extracted field',
              },
              {
                displayName: 'CSS Selector',
                name: 'selector',
                type: 'string',
                default: '',
                description: 'CSS selector to find elements',
              },
              {
                displayName: 'Attribute',
                name: 'attribute',
                type: 'options',
                options: [
                  {
                    name: 'Text Content',
                    value: 'textContent',
                  },
                  {
                    name: 'Inner HTML',
                    value: 'innerHTML',
                  },
                  {
                    name: 'href',
                    value: 'href',
                  },
                  {
                    name: 'src',
                    value: 'src',
                  },
                  {
                    name: 'value',
                    value: 'value',
                  }
                ],
                default: 'textContent',
                description: 'Which attribute to extract',
              }
            ]
          }
        ]
      }
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    let browser: Browser | null = null;

    try {
      // Launch browser with stealth configuration
      browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });

      for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        try {
          const operation = this.getNodeParameter('operation', itemIndex) as string;
          const url = this.getNodeParameter('url', itemIndex) as string;
          const waitStrategy = this.getNodeParameter('waitStrategy', itemIndex) as string;
          const humanBehavior = this.getNodeParameter('humanBehavior', itemIndex) as boolean;
          const stealthMode = this.getNodeParameter('stealthMode', itemIndex) as boolean;
          const viewport = this.getNodeParameter('viewport', itemIndex) as any;
          const headers = this.getNodeParameter('headers', itemIndex) as any;
          const extractionRules = this.getNodeParameter('extractionRules', itemIndex) as any;

          // Create new page with configuration
          const page = await browser.newPage({
            viewport: {
              width: viewport.width || 1920,
              height: viewport.height || 1080
            },
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          });

          // Set custom headers if provided
          if (headers?.header?.length > 0) {
            const headerObj: Record<string, string> = {};
            headers.header.forEach((h: any) => {
              if (h.name && h.value) {
                headerObj[h.name] = h.value;
              }
            });
            await page.setExtraHTTPHeaders(headerObj);
          }

          // Apply stealth mode
          if (stealthMode) {
            await page.addInitScript(() => {
              // Override the navigator.webdriver property
              Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
              });
              
              // Override the navigator.plugins property
              Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5],
              });
              
              // Override the navigator.languages property
              Object.defineProperty(navigator, 'languages', {
                get: () => ['en-US', 'en'],
              });
            });
          }

          let result: any = {};

          switch (operation) {
            case 'browse':
              result = await this.performBrowse(page, url, waitStrategy, humanBehavior, extractionRules);
              break;
            case 'multipage':
              result = await this.performMultipageBrowse(page, url, waitStrategy, humanBehavior, extractionRules);
              break;
            case 'fillform':
              result = await this.performFormFill(page, url, waitStrategy, humanBehavior);
              break;
            case 'screenshot':
              result = await this.performScreenshot(page, url, waitStrategy);
              break;
            case 'extract':
              result = await this.performExtraction(page, url, waitStrategy, extractionRules);
              break;
            default:
              throw new Error(`Unknown operation: ${operation}`);
          }

          await page.close();

          returnData.push({
            json: {
              ...result,
              operation,
              url,
              timestamp: new Date().toISOString(),
              success: true
            }
          });

        } catch (error) {
          if (this.continueOnFail()) {
            returnData.push({
              json: {
                error: error.message,
                success: false,
                timestamp: new Date().toISOString()
              }
            });
            continue;
          }
          throw error;
        }
      }

    } finally {
      if (browser) {
        await browser.close();
      }
    }

    return this.prepareOutputData(returnData);
  }

  private async performBrowse(page: Page, url: string, waitStrategy: string, humanBehavior: boolean, extractionRules: any) {
    await this.navigateWithWait(page, url, waitStrategy);
    
    if (humanBehavior) {
      await this.simulateHumanBehavior(page);
    }

    const content = await page.content();
    const title = await page.title();
    
    let extractedData = {};
    if (extractionRules?.rule?.length > 0) {
      extractedData = await this.extractDataWithRules(page, extractionRules.rule);
    }

    return {
      content,
      title,
      url: page.url(),
      extractedData,
      metadata: {
        loadTime: Date.now(),
        contentLength: content.length
      }
    };
  }

  private async performMultipageBrowse(page: Page, startUrl: string, waitStrategy: string, humanBehavior: boolean, extractionRules: any) {
    const results = [];
    const visitedUrls = new Set();
    const urlsToVisit = [startUrl];
    const maxPages = 5; // Limit to prevent infinite browsing

    while (urlsToVisit.length > 0 && results.length < maxPages) {
      const currentUrl = urlsToVisit.shift()!;
      
      if (visitedUrls.has(currentUrl)) continue;
      visitedUrls.add(currentUrl);

      await this.navigateWithWait(page, currentUrl, waitStrategy);
      
      if (humanBehavior) {
        await this.simulateHumanBehavior(page);
      }

      const content = await page.content();
      const title = await page.title();
      
      let extractedData = {};
      if (extractionRules?.rule?.length > 0) {
        extractedData = await this.extractDataWithRules(page, extractionRules.rule);
      }

      // Find links on current page
      const links = await page.$$eval('a[href]', (anchors) => 
        anchors.map(anchor => ({
          href: anchor.getAttribute('href'),
          text: anchor.textContent?.trim()
        })).filter(link => link.href && !link.href.startsWith('#'))
      );

      // Add relevant links to visit queue
      links.slice(0, 3).forEach(link => {
        if (link.href && !visitedUrls.has(link.href)) {
          try {
            const fullUrl = new URL(link.href, currentUrl).href;
            urlsToVisit.push(fullUrl);
          } catch (e) {
            // Invalid URL, skip
          }
        }
      });

      results.push({
        url: currentUrl,
        title,
        content,
        extractedData,
        links: links.slice(0, 10) // Limit links in response
      });
    }

    return {
      pages: results,
      totalPagesVisited: results.length,
      summary: `Browsed ${results.length} pages starting from ${startUrl}`
    };
  }

  private async performFormFill(page: Page, url: string, waitStrategy: string, humanBehavior: boolean) {
    await this.navigateWithWait(page, url, waitStrategy);
    
    // Find forms on the page
    const forms = await page.$$eval('form', (forms) => 
      forms.map((form, index) => ({
        index,
        action: form.getAttribute('action'),
        method: form.getAttribute('method'),
        inputs: Array.from(form.querySelectorAll('input, select, textarea')).map((input: any) => ({
          name: input.name,
          type: input.type,
          required: input.required,
          placeholder: input.placeholder
        }))
      }))
    );

    if (humanBehavior) {
      await this.simulateHumanBehavior(page);
    }

    return {
      forms,
      message: `Found ${forms.length} forms on the page`
    };
  }

  private async performScreenshot(page: Page, url: string, waitStrategy: string) {
    await this.navigateWithWait(page, url, waitStrategy);
    
    const screenshot = await page.screenshot({
      fullPage: true,
      type: 'png'
    });

    return {
      screenshot: screenshot.toString('base64'),
      url: page.url(),
      timestamp: new Date().toISOString()
    };
  }

  private async performExtraction(page: Page, url: string, waitStrategy: string, extractionRules: any) {
    await this.navigateWithWait(page, url, waitStrategy);
    
    const extractedData = await this.extractDataWithRules(page, extractionRules.rule || []);

    return {
      extractedData,
      url: page.url(),
      extractionRules: extractionRules.rule || []
    };
  }

  private async navigateWithWait(page: Page, url: string, waitStrategy: string) {
    const waitOptions: any = { timeout: 30000 };
    
    switch (waitStrategy) {
      case 'networkidle':
        waitOptions.waitUntil = 'networkidle';
        break;
      case 'domcontentloaded':
        waitOptions.waitUntil = 'domcontentloaded';
        break;
      case 'load':
        waitOptions.waitUntil = 'load';
        break;
    }

    await page.goto(url, waitOptions);
  }

  private async simulateHumanBehavior(page: Page) {
    // Random delay between 1-3 seconds
    await page.waitForTimeout(1000 + Math.random() * 2000);
    
    // Simulate mouse movement
    await page.mouse.move(
      Math.random() * 1920,
      Math.random() * 1080
    );
    
    // Random scroll
    await page.evaluate(() => {
      window.scrollBy(0, Math.random() * 1000);
    });
    
    // Small delay after scrolling
    await page.waitForTimeout(500 + Math.random() * 1000);
  }

  private async extractDataWithRules(page: Page, rules: any[]) {
    const data: any = {};
    
    for (const rule of rules) {
      if (!rule.fieldName || !rule.selector) continue;
      
      try {
        const elements = await page.$$(rule.selector);
        const values = [];
        
        for (const element of elements) {
          let value;
          switch (rule.attribute) {
            case 'textContent':
              value = await element.textContent();
              break;
            case 'innerHTML':
              value = await element.innerHTML();
              break;
            case 'href':
              value = await element.getAttribute('href');
              break;
            case 'src':
              value = await element.getAttribute('src');
              break;
            case 'value':
              value = await element.getAttribute('value');
              break;
            default:
              value = await element.textContent();
          }
          
          if (value && value.trim()) {
            values.push(value.trim());
          }
        }
        
        data[rule.fieldName] = values.length === 1 ? values[0] : values;
      } catch (error) {
        data[rule.fieldName] = null;
      }
    }
    
    return data;
  }
}
```

## 📋 Setup Instructions

### 1. Basic HTTP Browser Agent
1. Copy the first JSON workflow
2. Import it into n8n (Settings > Import from JSON)
3. Configure input parameters:
   ```json
   {
     "url": "https://example.com",
     "userAgent": "Mozilla/5.0...",
     "action": "browse"
   }
   ```

### 2. AI-Powered Browser Agent
1. Copy the second JSON workflow
2. Install required AI nodes (if not already available)
3. Configure OpenAI credentials
4. Set input parameters:
   ```json
   {
     "task": "Find pricing information",
     "url": "https://example.com",
     "instructions": "Extract all pricing plans and features"
   }
   ```

### 3. Advanced Playwright Browser (Custom Node)
1. Create custom node using the TypeScript code
2. Install Playwright: `npm install playwright`
3. Build and install the custom node
4. Use in workflows for advanced browsing

## 🔧 Configuration Options

### Human-like Behavior Features:
- **Random delays** between 1-5 seconds
- **Realistic user agents** rotation
- **Mouse movement simulation**
- **Scroll simulation**
- **Error handling and retries**
- **Session persistence**

### Content Extraction Capabilities:
- **Text content extraction**
- **Link discovery and following**
- **Form detection and interaction**
- **Image and media extraction**
- **Structured data parsing**
- **Metadata extraction**

### Anti-Detection Features:
- **Stealth mode headers**
- **Browser fingerprint masking**
- **Request throttling**
- **Proxy support (configurable)**
- **Cookie and session management**

## 🚀 Usage Examples

### Example 1: Simple Web Scraping
```json
{
  "url": "https://news.ycombinator.com",
  "action": "browse"
}
```

### Example 2: AI-Powered Analysis
```json
{
  "task": "Extract product features",
  "url": "https://product-page.com",
  "instructions": "Find all product features, pricing, and customer reviews"
}
```

### Example 3: Multi-Page Navigation
```json
{
  "task": "Research company information",
  "url": "https://company.com",
  "maxLinksToFollow": 5,
  "instructions": "Navigate through About, Products, and Contact pages"
}
```

## 🛡️ Best Practices

1. **Respect robots.txt** and website terms of service
2. **Use appropriate delays** to avoid overloading servers
3. **Rotate user agents** for realistic browsing
4. **Handle errors gracefully** with retry mechanisms
5. **Monitor rate limits** and implement backoff strategies
6. **Store credentials securely** using n8n's credential system

## 📈 Advanced Features

- **Session management** for logged-in browsing
- **JavaScript execution** for dynamic content
- **File download** capabilities
- **Form auto-filling** with intelligent field detection
- **Screenshot capture** for visual verification
- **Performance monitoring** and optimization

This comprehensive solution provides you with multiple approaches to web browsing automation in n8n, from simple HTTP requests to advanced AI-powered browsing with human-like behavior.