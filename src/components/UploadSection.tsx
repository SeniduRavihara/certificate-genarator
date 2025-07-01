import { FileText, Upload } from "lucide-react";
import React from "react";

type UploadSectionProps = {
  onBackgroundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelegatesUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const UploadSection: React.FC<UploadSectionProps> = ({
  onBackgroundUpload,
  onDelegatesUpload,
}) => (
  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
      <Upload className="w-6 h-6 mr-3 text-blue-400" />
      Upload Files
    </h3>
    <div className="space-y-6">
      {/* Background Upload */}
      <div className="group">
        <label className="block text-sm font-semibold text-slate-300 mb-3">
          Certificate Background
        </label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={onBackgroundUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-slate-600 group-hover:border-blue-400 rounded-xl p-8 text-center transition-all duration-300 hover:bg-slate-800/50">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-slate-400 group-hover:text-blue-400 transition-colors">
              Drop image here or click to browse
            </p>
          </div>
        </div>
      </div>
      {/* Delegates Upload */}
      <div className="group">
        <label className="block text-sm font-semibold text-slate-300 mb-3">
          Delegates Excel File
        </label>
        <div className="relative">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={onDelegatesUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-slate-600 group-hover:border-green-400 rounded-xl p-8 text-center transition-all duration-300 hover:bg-slate-800/50">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-slate-400 group-hover:text-green-400 transition-colors">
              Drop Excel file here or click to browse
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default UploadSection;
