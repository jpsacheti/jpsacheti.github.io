import React from 'react';

// Inline SVGs for file explorer icons to keep project clean and dependency-free
const MarkdownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-cyan)' }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const JsonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-yellow)' }}>
    <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"></path>
    <path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"></path>
  </svg>
);

const YamlIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-purple)' }}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v4.5a2 2 0 0 1-2 2 2 2 0 0 1 2 2V19a2 2 0 0 0 2 2h.44"></path>
    <path d="M19 17.5a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 0 0 5z"></path>
    <line x1="10" y1="11.5" x2="16.5" y2="11.5"></line>
  </svg>
);

const ShellIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-green)' }}>
    <polyline points="4 17 10 11 4 5"></polyline>
    <line x1="12" y1="19" x2="20" y2="19"></line>
  </svg>
);

const SocialEmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const SocialLinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const SocialGithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

export default function Sidebar({ files, activeFile, onOpenFile, isMobileOpen, onCloseMobile }) {
  
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop();
    switch (ext) {
      case 'md': return <MarkdownIcon />;
      case 'json': return <JsonIcon />;
      case 'yaml': return <YamlIcon />;
      case 'sh': return <ShellIcon />;
      default: return null;
    }
  };

  const handleFileClick = (filename) => {
    onOpenFile(filename);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarStyle = {
    width: '240px',
    backgroundColor: 'var(--bg-sidebar)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'between',
    height: '100%',
    transition: 'transform 0.3s ease',
    zIndex: 100
  };

  const responsiveClass = isMobileOpen 
    ? "sidebar-container mobile-open" 
    : "sidebar-container mobile-closed";

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-backdrop"
          onClick={onCloseMobile}
        />
      )}
      
      <aside className={responsiveClass} style={sidebarStyle}>
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ 
            padding: '12px 16px', 
            fontSize: '0.75rem', 
            fontWeight: 'bold', 
            textTransform: 'uppercase', 
            letterSpacing: '1px', 
            color: 'var(--text-muted)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Explorer: Workspace</span>
          </div>

          {/* Folder Header */}
          <div style={{ padding: '8px 12px 4px 12px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-purple)' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <span>jpsacheti.github.io</span>
          </div>

          {/* File List */}
          <ul style={{ listStyle: 'none', padding: '0 8px' }}>
            {files.map((file) => {
              const isActive = activeFile === file;
              return (
                <li key={file} style={{ margin: '2px 0' }}>
                  <button
                    onClick={() => handleFileClick(file)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: 'none',
                      background: isActive ? 'var(--border-color)' : 'transparent',
                      color: isActive ? 'var(--accent-cyan)' : 'var(--text-main)',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background-color 0.2s ease, color 0.2s ease'
                    }}
                    className="sidebar-file-btn"
                  >
                    {getFileIcon(file)}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Social / Contacts Sidebar Footer */}
        <div style={{ 
          padding: '16px', 
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Social Connections
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <a 
              href="mailto:jpsacheti@gmail.com" 
              title="Email me" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'var(--text-main)', transition: 'color 0.2s' }}
              className="social-icon-link"
            >
              <SocialEmailIcon />
            </a>
            <a 
              href="https://www.linkedin.com/in/jpsacheti" 
              title="LinkedIn Profile" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'var(--text-main)', transition: 'color 0.2s' }}
              className="social-icon-link"
            >
              <SocialLinkedinIcon />
            </a>
            <a 
              href="https://github.com/jpsacheti" 
              title="GitHub Profile" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'var(--text-main)', transition: 'color 0.2s' }}
              className="social-icon-link"
            >
              <SocialGithubIcon />
            </a>
          </div>
        </div>
      </aside>
      
      {/* Styles for mobile responsive rendering inline inside index.css or here */}
      <style>{`
        .sidebar-file-btn:hover {
          background-color: rgba(255,255,255,0.05) !important;
          color: var(--accent-purple) !important;
        }
        .social-icon-link:hover {
          color: var(--accent-cyan) !important;
          transform: translateY(-1px);
        }
        
        /* Sidebar container responsive details */
        .sidebar-container {
          position: relative;
        }
        
        .mobile-backdrop {
          display: none;
        }
        
        @media (max-width: 768px) {
          .sidebar-container {
            position: fixed !important;
            top: 48px; /* Height of the titlebar */
            left: 0;
            bottom: 22px; /* Height of the statusbar */
            transform: translateX(-100%);
            box-shadow: 5px 0 15px rgba(0,0,0,0.5);
          }
          
          .sidebar-container.mobile-open {
            transform: translateX(0);
          }
          
          .mobile-backdrop {
            display: block;
            position: fixed;
            top: 48px;
            left: 0;
            right: 0;
            bottom: 22px;
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(2px);
            z-index: 90;
          }
        }
      `}</style>
    </>
  );
}
