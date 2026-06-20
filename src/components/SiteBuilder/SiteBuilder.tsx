import { useSiteBuilderState } from '../../hooks/useSiteBuilderState';
import ConfigurationPanel from './ConfigurationPanel/ConfigurationPanel';
import SiteLayout from './SiteLayout/SiteLayout';
import './SiteBuilder.css';

/**
 * SiteBuilder Root Orchestrator
 * Coordinates site inventory states, business rules, and canvas layouts.
 */
export default function SiteBuilder() {
  // Centralized state, cloud sync API methods, and hardware validation logic
  const {
    quantities,
    shareableUrl,
    statusMessage,
    updateQuantity,
    saveSession,
  } = useSiteBuilderState();

  return (
    <div className="site-builder-wrapper">
      
      {/* Cloud Sync & Session Persistence Controls */}
      <div className="session-bar">
        <button onClick={saveSession} className="btn-save">
          Save Configuration & Generate Link
        </button>
        
        {shareableUrl && (
          <div className="share-link-display">
            <span className="share-label">Shareable Blueprint URL:</span>
            <input 
              type="text" 
              readOnly 
              value={shareableUrl} 
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="share-url-input"
            />
          </div>
        )}
        
        {statusMessage && <span className="session-status">{statusMessage}</span>}
      </div>

      {/* Main Workspace: Splits parameter configurations from layout rendering */}
      <div className="site-builder-container">
        
        {/* Left Column: Asset quantity inputs (triggers 2:1 battery-to-transformer validation) */}
        <div className="column-left">
          <ConfigurationPanel 
            quantities={quantities} 
            onQuantityChange={updateQuantity} 
          />
        </div>

        {/* Right Column: Deterministic layout blueprint and dimensional analysis */}
        <div className="column-right">
          <SiteLayout quantities={quantities} />
        </div>
      </div>
    </div>
  );
}