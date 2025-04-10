<h3 align="center">
  <a href="https://rapidapp.io">🏠 Home page</a>
</h4>

# Rapidapp MCP Server

A Node.js server implementing Model Context Protocol (MCP) for [Rapidapp](https://rapidapp.io) PostgreSQL database operations.

## Overview

This MCP server allows AI assistants to do PostgreSQL database operation through the Rapidapp API.

## How to Use

In Claude Desktop, or any MCP Client, you can use natural language to accomplish things with Neon, such as:

- `Create a new Rapidapp PostgreSQL database called 'products'`
- `List all my Rapidapp PostgreSQL databases`
- `Get details of my Rapidapp PostgreSQL database with id of '123456'`
- `Create a Spring Boot application for simple product service with CRUD operations. Use the Rapidapp PostgreSQL database 'products' as the backend. Configure the application to connect to the database.`


#### API Key Requirement

**Important:** You need a Rapidapp API key to use this MCP server. Visit https://rapidapp.io to sign up and obtain your API key.

## Installation

### Usage with Cursor

1. Navigate to Cursor Settings > MCP
2. Add new MCP server with the following configuration:
   ```json
   {
     "mcpServers": {
       "rapidapp": {
         "command": "npx",
         "args": ["-y", "@rapidappio/rapidapp-mcp"],
         "env": {
           "RAPIDAPP_API_KEY": "<your-api-key>"
         }
       }
     }
   }
   ```

### Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "rapidapp": {
      "command": "npx",
      "args": ["-y", "@rapidappio/rapidapp-mcp"],
      "env": {
        "RAPIDAPP_API_KEY": "<your-api-key>"
      }
    }
  }
}
```

### Usage with Continue.dev

1. Open your Continue.dev configuration file in either format:

    - YAML:
        - MacOS/Linux: `~/.continue/config.yaml`
        - Windows: `%USERPROFILE%\.continue\config.yaml`
    - JSON:
        - Same location as above, but named `config.json`

2. Add the configuration using either format:

   YAML format:

   ```yaml
   experimental:
     modelContextProtocolServers:
       - transport:
           type: stdio
           command: node
           args: ["-y", "@rapidappio/rapidapp-mcp"]
           env: { "RAPIDAPP_API_KEY": "<your-api-key>" }
   ```

   JSON format:

   ```json
   {
     "experimental": {
       "modelContextProtocolServers": [
         {
           "transport": {
             "type": "stdio",
             "command": "npx",
             "args": ["-y", "@rapidappio/rapidapp-mcp"],
             "env": { "RAPIDAPP_API_KEY": "<your-api-key>" }
           }
         }
       ]
     }
   }
   ```

3. Save the file - Continue will automatically refresh to apply the new configuration. If the changes don't take effect immediately, try restarting your IDE.

## Installing via Smithery

Smithery provides the easiest way to install and configure the Rapidapp MCP across various AI assistant platforms.

```
# Claude
npx -y @smithery/cli@latest install @rapidappio/rapidapp-mcp --client claude

# Cursor
npx -y @smithery/cli@latest install @rapidappio/rapidapp-mcp --client cursor

# Windsurf
npx -y @smithery/cli@latest install@rapidappio/rapidapp-mcp --client windsurf
```

For more information and additional integration options, visit https://smithery.ai/server/@rapidappio/rapidapp-mcp