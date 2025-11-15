import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

export default defineEventHandler(async (event) => {
  // Create MCP server instance
  const server = new Server(
    {
      name: 'vuefes-speakers',
      version: '1.0.0',
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    },
  );

  // List resources handler
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: 'resource://vuefes-japan-speakers-all',
          name: 'All Speakers',
          description: 'Complete list of all Vue Fes Japan speakers across all years',
          mimeType: 'application/json',
        },
        {
          uri: 'resource://vuefes-japan-speakers-statistics',
          name: 'Speaker Statistics',
          description: 'Statistical information about Vue Fes Japan speakers',
          mimeType: 'application/json',
        },
      ],
    };
  });

  // Read resource handler
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;

    if (uri === 'resource://vuefes-japan-speakers-all') {
      const speakers = await $fetch('/api/mcp/list-all-speakers');
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(speakers, null, 2),
          },
        ],
      };
    }

    if (uri === 'resource://vuefes-japan-speakers-statistics') {
      const statistics = await $fetch('/api/mcp/get-statistics');
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(statistics, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown resource: ${uri}`);
  });

  // List tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'list_speakers',
          description: 'Get a list of all Vue Fes Japan speakers across all years',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_speakers_by_year',
          description: 'Get speakers for a specific year of Vue Fes Japan',
          inputSchema: {
            type: 'object',
            properties: {
              year: {
                type: 'string',
                description: 'The year to get speakers for (2018, 2019, 2022, 2023, 2024, 2025)',
                enum: ['2018', '2019', '2022', '2023', '2024', '2025'],
              },
            },
            required: ['year'],
          },
        },
        {
          name: 'search_speakers',
          description: 'Search for speakers by name',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The search query for speaker names',
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'get_statistics',
          description: 'Get statistical information about Vue Fes Japan speakers',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_years',
          description: 'Get a list of all years Vue Fes Japan was held',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    };
  });

  // Call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'list_speakers': {
        const speakers = await $fetch('/api/mcp/list-all-speakers');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(speakers, null, 2),
            },
          ],
        };
      }

      case 'get_speakers_by_year': {
        const { year } = args as { year: string };
        const speakers = await $fetch(`/api/mcp/get-speakers-by-year?year=${year}`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(speakers, null, 2),
            },
          ],
        };
      }

      case 'search_speakers': {
        const { query } = args as { query: string };
        const results = await $fetch(`/api/mcp/search-speakers?query=${encodeURIComponent(query)}`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case 'get_statistics': {
        const statistics = await $fetch('/api/mcp/get-statistics');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(statistics, null, 2),
            },
          ],
        };
      }

      case 'get_years': {
        const years = await $fetch('/api/mcp/get-years');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(years, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  });

  // Create transport
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
  });

  // Connect server to transport
  await server.connect(transport);

  // Handle the request
  await transport.handleRequest(event.node.req, event.node.res);

  // Cleanup on connection close
  event.node.req.on('close', async () => {
    await server.close();
    await transport.close();
  });
});
