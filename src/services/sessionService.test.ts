import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sessionService } from './sessionService';

describe('Session API Service Layer - Integration Verification', () => {
  
  beforeEach(() => {
    // Reset all network interceptor mocks before every individual test block execution
    vi.restoreAllMocks();
  });

  it('should cleanly parse and resolve payload quantities on a successful database load pass', async () => {
    const mockPayload = { quantities: { 'Megapack 2XL': 4, 'Transformer': 2 } };
    
    // Simulate a standard successful HTTP 200 OK server network transaction
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockPayload,
    }));

    const quantities = await sessionService.loadSession('test-session-id');
    
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/session/test-session-id');
    expect(quantities).toEqual(mockPayload.quantities);
    expect(quantities['Megapack 2XL']).toBe(4);
  });

  it('should throw an explicit user-facing exception if the session record key does not exist on disk', async () => {
    // Simulate a standard HTTP 404 Not Found error state
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    }));

    await expect(sessionService.loadSession('invalid-id')).rejects.toThrow(
      'Saved session link invalid or not found.'
    );
  });

  it('should throw an evaluation exception if the server payload body lacks a structural quantities map', async () => {
    // Simulate a corrupted or malformed database JSON object format
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ corruptedField: {} }),
    }));

    await expect(sessionService.loadSession('corrupted-id')).rejects.toThrow(
      'Malformed session data.'
    );
  });

  it('should dispatch an explicit HTTP POST payload containing structural layout modifications during updates', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
    }));

    const updatePayload = { 'Megapack': 10 };
    await sessionService.updateSession('existing-session-abc', updatePayload);

    // Verify the correct URL routing, REST methods, headers, and stringified content matrices match our contracts
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/session/existing-session-abc',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantities: updatePayload }),
      })
    );
  });
});