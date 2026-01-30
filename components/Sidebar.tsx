
import React from 'react';
import { GeneratedContent } from '../types';
import { BookOpen, History, Plus, Trash2 } from 'lucide-react';

interface SidebarProps {
  history: GeneratedContent[];
  onSelect: (content: GeneratedContent) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  activeId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ history, onSelect, onNew, onDelete, activeId }) => {
  return (
    <div className="w-80 bg-slate-900 text-slate-100 flex flex-col h-full border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            P
          </div>
          <h1 className="font-serif-header text-lg tracking-wider text-amber-500">PuraLuce</h1>
        </div>
        
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 transition-colors py-3 rounded-lg font-medium"
        >
          <Plus size={18} />
          Nuovo Articolo
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4 px-2">
          <History size={14} />
          Cronologia
        </div>
        
        {history.length === 0 ? (
          <div className="text-slate-500 text-center py-8 text-sm italic px-4">
            Nessun contenuto generato ancora. Inizia a creare per popolare la tua cronologia.
          </div>
        ) : (
          <div className="space-y-1">
            {history.map((item) => (
              <div
                key={item.id}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                  activeId === item.id ? 'bg-amber-600/20 text-amber-500 border border-amber-600/30' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex-1 truncate" onClick={() => onSelect(item)}>
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} className="shrink-0" />
                    <span className="truncate font-medium">{item.title}</span>
                  </div>
                  <div className="text-[10px] opacity-60 mt-1">
                    {new Date(item.timestamp).toLocaleDateString('it-IT')}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 bg-slate-950 text-[10px] text-slate-500 border-top border-slate-800">
        PuraLuce SEO Engine v2.4 • Senior Copywriter Assistant
      </div>
    </div>
  );
};

export default Sidebar;
