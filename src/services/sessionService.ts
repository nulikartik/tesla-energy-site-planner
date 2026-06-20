const API_BASE_URL = 'http://localhost:5000/api/session';

export const sessionService = {
  /**
   * Fetches an existing layout blueprint session configuration by ID.
   */
  async loadSession(sessionId: string): Promise<Record<string, number>> {
    const response = await fetch(`${API_BASE_URL}/${sessionId}`);
    if (!response.ok) {
      throw new Error('Saved session link invalid or not found.');
    }
    const data = await response.json();
    if (!data?.quantities) {
      throw new Error('Malformed session data.');
    }
    return data.quantities;
  },

  /**
   * Saves the current layout blueprint quantities and returns a unique session identifier.
   */
  async saveSession(quantities: Record<string, number>): Promise<string> {
    const uniqueId = Math.random().toString(36).substring(2, 8);
    const response = await fetch(`${API_BASE_URL}/${uniqueId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantities }),
    });

    if (!response.ok) {
      throw new Error('Failed to save layout configuration.');
    }
    return uniqueId;
  },

  /**
   * Overwrites an existing layout blueprint session configuration by its active identifier.
   */
  async updateSession(sessionId: string, quantities: Record<string, number>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantities }),
    });

    if (!response.ok) {
      throw new Error('Failed to update existing layout configuration.');
    }
  },
};