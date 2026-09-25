# @pipeworx/openparliament-ca

OpenParliament.ca MCP — civic-tech mirror of the Parliament of Canada. House of Commons debates (Hansard), bills, votes, MPs, committee meetings. No auth.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1679+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/openparliament-ca/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1679+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/search_debates \
  -H 'Content-Type: application/json' \
  -d '{"politician":"justin-trudeau","limit":10}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/search_debates`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Standalone (no gateway account)

This package also runs as a local stdio MCP server — no Pipeworx account, no
gateway round-trip:

```json
{
  "mcpServers": {
    "openparliament-ca": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-openparliament-ca"]
    }
  }
}
```

Or run it directly to confirm it starts:

```bash
npx -y @pipeworx/mcp-openparliament-ca
```

It speaks MCP over stdin/stdout and answers `initialize`/`tools/list`/`tools/call`
for **only** this pack's tools — none of the shared meta-tools the gateway
connection above adds. Same source, same tools, no ask_pipeworx routing.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Openparliament Ca data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
