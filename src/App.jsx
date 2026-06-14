import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Terminal from './components/Terminal';
import StatusBar from './components/StatusBar';

export default function App() {
  const [activeTheme, setActiveTheme] = useState('tokyo-night');
  const [openTabs, setOpenTabs] = useState(['README.md']);
  const [activeFile, setActiveFile] = useState('README.md');
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const filesList = [
    'README.md',
    'about_me.md',
    'experience.json',
    'skills.yaml',
    'certifications.json',
    'contact.sh'
  ];

  const handleOpenFile = (filename) => {
    if (!openTabs.includes(filename)) {
      setOpenTabs([...openTabs, filename]);
    }
    setActiveFile(filename);
    setIsMobileSidebarOpen(false);
  };

  const handleCloseTab = (filename) => {
    const remainingTabs = openTabs.filter(t => t !== filename);
    setOpenTabs(remainingTabs);

    if (activeFile === filename) {
      if (remainingTabs.length > 0) {
        // Switch to the next available tab
        setActiveFile(remainingTabs[remainingTabs.length - 1]);
      } else {
        setActiveFile(null);
      }
    }
  };

  const handleToggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className={`theme-${activeTheme}`} style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      backgroundColor: 'var(--bg-app)',
      fontFamily: "'JetBrains Mono', monospace",
      color: 'var(--text-main)',
      overflow: 'hidden'
    }}>
      {/* Mock Window Top Titlebar */}
      <header style={{
        height: '32px',
        backgroundColor: 'var(--bg-sidebar)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        userSelect: 'none',
        zIndex: 150
      }}>
        {/* Left Mac OS Buttons */}
        <div style={{ display: 'flex', gap: '8px', width: '80px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56', display: 'inline-block' }}></span>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e', display: 'inline-block' }}></span>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f', display: 'inline-block' }}></span>
        </div>
        
        {/* Center Title */}
        <div style={{
          flexGrow: 1,
          textAlign: 'center',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          fontWeight: 500,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {activeFile ? `${activeFile} - jpsacheti.github.io - Visual Studio Code` : 'jpsacheti.github.io - Visual Studio Code'}
        </div>

        {/* Right offset spacer to center title */}
        <div style={{ width: '80px' }}></div>
      </header>

      {/* Main Body Layout (Sidebar + Editor + Terminal) */}
      <div style={{
        display: 'flex',
        flexGrow: 1,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Sidebar explorer list */}
        <Sidebar 
          files={filesList} 
          activeFile={activeFile} 
          onOpenFile={handleOpenFile} 
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Editor + Terminal Wrapper */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflow: 'hidden',
          height: '100%'
        }}>
          {/* Main Code Editor workspace */}
          <Editor 
            openTabs={openTabs} 
            activeFile={activeFile} 
            onOpenFile={handleOpenFile} 
            onCloseTab={handleCloseTab} 
            isSidebarOpen={isMobileSidebarOpen}
            onToggleSidebar={handleToggleSidebar}
          />

          {/* Bottom console panel */}
          <Terminal 
            activeFile={activeFile}
            onOpenFile={handleOpenFile}
            currentTheme={activeTheme}
            onChangeTheme={setActiveTheme}
            isCollapsed={isTerminalCollapsed}
            onToggleCollapse={() => setIsTerminalCollapsed(!isTerminalCollapsed)}
          />
        </div>
      </div>

      {/* Footer status line */}
      <StatusBar 
        currentTheme={activeTheme} 
        onChangeTheme={setActiveTheme} 
        activeFile={activeFile}
      />
    </div>
  );
}
