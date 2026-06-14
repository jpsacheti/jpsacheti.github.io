import React, { useState, useRef, useEffect } from 'react';

// Git Branch Icon SVG
const GitBranchIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="15"></line>
    <circle cx="18" cy="6" r="3"></circle>
    <circle cx="6" cy="18" r="3"></circle>
    <path d="M18 9a9 9 0 0 1-9 9"></path>
  </svg>
);

// Gear Settings Icon SVG
const ThemeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

export default function StatusBar({ currentTheme, onChangeTheme, activeFile }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const themes = [
    { id: 'tokyo-night', name: 'Tokyo Night' },
    { id: 'dracula', name: 'Dracula' },
    { id: 'nord', name: 'Nord' },
    { id: 'github-dark', name: 'GitHub Dark' },
    { id: 'one-dark', name: 'One Dark' }
  ];

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLanguageMode = (filename) => {
    if (!filename) return 'Plain Text';
    const ext = filename.split('.').pop();
    switch (ext) {
      case 'md': return 'Markdown';
      case 'json': return 'JSON';
      case 'yaml': return 'YAML';
      case 'sh': return 'Shell Script';
      default: return 'Plain Text';
    }
  };

  const getFileCoordinates = (filename) => {
    if (!filename) return 'Ln 1, Col 1';
    switch (filename) {
      case 'README.md': return 'Ln 24, Col 15';
      case 'about_me.md': return 'Ln 18, Col 5';
      case 'experience.json': return 'Ln 42, Col 2';
      case 'skills.yaml': return 'Ln 28, Col 10';
      case 'certifications.json': return 'Ln 20, Col 4';
      case 'contact.sh': return 'Ln 12, Col 1';
      default: return 'Ln 1, Col 1';
    }
  };

  const currentThemeName = themes.find(t => t.id === currentTheme)?.name || 'Tokyo Night';

  const selectTheme = (themeId) => {
    onChangeTheme(themeId);
    setDropdownOpen(false);
  };

  return (
    <footer style={{
      height: '22px',
      backgroundColor: 'var(--bg-status-bar)',
      borderTop: '1px solid var(--border-color)',
      color: 'var(--text-muted)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 8px',
      fontSize: '0.72rem',
      userSelect: 'none',
      zIndex: 200,
      position: 'relative'
    }}>
      {/* Left side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <a 
          href="https://github.com/jpsacheti/jpsacheti.github.io" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px', 
            color: 'inherit', 
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          className="status-bar-link"
        >
          <GitBranchIcon />
          <span>main</span>
        </a>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ 
            width: '6px', 
            height: '6px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--accent-green)',
            display: 'inline-block'
          }}></span>
          <span>Sync OK</span>
        </span>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span className="hide-on-mobile">{getFileCoordinates(activeFile)}</span>
        <span className="hide-on-mobile">Spaces: 2</span>
        <span className="hide-on-mobile">UTF-8</span>
        <span className="hide-on-mobile">LF</span>
        <span>{getLanguageMode(activeFile)}</span>

        {/* Interactive Theme Selector Button */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              padding: '2px 4px',
              borderRadius: '2px',
              transition: 'background-color 0.2s'
            }}
            className="theme-selector-btn"
          >
            <ThemeIcon />
            <span>Theme: {currentThemeName}</span>
          </button>

          {/* Theme Dropdown Menu */}
          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              bottom: '24px',
              right: 0,
              backgroundColor: 'var(--bg-sidebar)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              boxShadow: '0 -4px 16px var(--shadow-color)',
              width: '150px',
              padding: '4px 0',
              zIndex: 300
            }}>
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => selectTheme(theme.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '6px 12px',
                    border: 'none',
                    background: currentTheme === theme.id ? 'var(--border-color)' : 'transparent',
                    color: currentTheme === theme.id ? 'var(--accent-cyan)' : 'var(--text-main)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontFamily: 'inherit',
                    transition: 'background-color 0.2s'
                  }}
                  className="dropdown-item"
                >
                  {theme.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .status-bar-link:hover {
          color: var(--accent-cyan) !important;
        }
        .theme-selector-btn:hover {
          background-color: rgba(255,255,255,0.05);
          color: var(--accent-cyan);
        }
        .dropdown-item:hover {
          background-color: rgba(255,255,255,0.05) !important;
          color: var(--accent-purple) !important;
        }
        
        @media (max-width: 500px) {
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </footer>
  );
}
