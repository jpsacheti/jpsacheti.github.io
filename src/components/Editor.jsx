import React, { useState, useEffect } from 'react';
import CssAvatar from './CssAvatar';

// Import raw file strings using Vite's ?raw feature
import readmeText from '../content/README.md?raw';
import aboutText from '../content/about_me.md?raw';
import skillsText from '../content/skills.yaml?raw';
import contactText from '../content/contact.sh?raw';

// Import structured data directly
import experienceData from '../content/experience.json';
import certificationsData from '../content/certifications.json';

// Tab Closing Icon SVG
const TabCloseIcon = ({ onClick }) => (
  <svg 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    width="10" 
    height="10" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="tab-close-icon"
    style={{ marginLeft: '6px', borderRadius: '2px', cursor: 'pointer' }}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Toggle Views Icons
const CodeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export default function Editor({ openTabs, activeFile, onOpenFile, onCloseTab, isSidebarOpen, onToggleSidebar }) {
  const [viewMode, setViewMode] = useState('ui'); // 'ui' (visual) or 'code' (raw)
  const [copyStatus, setCopyStatus] = useState(false);

  // Auto-switch view modes depending on file: README is best in UI mode, etc.
  useEffect(() => {
    // Keep user preference when switching files unless it's README (usually UI is preferred)
  }, [activeFile]);

  const getFileContentStr = (filename) => {
    switch (filename) {
      case 'README.md': return readmeText;
      case 'about_me.md': return aboutText;
      case 'skills.yaml': return skillsText;
      case 'contact.sh': return contactText;
      case 'experience.json': return JSON.stringify(experienceData, null, 2);
      case 'certifications.json': return JSON.stringify(certificationsData, null, 2);
      default: return '';
    }
  };

  // Simple HTML escaping helper for code block rendering
  const escapeHtml = (text) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Custom regex-based syntax highlighter for code view representation
  const highlightCode = (filename, rawText) => {
    const escaped = escapeHtml(rawText);
    const ext = filename.split('.').pop();

    if (ext === 'json') {
      return escaped
        // Properties (keys)
        .replace(/(&quot;\w+&quot;)(:)/g, '<span class="syntax-property">$1</span>$2')
        // String Values
        .replace(/(:\s*)&quot;([^&]*)&quot;/g, '$1<span class="syntax-string">&quot;$2&quot;</span>')
        // Numbers & Booleans
        .replace(/(:\s*)(\d+|true|false)/g, '$1<span class="syntax-number">$2</span>');
    }

    if (ext === 'yaml') {
      return escaped
        // Comments
        .replace(/(#.*)/g, '<span class="syntax-comment">$1</span>')
        // Properties
        .replace(/(\w+)(:)/g, '<span class="syntax-property">$1</span>$2')
        // Category tags
        .replace(/(- category:)/g, '<span class="syntax-keyword">$1</span>')
        // Name tags
        .replace(/(- name:)/g, '<span class="syntax-keyword">$1</span>')
        // List details
        .replace(/(details:)/g, '<span class="syntax-keyword">$1</span>')
        // Values in quotes
        .replace(/(&quot;[^&]*&quot;)/g, '<span class="syntax-string">$1</span>');
    }

    if (ext === 'sh') {
      return escaped
        // Comments
        .replace(/(#.*)/g, '<span class="syntax-comment">$1</span>')
        // Keywords
        .replace(/\b(export|echo|if|then|fi|exit)\b/g, '<span class="syntax-keyword">$1</span>')
        // Variables
        .replace(/(\$\w+)/g, '<span class="syntax-tag">$1</span>')
        // Strings
        .replace(/(&quot;[^&]*&quot;)/g, '<span class="syntax-string">$1</span>');
    }

    if (ext === 'md') {
      return escaped
        // Headers
        .replace(/^(#+.*)$/gm, '<span class="syntax-keyword">$1</span>')
        // Bold formatting
        .replace(/(\*\*.*?\*\*)/g, '<strong>$1</strong>')
        // Code blocks inline
        .replace(/(`.*?`)/g, '<span class="syntax-string">$1</span>')
        // Bullet points
        .replace(/^(\s*[-*]\s+)/gm, '<span class="syntax-property">$1</span>');
    }

    return escaped;
  };

  // Simple Markdown renderer to display about_me.md and README.md in UI mode
  const renderSimpleMarkdown = (markdownText) => {
    const lines = markdownText.split('\n');
    let htmlContent = [];
    let inList = false;

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('# ')) {
        if (inList) { htmlContent.push('</ul>'); inList = false; }
        htmlContent.push(`<h1 key=${idx}>${trimmed.substring(2)}</h1>`);
      } else if (trimmed.startsWith('## ')) {
        if (inList) { htmlContent.push('</ul>'); inList = false; }
        htmlContent.push(`<h2 key=${idx}>${trimmed.substring(3)}</h2>`);
      } else if (trimmed.startsWith('### ')) {
        if (inList) { htmlContent.push('</ul>'); inList = false; }
        htmlContent.push(`<h3 key=${idx}>${trimmed.substring(4)}</h3>`);
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) { htmlContent.push('<ul style="margin-left: 1.5rem; margin-bottom: 1rem;">'); inList = true; }
        let itemText = trimmed.substring(2);
        
        // Parse bold
        itemText = itemText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Parse inline code
        itemText = itemText.replace(/`(.*?)`/g, '<code class="badge">$1</code>');
        // Parse links
        itemText = itemText.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

        htmlContent.push(`<li style="margin-bottom: 0.4rem;">${itemText}</li>`);
      } else if (trimmed === '---') {
        if (inList) { htmlContent.push('</ul>'); inList = false; }
        htmlContent.push('<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.5rem 0;" />');
      } else if (trimmed.length > 0) {
        if (inList) { htmlContent.push('</ul>'); inList = false; }
        
        let pText = trimmed;
        // Parse bold
        pText = pText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Parse inline code
        pText = pText.replace(/`(.*?)`/g, '<code class="badge">$1</code>');
        // Parse links
        pText = pText.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        
        // Format quote block styling
        if (trimmed.startsWith('*“') || trimmed.startsWith('“')) {
          htmlContent.push(`<p style="font-style: italic; color: var(--accent-purple); font-size: 1.1rem; text-align: center; margin: 1.5rem 0;">${pText}</p>`);
        } else {
          htmlContent.push(`<p style="margin-bottom: 1rem; color: var(--text-main);">${pText}</p>`);
        }
      } else {
        if (inList) { htmlContent.push('</ul>'); inList = false; }
      }
    });

    if (inList) { htmlContent.push('</ul>'); }

    return <div dangerouslySetInnerHTML={{ __html: htmlContent.join('') }} />;
  };

  // Local YAML parser for skills view
  const parseSkillsYaml = (yamlText) => {
    const categories = [];
    let currentCategory = null;
    const lines = yamlText.split('\n');

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- category:')) {
        const catName = trimmed.replace('- category:', '').replace(/"/g, '').trim();
        currentCategory = { category: catName, items: [] };
        categories.push(currentCategory);
      } else if (trimmed.startsWith('- name:')) {
        const nameVal = trimmed.replace('- name:', '').replace(/"/g, '').trim();
        if (currentCategory) {
          currentCategory.items.push({ name: nameVal, details: '' });
        }
      } else if (trimmed.startsWith('details:')) {
        const detailsVal = trimmed.replace('details:', '').replace(/"/g, '').trim();
        if (currentCategory && currentCategory.items.length > 0) {
          currentCategory.items[currentCategory.items.length - 1].details = detailsVal;
        }
      }
    });

    return categories;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  // Render Visual Rich UI panels depending on the active file
  const renderVisualContent = () => {
    switch (activeFile) {
      case 'README.md':
        return (
          <div className="visual-layout">
            {renderSimpleMarkdown(readmeText)}
          </div>
        );
      case 'about_me.md':
        return (
          <div className="visual-layout">
            <CssAvatar />
            {renderSimpleMarkdown(aboutText)}
          </div>
        );
      case 'experience.json':
        return (
          <div className="visual-layout">
            <h1>Professional Experience</h1>
            <p>A timeline of my software engineering and cloud deployments.</p>
            <div className="timeline">
              {experienceData.map((item, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-header">
                    <div>
                      <span className="timeline-role">{item.role}</span>
                      <span style={{ color: 'var(--text-muted)' }}> at </span>
                      <span className="timeline-company">{item.company}</span>
                    </div>
                    <span className="timeline-period">{item.period}</span>
                  </div>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>{item.description}</p>
                  <div className="badge-container">
                    {item.tech.map((t) => (
                      <span key={t} className="badge">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills.yaml':
        const categories = parseSkillsYaml(skillsText);
        return (
          <div className="visual-layout">
            <h1>Technical Skills</h1>
            <p>Categorized summary of core skills, development toolkits, and methodologies.</p>
            <div className="skills-grid">
              {categories.map((cat, idx) => (
                <div key={idx} className="card" style={{ marginBottom: 0 }}>
                  <div className="skills-category-title">{cat.category}</div>
                  <div className="skills-list">
                    {cat.items.map((item, i) => (
                      <div key={i}>
                        <div className="skill-item-name">{item.name}</div>
                        <div className="skill-item-details">{item.details}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'certifications.json':
        return (
          <div className="visual-layout">
            <h1>Professional Certifications</h1>
            <p>Industry-recognized credentials verifying expertise in cloud development and programming language fundamentals.</p>
            <div className="cert-grid">
              {certificationsData.map((cert, idx) => (
                <div key={idx} className="card cert-card">
                  <div>
                    <span className="cert-issuer">{cert.issuer}</span>
                    <div className="cert-name">{cert.name}</div>
                  </div>
                  <a 
                    href={cert.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="cert-link"
                  >
                    Verify Credential
                  </a>
                </div>
              ))}
            </div>
          </div>
        );
      case 'contact.sh':
        return (
          <div className="visual-layout">
            <h1>Get In Touch</h1>
            <p>Connect with me via email, LinkedIn, or check out my repositories on GitHub.</p>
            <div className="contact-grid">
              {/* Email Card */}
              <div 
                className="card contact-card"
                onClick={() => copyToClipboard('jpsacheti@gmail.com')}
                title="Click to copy email"
              >
                <div className="contact-icon">📧</div>
                <div className="contact-label">Email</div>
                <div className="contact-value">jpsacheti@gmail.com</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-green)', marginTop: '8px' }}>(Click to Copy)</span>
              </div>
              
              {/* LinkedIn Card */}
              <a 
                href="https://www.linkedin.com/in/jpsacheti" 
                target="_blank" 
                rel="noopener noreferrer"
                className="card contact-card"
                style={{ textDecoration: 'none' }}
              >
                <div className="contact-icon">🔗</div>
                <div className="contact-label">LinkedIn</div>
                <div className="contact-value">in/jpsacheti</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', marginTop: '8px' }}>(Visit Profile)</span>
              </a>

              {/* GitHub Card */}
              <a 
                href="https://github.com/jpsacheti" 
                target="_blank" 
                rel="noopener noreferrer"
                className="card contact-card"
                style={{ textDecoration: 'none' }}
              >
                <div className="contact-icon">🐙</div>
                <div className="contact-label">GitHub</div>
                <div className="contact-value">github.com/jpsacheti</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', marginTop: '8px' }}>(Visit Repos)</span>
              </a>
            </div>
          </div>
        );
      default:
        return <div>No file selected</div>;
    }
  };

  if (openTabs.length === 0) {
    return (
      <div style={{
        flexGrow: 1,
        backgroundColor: 'var(--bg-editor)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: '1rem',
        userSelect: 'none'
      }}>
        <div>Select a file from the explorer sidebar to open it.</div>
      </div>
    );
  }

  const fileRawText = getFileContentStr(activeFile);
  const highlightedCodeHtml = highlightCode(activeFile, fileRawText);

  return (
    <div style={{
      flexGrow: 1,
      backgroundColor: 'var(--bg-editor)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Editor Tab Bar */}
      <div style={{
        height: '35px',
        backgroundColor: 'var(--bg-tabs-bar)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: '12px'
      }}>
        {/* Left: Hamburger menu toggle for mobile screen sidebar drawer */}
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <button
            onClick={onToggleSidebar}
            style={{
              height: '100%',
              background: 'transparent',
              border: 'none',
              borderRight: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              padding: '0 12px',
              cursor: 'pointer',
              display: 'none' // Hidden by default, toggled in responsive media queries
            }}
            className="mobile-sidebar-toggle"
            title="Toggle File Explorer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* Opened tabs */}
          <div style={{ display: 'flex', overflowX: 'auto', height: '100%' }} className="editor-tabs-scroll">
            {openTabs.map((tab) => {
              const isActive = activeFile === tab;
              return (
                <div
                  key={tab}
                  onClick={() => onOpenFile(tab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px',
                    fontSize: '0.8rem',
                    borderRight: '1px solid var(--border-color)',
                    backgroundColor: isActive ? 'var(--bg-tab-active)' : 'var(--bg-tab-inactive)',
                    color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    userSelect: 'none',
                    height: '100%',
                    borderTop: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent'
                  }}
                  className="editor-tab"
                >
                  <span>{tab}</span>
                  <TabCloseIcon onClick={() => onCloseTab(tab)} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Code/UI Toggle Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setViewMode(viewMode === 'ui' ? 'code' : 'ui')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-sidebar)',
              color: 'var(--text-main)',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease'
            }}
            className="toggle-view-btn"
          >
            {viewMode === 'ui' ? <CodeIcon /> : <EyeIcon />}
            <span>{viewMode === 'ui' ? 'View Source' : 'Visual Preview'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body Area */}
      <div 
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          backgroundColor: 'var(--bg-editor)'
        }}
        className="editor-body"
      >
        {viewMode === 'code' ? (
          /* CODE SYNTAX VIEW */
          <pre style={{
            margin: 0,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.9rem',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
            color: 'var(--text-main)'
          }}>
            <code dangerouslySetInnerHTML={{ __html: highlightedCodeHtml }} />
          </pre>
        ) : (
          /* VISUAL UI RENDER VIEW */
          renderVisualContent()
        )}
      </div>

      {/* transient copy indicator popup */}
      {copyStatus && (
        <div className="clipboard-notification">
          ✓ Copied email to clipboard!
        </div>
      )}

      <style>{`
        .editor-tab:hover {
          color: var(--text-main) !important;
          background-color: rgba(255, 255, 255, 0.02) !important;
        }
        .tab-close-icon:hover {
          background-color: var(--border-color);
          color: var(--accent-red) !important;
        }
        .toggle-view-btn:hover {
          border-color: var(--accent-cyan);
          color: var(--accent-cyan);
          box-shadow: 0 0 8px rgba(125, 207, 255, 0.15);
        }
        
        /* Hide scrollbars on tabs */
        .editor-tabs-scroll::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 768px) {
          .mobile-sidebar-toggle {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
