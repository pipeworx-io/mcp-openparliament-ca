interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * OpenParliament.ca MCP — civic-tech mirror of the Parliament of Canada
 *
 * Auth: none.
 * Docs: https://api.openparliament.ca/
 * Source code: github.com/michaelmulley/openparliament
 */


const BASE = 'https://api.openparliament.ca';

const tools: McpToolExport['tools'] = [
  {
    name: 'search_debates',
    description: 'Search Hansard contributions (debates).',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Full-text query' },
        date_from: { type: 'string', description: 'YYYY-MM-DD' },
        date_to: { type: 'string', description: 'YYYY-MM-DD' },
        politician: { type: 'string', description: 'Politician slug' },
        party: { type: 'string', description: 'Party slug (e.g. "liberal", "conservative")' },
        limit: { type: 'number', description: '1-100 (default 20)' },
        offset: { type: 'number', description: '0-based offset' },
      },
      required: ['query'],
    },
  },
  {
    name: 'list_bills',
    description: 'Bills.',
    inputSchema: {
      type: 'object',
      properties: {
        session: { type: 'string', description: 'Parliament-session (e.g. "44-1")' },
        sponsor: { type: 'string', description: 'Sponsor politician slug' },
        status: { type: 'string' },
        limit: { type: 'number' },
        offset: { type: 'number' },
      },
    },
  },
  {
    name: 'get_bill',
    description: 'Bill detail.',
    inputSchema: {
      type: 'object',
      properties: {
        session: { type: 'string', description: 'Session (e.g. "44-1")' },
        number: { type: 'string', description: 'Bill number (e.g. "C-318")' },
      },
      required: ['session', 'number'],
    },
  },
  {
    name: 'list_votes',
    description: 'Recorded votes.',
    inputSchema: {
      type: 'object',
      properties: {
        session: { type: 'string' },
        limit: { type: 'number' },
        offset: { type: 'number' },
      },
    },
  },
  {
    name: 'list_politicians',
    description: 'Current + historic MPs.',
    inputSchema: {
      type: 'object',
      properties: {
        current: { type: 'boolean', description: 'Only currently sitting (default true)' },
        party: { type: 'string', description: 'Party slug' },
        province: { type: 'string', description: 'Province code (e.g. "ON")' },
        name: { type: 'string', description: 'Name fragment' },
        limit: { type: 'number' },
        offset: { type: 'number' },
      },
    },
  },
  {
    name: 'get_politician',
    description: 'Politician profile.',
    inputSchema: {
      type: 'object',
      properties: { slug: { type: 'string', description: 'Politician slug' } },
      required: ['slug'],
    },
  },
  {
    name: 'list_committees',
    description: 'House committees.',
    inputSchema: {
      type: 'object',
      properties: {
        session: { type: 'string' },
        limit: { type: 'number' },
        offset: { type: 'number' },
      },
    },
  },
  {
    name: 'list_committee_meetings',
    description: 'Committee meetings (with witnesses + evidence).',
    inputSchema: {
      type: 'object',
      properties: {
        committee_slug: { type: 'string', description: 'Committee slug filter' },
        date_from: { type: 'string' },
        date_to: { type: 'string' },
        limit: { type: 'number' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_debates': {
      const params = new URLSearchParams({
        q: reqStr(args, 'query', '"carbon tax"'),
        format: 'json',
        limit: String(Math.min(100, Math.max(1, (args.limit as number) ?? 20))),
        offset: String(Math.max(0, (args.offset as number) ?? 0)),
      });
      if (args.date_from) params.set('date__gte', String(args.date_from));
      if (args.date_to) params.set('date__lte', String(args.date_to));
      if (args.politician) params.set('politician', String(args.politician));
      if (args.party) params.set('party', String(args.party));
      return opGet(`/speeches/?${params}`);
    }
    case 'list_bills':
      return opGet(`/bills/${appendParams(args, ['session', 'sponsor', 'status'])}`);
    case 'get_bill': {
      const session = reqStr(args, 'session', '"44-1"');
      const number = reqStr(args, 'number', '"C-318"');
      return opGet(`/bills/${encodeURIComponent(session)}/${encodeURIComponent(number)}/?format=json`);
    }
    case 'list_votes':
      return opGet(`/votes/${appendParams(args, ['session'])}`);
    case 'list_politicians': {
      const params = new URLSearchParams({
        format: 'json',
        limit: String(Math.min(100, Math.max(1, (args.limit as number) ?? 20))),
        offset: String(Math.max(0, (args.offset as number) ?? 0)),
      });
      if (args.party) params.set('party', String(args.party));
      if (args.province) params.set('province', String(args.province));
      if (args.name) params.set('q', String(args.name));
      const path = args.current === false ? '/politicians/' : '/politicians/?current=true&';
      // collapse leading "?" duplication
      const final = `${path.includes('?') ? path : `${path}?`}${params}`.replace('?&', '?').replace(/\?$/, '');
      return opGet(final);
    }
    case 'get_politician':
      return opGet(`/politicians/${encodeURIComponent(reqStr(args, 'slug', '"chrystia-freeland"'))}/?format=json`);
    case 'list_committees':
      return opGet(`/committees/${appendParams(args, ['session'])}`);
    case 'list_committee_meetings': {
      const params = new URLSearchParams({
        format: 'json',
        limit: String(Math.min(100, Math.max(1, (args.limit as number) ?? 20))),
      });
      if (args.committee_slug) params.set('committee', String(args.committee_slug));
      if (args.date_from) params.set('date__gte', String(args.date_from));
      if (args.date_to) params.set('date__lte', String(args.date_to));
      return opGet(`/committees/meetings/?${params}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function appendParams(args: Record<string, unknown>, keys: string[]): string {
  const params = new URLSearchParams({
    format: 'json',
    limit: String(Math.min(100, Math.max(1, (args.limit as number) ?? 20))),
    offset: String(Math.max(0, (args.offset as number) ?? 0)),
  });
  for (const k of keys) {
    if (args[k] !== undefined && args[k] !== null && String(args[k]).trim()) {
      params.set(k, String(args[k]));
    }
  }
  return `?${params}`;
}

async function opGet(path: string) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'pipeworx-mcp-openparliament-ca/1.0 (+https://pipeworx.io)',
    },
  });
  if (res.status === 404) throw new Error('OpenParliament.ca: not found');
  if (res.status === 429) throw new Error('OpenParliament.ca: rate-limit (HTTP 429)');
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OpenParliament.ca error: ${res.status} ${t.slice(0, 200)}`);
  }
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
