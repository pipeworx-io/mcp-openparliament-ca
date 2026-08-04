# @pipeworx/openparliament-ca

OpenParliament.ca MCP — civic-tech mirror of the Parliament of Canada. House of Commons debates (Hansard), bills, votes, MPs, committee meetings. No auth.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

Note: this is a community-maintained project (Michael Mulley et al.) — not the official Library of Parliament APIs (which are XML-only and awkward). OpenParliament.ca ingests and republishes the data with a clean REST surface.

## Tools

- `search_debates(query, date_from?, date_to?, politician?, party?, limit?, offset?)` — Hansard contributions
- `list_bills(session?, sponsor?, status?, limit?, offset?)` — Parliament bills
- `get_bill(session, number)` — bill detail
- `list_votes(session?, limit?, offset?)` — recorded votes in the House
- `list_politicians(current?, party?, province?, name?, limit?, offset?)` — current + historic MPs
- `get_politician(slug)` — MP profile
- `list_committees(session?, limit?, offset?)` — House committees
- `list_committee_meetings(committee_slug?, date_from?, date_to?, limit?)` — meetings

## Data source

`https://api.openparliament.ca/` — JSON via `Accept: application/json` or `?format=json`.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
