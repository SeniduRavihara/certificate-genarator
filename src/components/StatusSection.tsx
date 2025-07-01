import { Cloud, Pause, Settings, Zap } from "lucide-react";
import React from "react";

type StatusSectionProps = {
  delegatesCount: number;
  isGenerating: boolean;
  currentIndex: number;
  total: number;
  uploadProgress: number;
  onPreview: () => void;
  onUploadAll: () => void;
};

const StatusSection: React.FC<StatusSectionProps> = ({
  delegatesCount,
  isGenerating,
  currentIndex,
  total,
  uploadProgress,
  onPreview,
  onUploadAll,
}) => (
  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 shadow-2xl">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
          <Zap className="w-6 h-6 mr-3 text-yellow-400" />
          Status
        </h3>
        <p className="text-slate-300">{delegatesCount} delegates loaded</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onPreview}
          disabled={isGenerating}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-xl transition-all duration-300 flex items-center gap-2 border border-slate-700 hover:border-blue-400"
        >
          <Settings className="w-4 h-4" />
          Preview
        </button>
        <button
          onClick={onUploadAll}
          disabled={isGenerating}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-blue-500/25"
        >
          {isGenerating ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Cloud className="w-4 h-4" />
          )}
          {isGenerating ? "Processing..." : "Upload All"}
        </button>
      </div>
    </div>
    {isGenerating && (
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-300">
            Processing certificate {currentIndex + 1} of {total}
          </span>
          <span className="text-blue-400 font-semibold">{uploadProgress}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      </div>
    )}
  </div>
);

export default StatusSection;
