import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { initialJson } from '../lib/example.ts';
import { translateJSON } from '../lib/translator.ts';

// The "Smart Scraper" script provided to the user
const EXTRACTOR_SCRIPT = `
(function() {
  console.log("✂️ LinguaFlow Extractor Started...");
  
  function clean(text) {
    return text.replace(/\\s+/g, ' ').trim();
  }

  function generateKey(el, index) {
    // Try to use ID, then Class, then Tag + Index
    if (el.id) return el.id;
    if (el.className && typeof el.className === 'string') {
      const mainClass = el.className.split(' ')[0];
      if (mainClass) return \`\${mainClass}_\${index}\`;
    }
    return \`\${el.tagName.toLowerCase()}_\${index}\`;
  }

  const result = {
    meta: {
      title: document.title,
      url: window.location.href,
      scraped_at: new Date().toISOString()
    },
    content: {}
  };

  // Helper to process a container
  function processContainer(container, label) {
    const group = {};
    // Find all text elements of interest
    const elements = container.querySelectorAll('h1, h2, h3, h4, p, span, button, a, label, li');
    
    let count = 0;
    elements.forEach((el, i) => {
      // Skip hidden or empty elements
      if (el.offsetParent === null) return;
      if (el.closest('script, style, noscript')) return;
      
      // Get direct text only (ignore child node text to avoid duplication)
      let directText = "";
      el.childNodes.forEach(node => {
        if (node.nodeType === 3) directText += node.nodeValue;
      });
      
      const text = clean(directText);
      if (text.length > 2 && text.length < 500) { // Filter noise and huge blobs
        const key = generateKey(el, i);
        group[key] = text;
        count++;
      }
    });
    
    if (count > 0) result.content[label] = group;
  }

  // Attempt to categorize sections semantically
  const nav = document.querySelector('nav') || document.querySelector('header');
  const footer = document.querySelector('footer');
  const main = document.querySelector('main') || document.body;

  if (nav) processContainer(nav, 'navigation');
  if (footer) processContainer(footer, 'footer');
  processContainer(main, 'body_content');

  // Copy to clipboard
  const jsonString = JSON.stringify(result, null, 2);
  console.log(jsonString);
  
  // Try to copy to clipboard
  try {
    navigator.clipboard.writeText(jsonString).then(() => {
      alert("✅ Success! JSON copied to clipboard.\\n\\nNow paste it into LinguaFlow.");
    });
  } catch (e) {
    console.warn("Could not auto-copy. Please copy the object printed above.");
  }
})();
`;

export default function App() {
  const [sourceCode, setSourceCode] = useState(JSON.stringify(initialJson, null, 2));
  const [targetCode, setTargetCode] = useState(JSON.stringify(initialJson, null, 2));
  const [targetLang, setTargetLang] = useState('Serbian');
  const [isTranslating, setIsTranslating] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [showExtractorHelp, setShowExtractorHelp] = useState(false);

  // Parse JSON safely for preview
  const getPreviewData = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return null;
    }
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const sourceObj = JSON.parse(sourceCode);
      const translatedObj = await translateJSON(targetLang, sourceObj);
      setTargetCode(JSON.stringify(translatedObj, null, 2));
    } catch (e) {
      alert("Error: Invalid JSON in source or Translation failed.");
      console.error(e);
    } finally {
      setIsTranslating(false);
    }
  };

  const copyScript = () => {
    navigator.clipboard.writeText(EXTRACTOR_SCRIPT);
    alert("Script copied! Now go to your website's console and paste it.");
  };

  return (
    <>
      <header>
        <div className="logo">
          <span className="icon" style={{color: 'var(--primary)'}}>translate</span>
          LinguaFlow Studio
        </div>
        <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
           <button 
            className="btn-secondary"
            onClick={() => setShowExtractorHelp(true)}
          >
            <span className="icon">code</span> How to extract JSON?
          </button>
          <div style={{fontSize: '14px', color: 'var(--text-muted)'}}>
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      <main className="workspace">
        {/* LEFT PANEL: SOURCE */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Source JSON (English)</span>
            <span className="icon" style={{fontSize: '16px', color: 'var(--text-muted)'}}>code</span>
          </div>
          <div className="editor-container">
            <textarea
              className="code-editor"
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              spellCheck={false}
              placeholder="Paste your JSON here..."
            />
          </div>
          <div className="controls">
            <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
              <label style={{fontSize: '12px', color: 'var(--text-muted)'}}>Target Language</label>
              <select 
                value={targetLang} 
                onChange={(e) => setTargetLang(e.target.value)}
                disabled={isTranslating}
              >
                <option value="Serbian">Serbian (Srpski)</option>
                <option value="Croatian">Croatian (Hrvatski)</option>
                <option value="German">German (Deutsch)</option>
                <option value="French">French (Français)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="Russian">Russian (Русский)</option>
                <option value="Japanese">Japanese (日本語)</option>
                <option value="Chinese">Chinese (中文)</option>
                <option value="Italian">Italian (Italiano)</option>
              </select>
            </div>
            
            <button 
              className="btn-primary" 
              onClick={handleTranslate} 
              disabled={isTranslating}
              style={{marginTop: 'auto', marginBottom: '1px'}}
            >
              {isTranslating ? (
                <>
                  <span className="icon">sync</span> Translating...
                </>
              ) : (
                <>
                  <span className="icon">auto_awesome</span> Translate
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: RESULT */}
        <div className="panel" style={{borderRight: 'none'}}>
          <div className="panel-header">
            <span className="panel-title">Result ({targetLang})</span>
            <div className="tabs">
              <button 
                className={clsx('tab', viewMode === 'preview' && 'active')}
                onClick={() => setViewMode('preview')}
              >
                Live Preview
              </button>
              <button 
                className={clsx('tab', viewMode === 'code' && 'active')}
                onClick={() => setViewMode('code')}
              >
                JSON Code
              </button>
            </div>
          </div>
          
          {viewMode === 'code' ? (
            <div className="editor-container">
               <textarea
                className="code-editor"
                value={targetCode}
                readOnly
                style={{color: 'var(--success)'}}
              />
            </div>
          ) : (
            <div className="preview-container">
              <MockWebsite data={getPreviewData(targetCode)} />
            </div>
          )}
        </div>
      </main>

      {/* EXTRACTOR HELP MODAL */}
      {showExtractorHelp && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', 
          zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--bg-panel)', width: '600px', maxWidth: '90%', 
            borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden'
          }}>
            <div style={{padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between'}}>
              <h3 style={{fontSize: '18px', fontWeight: 600}}>How to extract JSON from your site</h3>
              <button onClick={() => setShowExtractorHelp(false)} className="icon" style={{background:'none', border:'none', color:'white', cursor:'pointer'}}>close</button>
            </div>
            <div style={{padding: '24px'}}>
              <ol style={{marginLeft: '20px', marginBottom: '20px', lineHeight: '1.6', color: 'var(--text-muted)'}}>
                <li>Open your existing website in Chrome or Firefox.</li>
                <li>Right-click anywhere and select <strong>Inspect</strong>.</li>
                <li>Go to the <strong>Console</strong> tab.</li>
                <li>Copy and paste the code below, then press <strong>Enter</strong>.</li>
              </ol>
              
              <div style={{position: 'relative', background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)'}}>
                <pre style={{
                  fontFamily: 'monospace', fontSize: '12px', color: '#a5b4fc', 
                  overflowX: 'auto', whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto'
                }}>
                  {EXTRACTOR_SCRIPT}
                </pre>
                <button 
                  onClick={copyScript}
                  style={{
                    position: 'absolute', top: '8px', right: '8px', 
                    background: 'var(--primary)', color: 'white', border: 'none', 
                    padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600
                  }}
                >
                  Copy Code
                </button>
              </div>
              
              <p style={{marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)'}}>
                This script will copy the JSON structure to your clipboard. Then simply paste it into the <strong>Source JSON</strong> panel on the left.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// A generic "SaaS" style website component that consumes the JSON data
// This helps the user visualize if the translation fits the design.
function MockWebsite({ data }: { data: any }) {
  if (!data) return <div style={{padding: 40, color: '#ef4444'}}>Error: Invalid JSON Data or Empty</div>;

  // Handle extracted data structure (meta + content) or simple flat structure
  const content = data.content || data; 
  
  // Try to find sections intelligently if keys are generic
  const nav = content.navigation || content.nav || {};
  const hero = content.body_content || content.hero || {};
  const features = content.features || [];
  const footer = content.footer || {};

  return (
    <div className="preview-wrapper">
      <nav className="mock-nav">
        <div style={{fontWeight: 900, fontSize: '20px', color: '#4f46e5'}}>
           {data.meta?.title || data.app_name || 'Logo'}
        </div>
        <div style={{display: 'flex', gap: '20px', fontSize: '14px', fontWeight: 500, flexWrap: 'wrap'}}>
           {/* Render first 5 keys found in nav */}
           {Object.values(nav).slice(0, 5).map((val: any, i) => (
             typeof val === 'string' && <span key={i}>{val}</span>
           ))}
        </div>
      </nav>

      <section className="mock-hero">
        {/* Try to find a headline in the hero/body object */}
        <h1>{
          hero.h1_0 || hero.headline || Object.values(hero).find((v:any) => typeof v === 'string' && v.length < 50 && v.length > 10) || "Welcome"
        }</h1>
        <p style={{fontSize: '18px', color: '#64748b', lineHeight: 1.6}}>
          {hero.p_0 || hero.subheadline || Object.values(hero).find((v:any) => typeof v === 'string' && v.length > 50) || "Subtitle text goes here..."}
        </p>
        
        <div style={{display: 'flex', gap: '12px', justifyContent: 'center', marginTop: 24}}>
           {/* Find buttons */}
           {Object.values(hero).filter((v:any) => typeof v === 'string' && (v.includes('Get') || v.includes('Start') || v.includes('Button'))).map((btnText: any, i) => (
             <span key={i} className="mock-btn" style={i > 0 ? {background: 'white', color: '#0f172a', border: '1px solid #e2e8f0'} : {}}>
               {btnText}
             </span>
           ))}
           {/* Fallback button if none found */}
           {!Object.values(hero).some((v:any) => typeof v === 'string' && v.includes('Get')) && (
             <span className="mock-btn">Get Started</span>
           )}
        </div>
      </section>

      {/* If we have features array (from example) */}
      {Array.isArray(features) && (
        <section className="mock-features">
          {features.map((f: any, i: number) => (
            <div className="mock-card" key={i}>
              <div style={{width: 40, height: 40, background: '#e0e7ff', borderRadius: 8, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                 <span className="icon" style={{color: '#4f46e5', fontSize: 20}}>star</span>
              </div>
              <h3>{f.title}</h3>
              <p style={{color: '#64748b', fontSize: '14px', lineHeight: 1.5}}>{f.description}</p>
            </div>
          ))}
        </section>
      )}

      <footer className="mock-footer">
        <div style={{marginBottom: 16}}>{data.app_name || 'Brand'}</div>
        <div style={{display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap'}}>
          {Object.values(footer).slice(0, 6).map((val: any, i) => (
             typeof val === 'string' && <span key={i}>{val}</span>
           ))}
        </div>
      </footer>
    </div>
  );
}
