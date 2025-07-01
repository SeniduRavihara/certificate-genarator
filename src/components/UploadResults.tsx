import React from "react";
import { Check, ExternalLink, ArrowRight } from "lucide-react";
import type { UploadResult } from "../CertificateGenerator";

type UploadResultsProps = {
  uploadedCertificates: UploadResult[];
  onDownload: () => void;
};

const UploadResults: React.FC<UploadResultsProps> = ({ uploadedCertificates, onDownload }) => {
  if (uploadedCertificates.length === 0) return null;
  return (
    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <Check className="w-6 h-6 mr-3 text-green-400" />
          Upload Complete
        </h3>
        <button
          onClick={onDownload}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-green-500/25"
        >
          <ExternalLink className="w-4 h-4" />
          Download List
        </button>
      </div>
      <div className="bg-slate-900/50 rounded-xl p-4 max-h-64 overflow-y-auto">
        <div className="grid gap-3">
          {uploadedCertificates.map((cert, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
              <div>
                <p className="font-semibold text-white">{cert.delegate.certificateName}</p>
                <p className="text-sm text-slate-400">{cert.delegate.email}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-green-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadResults; 