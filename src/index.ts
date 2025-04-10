#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import {RapidappClient} from "@rapidappio/rapidapp-node";

const RAPIDAPP_API_KEY = process.env.RAPIDAPP_API_KEY || "";
const rapidappClient = new RapidappClient({
    apiKey: RAPIDAPP_API_KEY,
});

// Define Zod schemas for validation
const CreateArgumentsSchema = z.object({
    name: z.string(),
});

const GetArgumentsSchema = z.object({
    id: z.string(),
});

// Create server instance
const server = new Server(
    {
        name: "rapidapp",
        version: "1.0.0"
    }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "create_database",
                description: "Create a new Rapidapp PostgreSQL database",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "Name of the database to create",
                        },
                    },
                    required: ["name"],
                },
            },
            {
                name: "list_databases",
                description: "List all Rapidapp PostgreSQL databases",
            },
            {
                name: "get_database",
                description: "Get details of a Rapidapp PostgreSQL database",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "ID of the database to retrieve",
                        },
                    },
                    required: ["id"],
                },
            },
        ],
    };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (!RAPIDAPP_API_KEY || RAPIDAPP_API_KEY.trim() === "") {
        throw new Error("RAPIDAPP_API_KEY environment variable not set. Please set this variable to use the Rapidapp API.");
    }
    const { name, arguments: args } = request.params;

    try {
        if (name === "create_database") {
            const { name } = CreateArgumentsSchema.parse(args);

            await rapidappClient.createPostgres(name);

            return {
                content: [
                    {
                        type: "text",
                        text: `Successfully created database: ${name}`,
                    },
                ],
            };
        } else if (name === "list_databases") {
            const databases = await rapidappClient.listPostgres();

            const databaseList = databases.getItemsList().map(db => `${db.getId()}: ${db.getName()}`).join('\n');
            return {
                content: [
                    {
                        type: "text",
                        text: `Databases:\n${databaseList}`,
                    },
                ],
            }
        } else if (name === "get_database") {
            const { id } = GetArgumentsSchema.parse(args);

            const database = await rapidappClient.getPostgres(id);
            return {
                content: [
                    {
                        type: "text",
                        text: database,
                    },
                ],
            };

        } else {
            throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(
                `Invalid arguments: ${error.errors
                    .map((e) => `${e.path.join(".")}: ${e.message}`)
                    .join(", ")}`
            );
        }
        throw error;
    }
});

// Start the server
async function main() {
    try {
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.info("Rapidapp MCP Server running on stdio");
    } catch (error) {
        console.error("Error during startup:", error);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
});