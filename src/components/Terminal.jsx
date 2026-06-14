import React, { useState, useRef, useEffect } from 'react';

export default function Terminal({ activeFile, onOpenFile, currentTheme, onChangeTheme, isCollapsed, onToggleCollapse }) {
  const [history, setHistory] = useState([
    { type: 'output', text: 'Welcome to the interactive portfolio terminal console!' },
    { type: 'output', text: 'Type "help" to view a list of available commands.' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  const availableCommands = [
    'help', 'clear', 'ls', 'whoami', 'git status', 'git log',
    'cat README.md', 'cat about_me.md', 'cat experience.json',
    'cat skills.yaml', 'cat certifications.json', 'cat contact.sh',
    'theme tokyo-night', 'theme dracula', 'theme nord', 'theme github-dark', 'theme one-dark'
  ];

  const baseCommands = ['help', 'clear', 'ls', 'whoami', 'git', 'theme', 'cat'];
  const filenames = ['README.md', 'about_me.md', 'experience.json', 'skills.yaml', 'certifications.json', 'contact.sh'];
  const themes = ['tokyo-night', 'dracula', 'nord', 'github-dark', 'one-dark'];

  // Scroll to bottom on updates
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isCollapsed]);

  // Focus input on click of terminal area
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const trimmedCmd = inputVal.trim();
      if (!trimmedCmd) return;

      // Add prompt line to history
      const newHistory = [...history, { type: 'prompt', text: trimmedCmd }];
      
      // Process Command
      const processedHistory = executeCommand(trimmedCmd, newHistory);
      
      setHistory(processedHistory);
      setCmdHistory([...cmdHistory, trimmedCmd]);
      setHistoryIndex(-1);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      
      let newIdx = historyIndex === -1 ? cmdHistory.length - 1 : historyIndex - 1;
      if (newIdx < 0) newIdx = 0;
      
      setHistoryIndex(newIdx);
      setInputVal(cmdHistory[newIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      
      let newIdx = historyIndex + 1;
      if (newIdx >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(newIdx);
        setInputVal(cmdHistory[newIdx]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    }
  };

  const handleTabCompletion = () => {
    const currentInput = inputVal.trimStart();
    if (!currentInput) {
      // Suggest all base commands
      setHistory([
        ...history,
        { type: 'output', text: 'Available commands: ' + baseCommands.join(', ') }
      ]);
      return;
    }

    const tokens = currentInput.split(/\s+/);
    
    // Autocompleting base commands
    if (tokens.length === 1) {
      const match = baseCommands.find(c => c.startsWith(tokens[0]));
      if (match) {
        setInputVal(match + (match === 'clear' || match === 'help' || match === 'ls' || match === 'whoami' ? '' : ' '));
      }
    } 
    // Autocompleting parameters
    else if (tokens.length === 2) {
      const cmd = tokens[0];
      const param = tokens[1];
      
      if (cmd === 'cat') {
        const match = filenames.find(f => f.startsWith(param));
        if (match) {
          setInputVal(`cat ${match}`);
        }
      } else if (cmd === 'theme') {
        const match = themes.find(t => t.startsWith(param));
        if (match) {
          setInputVal(`theme ${match}`);
        }
      } else if (cmd === 'git') {
        if ('status'.startsWith(param)) {
          setInputVal('git status');
        } else if ('log'.startsWith(param)) {
          setInputVal('git log');
        }
      }
    }
  };

  const executeCommand = (cmdStr, currentHistory) => {
    const parts = cmdStr.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    switch (cmd) {
      case 'help':
        return [
          ...currentHistory,
          { type: 'output', text: 'Available commands:' },
          { type: 'help-item', text: '  ls                 - List files in workspace' },
          { type: 'help-item', text: '  cat <file>         - Display file contents and focus tab' },
          { type: 'help-item', text: '  theme <theme_name> - Switch IDE color theme' },
          { type: 'help-item', text: '  whoami             - Quick bio overview' },
          { type: 'help-item', text: '  git status         - Display mock git status' },
          { type: 'help-item', text: '  git log            - Show fun git history timeline' },
          { type: 'help-item', text: '  clear              - Clear terminal display' },
          { type: 'output', text: 'Themes available: tokyo-night, dracula, nord, github-dark, one-dark' }
        ];
      case 'clear':
        return [];
      case 'ls':
        return [
          ...currentHistory,
          { type: 'output', text: 'README.md    about_me.md    experience.json    skills.yaml    certifications.json    contact.sh' }
        ];
      case 'whoami':
        return [
          ...currentHistory,
          { type: 'output', text: 'João Pedro Sacheti - Cloud Engineer & Specialist Backend Developer.' },
          { type: 'output', text: 'Specializes in high-throughput Java microservices, DevSecOps, and AWS cloud infrastructures.' }
        ];
      case 'git':
        if (arg === 'status') {
          return [
            ...currentHistory,
            { type: 'output', text: 'On branch main' },
            { type: 'output', text: 'Your branch is up to date with \'origin/main\'.' },
            { type: 'output', text: 'nothing to commit, working tree clean' }
          ];
        } else if (arg === 'log') {
          return [
            ...currentHistory,
            { type: 'output', text: 'commit e0af689ece6a9b1d6bb9af7 (HEAD -> main, origin/main)' },
            { type: 'output', text: 'Author: Joao Pedro Sacheti <jpsacheti@gmail.com>' },
            { type: 'output', text: 'Date:   Jun 2024 - Present' },
            { type: 'output-indent', text: 'Joined Zup IT / Itaú Unibanco as Specialist Backend Developer' },
            { type: 'output', text: 'commit d2c8ef5d40defd8778a84f90' },
            { type: 'output', text: 'Author: Joao Pedro Sacheti <jpsacheti@gmail.com>' },
            { type: 'output-indent', text: 'Promoted to Cloud Engineer at First Tecnologia / Santander (2023)' },
            { type: 'output', text: 'commit e3e793685c6c4918b80d8e87' },
            { type: 'output-indent', text: 'Joined GFT Technologies as Senior Software Developer (2022)' }
          ];
        } else {
          return [
            ...currentHistory,
            { type: 'error', text: `git: unknown argument "${arg}". Supported: git status, git log` }
          ];
        }
      case 'cat':
        if (!arg) {
          return [...currentHistory, { type: 'error', text: 'cat: missing filename. Example: cat README.md' }];
        }
        
        // Find matching file
        const lowerArg = arg.toLowerCase();
        const matchedFile = filenames.find(f => f.toLowerCase() === lowerArg);
        
        if (matchedFile) {
          onOpenFile(matchedFile);
          return [
            ...currentHistory,
            { type: 'success', text: `Opening ${matchedFile} in editor tab...` }
          ];
        } else {
          return [...currentHistory, { type: 'error', text: `cat: ${arg}: No such file in workspace` }];
        }
      case 'theme':
        if (!arg) {
          return [...currentHistory, { type: 'error', text: 'theme: missing theme name. Example: theme dracula' }];
        }
        
        const normTheme = arg.toLowerCase().replace(/\s+/g, '-');
        if (themes.includes(normTheme)) {
          onChangeTheme(normTheme);
          return [
            ...currentHistory,
            { type: 'success', text: `Theme updated to: ${arg}` }
          ];
        } else {
          return [
            ...currentHistory,
            { type: 'error', text: `theme: theme "${arg}" not found.` },
            { type: 'output', text: 'Available: tokyo-night, dracula, nord, github-dark, one-dark' }
          ];
        }
      default:
        return [
          ...currentHistory,
          { type: 'error', text: `sh: command not found: ${cmd}. Type "help" for a list of commands.` }
        ];
    }
  };

  if (isCollapsed) {
    return (
      <div 
        onClick={onToggleCollapse}
        style={{
          height: '28px',
          backgroundColor: 'var(--bg-sidebar)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
          cursor: 'pointer',
          userSelect: 'none',
          fontSize: '0.8rem',
          color: 'var(--text-main)'
        }}
        className="collapsed-terminal"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Terminal</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>jpsacheti@dev: ~ (Click to expand)</span>
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </div>
    );
  }

  return (
    <div 
      style={{
        height: '180px',
        backgroundColor: 'var(--bg-terminal)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'JetBrains Mono', monospace",
        zIndex: 10
      }}
    >
      {/* Terminal Titlebar */}
      <div style={{
        height: '28px',
        backgroundColor: 'var(--bg-sidebar)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px',
        fontSize: '0.75rem',
        userSelect: 'none',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ color: 'var(--text-main)', borderBottom: '1px solid var(--accent-cyan)', paddingBottom: '7px', fontWeight: 'bold' }}>TERMINAL</span>
          <span className="hide-on-mobile">PROBLEMS (0)</span>
          <span className="hide-on-mobile">OUTPUT</span>
          <span className="hide-on-mobile">DEBUG CONSOLE</span>
        </div>
        
        {/* Toggle Collapse */}
        <button 
          onClick={onToggleCollapse}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: '2px'
          }}
          title="Minimize Panel"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>

      {/* Terminal Console Logs */}
      <div 
        onClick={handleTerminalClick}
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '8px 16px',
          fontSize: '0.85rem',
          lineHeight: '1.4',
          color: 'var(--text-main)',
          cursor: 'text'
        }}
        className="terminal-body"
      >
        {history.map((line, idx) => {
          if (line.type === 'prompt') {
            return (
              <div key={idx} style={{ marginBottom: '2px' }}>
                <span style={{ color: 'var(--accent-cyan)' }}>jpsacheti@dev</span>
                <span style={{ color: 'var(--text-muted)' }}>:</span>
                <span style={{ color: 'var(--accent-purple)' }}>~</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 'bold', marginLeft: '4px' }}>$</span>
                <span style={{ marginLeft: '8px' }}>{line.text}</span>
              </div>
            );
          } else if (line.type === 'help-item') {
            return (
              <div key={idx} style={{ color: 'var(--accent-cyan)', whiteSpace: 'pre-wrap' }}>
                {line.text}
              </div>
            );
          } else if (line.type === 'error') {
            return (
              <div key={idx} style={{ color: 'var(--accent-red)' }}>
                {line.text}
              </div>
            );
          } else if (line.type === 'success') {
            return (
              <div key={idx} style={{ color: 'var(--accent-green)' }}>
                {line.text}
              </div>
            );
          } else if (line.type === 'output-indent') {
            return (
              <div key={idx} style={{ color: 'var(--accent-yellow)', paddingLeft: '8px' }}>
                {line.text}
              </div>
            );
          } else {
            return (
              <div key={idx} style={{ color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
                {line.text}
              </div>
            );
          }
        })}
        
        {/* Active Typing Input Prompt */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
          <span style={{ color: 'var(--accent-cyan)' }}>jpsacheti@dev</span>
          <span style={{ color: 'var(--text-muted)' }}>:</span>
          <span style={{ color: 'var(--accent-purple)' }}>~</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 'bold', marginLeft: '4px' }}>$</span>
          
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck="false"
            style={{
              flexGrow: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              paddingLeft: '8px'
            }}
          />
        </div>
        <div ref={terminalEndRef} />
      </div>

      <style>{`
        .collapsed-terminal:hover {
          background-color: var(--border-color) !important;
        }
      `}</style>
    </div>
  );
}
