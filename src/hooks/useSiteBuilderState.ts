import { useState, useEffect } from 'react';
import { DEVICE_SPECS } from '../types';
import { sessionService } from '../services/sessionService';

export function useSiteBuilderState() {
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    DEVICE_SPECS.forEach(spec => { initial[spec.name] = 0; });
    return initial;
  });

  // Track the persistent database record key to handle PUT/Update logic smoothly
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [shareableUrl, setShareableUrl] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Auto-restore state on mount if a tracking session parameter exists in the URL string
  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session');
    
    // TYPE GUARD: Instantly exit if sessionId is null or empty. 
    // This narrows the type down from 'string | null' to strictly 'string'.
    if (!sessionId) return;

    async function restoreSession(validId: string) {
      try {
        setStatusMessage('Restoring blueprint from disk server...');
        const restoredQuantities = await sessionService.loadSession(validId);
        
        // Lock this session ID into our persistent state container
        setActiveSessionId(validId);
        setQuantities(restoredQuantities);
        setShareableUrl(`${window.location.origin}/?session=${validId}`);
        setStatusMessage('Blueprint restored successfully!');
      } catch (error: any) {
        setStatusMessage(error.message || 'Error connecting to backend services.');
      }
    }
    
    restoreSession(sessionId);
  }, []);

  /**
   * Enforces business layout validation policies (1 Transformer per 2 Batteries)
   */
  const updateQuantity = (name: string, count: number) => {
    setQuantities(prev => {
      const updated = { ...prev, [name]: Math.max(0, count) };

      const totalBatteries = DEVICE_SPECS
        .filter(spec => spec.type === 'battery')
        .reduce((sum, spec) => sum + updated[spec.name], 0);

      // Core rule validation guard
      updated['Transformer'] = Math.ceil(totalBatteries / 2);
      return updated;
    });
  };

  /**
   * Dispatches current configurations to the database, branching dynamically on edit state
   */
  const saveSession = async () => {
    try {
      if (activeSessionId) {
        // PATH A: The blueprint was loaded from an existing session link. Overwrite it.
        setStatusMessage('Updating existing blueprint layout...');
        await sessionService.updateSession(activeSessionId, quantities);
        
        setStatusMessage('Configuration updated successfully in place!');
      } else {
        // PATH B: Fresh canvas workspace. Generate a new database snapshot entry.
        setStatusMessage('Saving new blueprint to disk...');
        const uniqueId = await sessionService.saveSession(quantities);
        
        // Elevate the workspace to an update-safe ecosystem for subsequent user edits
        setActiveSessionId(uniqueId);
        setShareableUrl(`${window.location.origin}/?session=${uniqueId}`);
        setStatusMessage('Saved successfully!');
      }
    } catch (error: any) {
      setStatusMessage(error.message || 'Error reaching backend network services.');
    }
  };

  return {
    quantities,
    activeSessionId,
    shareableUrl,
    statusMessage,
    updateQuantity,
    saveSession,
  };
}