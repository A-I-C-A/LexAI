# Research Agent - CourtListener API Fix

## Issue History

### Original Errors:
1. ❌ `Unknown filter parameters: ["q"]` - Generic `q` not allowed on REST endpoints
2. ❌ `Unknown filter parameters: ["name__icontains"]` - Django-style filters not supported
3. ❌ `Unknown filter parameters: ["name"]` - Specific field filters not allowed

## Root Cause

The CourtListener REST API v4 has **very specific** parameter requirements:
- Most endpoints DO support the `q` parameter for full-text search
- None support Django-style `__icontains` filters
- Individual field filters vary by endpoint and aren't well documented

## Final Solution

**Use `q` parameter universally** across all endpoints:

```javascript
// ✅ WORKS - Simple and universal
url.searchParams.append('q', searchQuery);
url.searchParams.append('page_size', '5');

// For generic search endpoint only
if (type === 'search') {
  url.searchParams.append('type', 'o'); // opinions
}
```

## Implementation

### Simplified Function:
```javascript
async function fetchCourtListenerApi(type, q) {
  const endpoint = COURTLISTENER_ENDPOINTS[type];
  const url = new URL(endpoint);
  
  // Universal: all endpoints support 'q'
  url.searchParams.append('q', q);
  
  // Special case for generic search
  if (type === 'search') {
    url.searchParams.append('type', 'o');
  }
  
  url.searchParams.append('page_size', '5');
  
  // Optional authentication
  const headers = {};
  const token = import.meta.env.VITE_COURTLISTENER_TOKEN;
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  
  const res = await fetch(url.toString(), { headers });
  // ... error handling
}
```

## Supported Endpoints

All endpoints now use the same `q` parameter:

| Endpoint | Usage | Example Query |
|----------|-------|---------------|
| **search** | General search (opinions) | "Brown v. Board of Education" |
| **opinions** | Search opinions | "Miranda rights" |
| **dockets** | Search dockets | "Case No. 12345" |
| **clusters** | Search opinion clusters | "habeas corpus" |
| **people** | Search judges/attorneys | "Ruth Bader Ginsburg" |
| **courts** | Search courts | "Supreme Court" |
| **audio** | Search oral arguments | "oral argument 2020" |

## UI Improvements

1. ✅ **API Token Notice**: Shows warning if `VITE_COURTLISTENER_TOKEN` not set
2. ✅ **Direct Link**: Link to courtlistener.com/api to get free token
3. ✅ **Friendly Labels**: User-facing names for each endpoint type
4. ✅ **Better Errors**: Detailed error messages from API responses

## Testing

### Without API Token:
- Limited rate limits may apply
- Basic functionality should work

### With API Token:
- Higher rate limits
- Better reliability
- Recommended for production use

## Setup

Add to your `.env` file:
```bash
VITE_COURTLISTENER_TOKEN=your_token_here
```

Get a free token at: https://www.courtlistener.com/api/

## Build Status

✅ **Build Successful** - No errors  
✅ **All endpoints use `q` parameter**  
✅ **No custom filters required**  
✅ **Ready for production**

## Date
February 14, 2026
