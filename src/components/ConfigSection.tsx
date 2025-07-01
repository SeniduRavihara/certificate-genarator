import { Cloud, Settings } from "lucide-react";
import React from "react";
import type {
  CertificateConfig,
  FirebaseConfig,
} from "../CertificateGenerator";

type ConfigSectionProps = {
  certificateConfig: CertificateConfig;
  firebaseConfig: FirebaseConfig;
  onConfigChange: (field: string, value: string | number) => void;
  onFirebaseConfigChange: (field: string, value: string | boolean) => void;
};

const ConfigSection: React.FC<ConfigSectionProps> = ({
  certificateConfig,
  firebaseConfig,
  onConfigChange,
  onFirebaseConfigChange,
}) => (
  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
      <Settings className="w-6 h-6 mr-3 text-purple-400" />
      Configuration
    </h3>
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Name X
          </label>
          <input
            type="number"
            value={certificateConfig.nameX}
            onChange={(e) =>
              onConfigChange("nameX", parseInt(e.target.value) || 0)
            }
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Name Y
          </label>
          <input
            type="number"
            value={certificateConfig.nameY}
            onChange={(e) =>
              onConfigChange("nameY", parseInt(e.target.value) || 0)
            }
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Font Size
          </label>
          <input
            type="number"
            value={certificateConfig.fontSize}
            onChange={(e) =>
              onConfigChange("fontSize", parseInt(e.target.value) || 0)
            }
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Text Color
          </label>
          <input
            type="color"
            value={certificateConfig.textColor}
            onChange={(e) => onConfigChange("textColor", e.target.value)}
            className="w-full h-12 bg-slate-800 border border-slate-700 rounded-xl cursor-pointer"
          />
        </div>
      </div>
      {/* Firebase Config */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
        <h4 className="font-semibold text-blue-300 mb-3 flex items-center">
          <Cloud className="w-4 h-4 mr-2" />
          Firebase Settings
        </h4>
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-2">
            Storage Folder
          </label>
          <input
            type="text"
            value={firebaseConfig.folderPath}
            onChange={(e) =>
              onFirebaseConfigChange("folderPath", e.target.value)
            }
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none"
            placeholder="certificates"
          />
        </div>
      </div>
    </div>
  </div>
);

export default ConfigSection;
