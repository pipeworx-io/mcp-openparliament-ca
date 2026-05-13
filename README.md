# mcp-openparliament-ca

OpenParliament.ca MCP — civic-tech mirror of the Parliament of Canada

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_debates` | Search Hansard contributions (debates). |
| `list_bills` | Bills. |
| `get_bill` | Bill detail. |
| `list_votes` | Recorded votes. |
| `list_politicians` | Current + historic MPs. |
| `get_politician` | Politician profile. |
| `list_committees` | House committees. |
| `list_committee_meetings` | Committee meetings (with witnesses + evidence). |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "openparliament-ca": {
      "url": "https://gateway.pipeworx.io/openparliament-ca/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Openparliament Ca data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
