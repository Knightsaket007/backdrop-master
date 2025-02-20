import React from 'react';
import { Undo, Redo, Sparkles, Download, Check } from 'lucide-react';

interface ToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  isCropping: boolean;
  onApplyCrop: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onUndo, onRedo, onExport, isCropping, onApplyCrop }) => {
  return (
    <div className="h-16 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 flex items-center justify-between px-4 md:px-6">
      <div className="flex gap-2 md:gap-4">
        <button onClick={onUndo} className="p-2 hover:bg-gray-700 rounded-lg transition-colors group">
          <Undo size={20} className="group-hover:scale-110 transition-transform" />
        </button>
        <button onClick={onRedo} className="p-2 hover:bg-gray-700 rounded-lg transition-colors group">
          <Redo size={20} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        {isCropping && (
          <button 
            onClick={onApplyCrop}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Check size={20} />
            Apply Crop
          </button>
        )}
        <button className="hidden md:flex px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg items-center gap-2 transition-colors">
          <Sparkles size={18} className="text-yellow-400" />
          AI Enhance
        </button>
        <button onClick={onExport} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 transition-colors group">
          <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
          <span className="hidden md:inline">Export</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;