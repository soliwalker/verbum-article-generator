
import React, { useState, useEffect, useCallback } from 'react';
import { SearchIntent, GenerationInput, GeneratedContent } from './types';
import { generateSEOContent } from './services/geminiService';
import Sidebar from './components/Sidebar';
import { 
  Send, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle, 
  BookText, 
  ChevronRight,
  Sparkles,
  Download
} from 'lucide-react';

const App: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [theme, setTheme] = useState('');
  const [intent, setIntent] = useState<SearchIntent>(SearchIntent.INFORMATIVO);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState<GeneratedContent | null>(null);
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('puraluce_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('puraluce_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    if (!keyword || !theme) {
      setError("Inserisci sia la Keyword che il Tema.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCopySuccess(false);

    try {
      const input: GenerationInput = { keyword, theme, intent };
      const markdown = await generateSEOContent(input);
      
      // Extract title from markdown (first line usually # Title)
      const titleMatch = markdown.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : `Articolo: ${keyword}`;

      const newContent: GeneratedContent = {
        id: crypto.randomUUID(),
        title,
        markdown,
        timestamp: Date.now()
      };

      setCurrentContent(newContent);
      setHistory(prev => [newContent, ...prev]);
    } catch (err: any) {
      setError(err.message || "Errore sconosciuto durante la generazione.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (currentContent) {
      navigator.clipboard.writeText(currentContent.markdown);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDelete = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    if (currentContent?.id === id) {
      setCurrentContent(null);
    }
  };

  const handleSelectHistory = (item: GeneratedContent) => {
    setCurrentContent(item);
    setError(null);
  };

  const handleNew = () => {
    setCurrentContent(null);
    setKeyword('');
    setTheme('');
    setIntent(SearchIntent.INFORMATIVO);
    setError(null);
  };

  return (
    <div className="flex h-screen bg-[#fdfbf7] overflow-hidden">
      <Sidebar 
        history={history} 
        onSelect={handleSelectHistory} 
        onNew={handleNew}
        onDelete={handleDelete}
        activeId={currentContent?.id}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="hover:text-amber-600 cursor-pointer">Dashboard</span>
            <ChevronRight size={14} />
            <span className="font-semibold text-gray-800">Content Engine</span>
          </div>
          
          <div className="flex items-center gap-4">
            {currentContent && (
              <div className="flex gap-2">
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {copySuccess ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  {copySuccess ? 'Copiato' : 'Copia MD'}
                </button>
                <button 
                   onClick={() => {
                     const blob = new Blob([currentContent.markdown], { type: 'text/markdown' });
                     const url = URL.createObjectURL(blob);
                     const a = document.createElement('a');
                     a.href = url;
                     a.download = `${currentContent.title.replace(/\s+/g, '_')}.md`;
                     a.click();
                   }}
                   className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                >
                  <Download size={16} />
                  Scarica
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Pane: Controls */}
          <div className="w-1/3 border-r border-gray-200 p-8 overflow-y-auto bg-white/50">
            <div className="max-w-md mx-auto space-y-8">
              <div>
                <h2 className="font-serif-header text-xl text-gray-900 mb-1">Dati d'Ingresso</h2>
                <p className="text-sm text-gray-500 italic">Configura le variabili programmatiche per l'IA.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Keyword Principale
                  </label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Es: Preghiera a Sant'Antonio"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Tema Specifico
                  </label>
                  <textarea
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="Es: Richiesta di intercessione per oggetti smarriti"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Intento di Ricerca
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.values(SearchIntent).map((item) => (
                      <button
                        key={item}
                        onClick={() => setIntent(item)}
                        className={`px-4 py-3 rounded-lg text-left text-sm font-medium border transition-all ${
                          intent === item 
                            ? 'bg-amber-50 border-amber-600 text-amber-700' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm flex items-start gap-3 border border-red-100">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-600/20 transition-all transform active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Scrivendo con sapienza...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Genera Contenuto SEO
                    </>
                  )}
                </button>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                  <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-3">
                    <BookText size={16} />
                    Promemoria E-E-A-T
                  </h3>
                  <ul className="text-xs text-blue-800 space-y-2 list-disc pl-4 opacity-80">
                    <li>Verifica sempre le citazioni liturgiche.</li>
                    <li>Mantieni un distacco rispettoso dai temi sensibili.</li>
                    <li>Utilizza la keyword nel primo paragrafo.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Pane: Preview */}
          <div className="flex-1 flex flex-col bg-[#fdfbf7] relative">
            {currentContent ? (
              <div className="flex-1 overflow-y-auto p-12 scroll-smooth">
                <div className="max-w-3xl mx-auto">
                  <div className="mb-8 flex items-center justify-between text-xs text-amber-700 font-bold uppercase tracking-widest bg-amber-50 py-2 px-4 rounded-full w-fit">
                    <Sparkles size={12} className="mr-2" />
                    Bozza Generata da IA Senior
                  </div>
                  <div 
                    className="prose prose-slate prose-lg font-serif-body"
                    dangerouslySetInnerHTML={{ 
                      __html: renderMarkdown(currentContent.markdown) 
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-400">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <BookText size={40} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-serif-header text-gray-800 mb-2">Pronto per la Creazione</h3>
                <p className="max-w-sm mx-auto leading-relaxed">
                  Inserisci i parametri nel pannello di sinistra per generare un contenuto 
                  spirituale ottimizzato per la SEO di PuraLuce.it.
                </p>
              </div>
            )}
            
            {isLoading && !currentContent && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-6"></div>
                <p className="font-serif-header text-amber-900 animate-pulse tracking-widest text-lg">
                  L'ISSPIRAZIONE STA ARRIVANDO...
                </p>
                <p className="text-gray-500 mt-2 text-sm">Consultando le fonti liturgiche e ottimizzando la SEO</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

/**
 * Simple markdown renderer to avoid heavy dependencies in this specific prompt context.
 * For production, use 'react-markdown' or 'marked'.
 */
function renderMarkdown(md: string): string {
  let html = md;
  // Headings
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="font-serif-header text-4xl mb-8">$1</h1>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="font-serif-header text-2xl mb-4">$1</h2>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="font-serif-header text-xl mb-3">$1</h3>');
  
  // Lists
  html = html.replace(/^\-\s+(.+)$/gm, '<li class="ml-4 mb-2">$1</li>');
  html = html.replace(/(<li>.+<\/li>)/gs, '<ul class="mb-6 list-disc">$1</ul>');
  
  // Tables (Very basic regex)
  html = html.replace(/\|(.+)\|/g, '<tr><td>$1</td></tr>');
  html = html.replace(/<td>\s+---\s+<\/td>/g, ''); // ignore separators
  
  // Newlines
  html = html.split('\n\n').map(p => {
    if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<tr')) return p;
    return `<p>${p.replace(/\n/g, '<br>')}</p>`;
  }).join('');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  return html;
}

export default App;
