import React from "react";

const InstructionsSection: React.FC = () => (
  <div className="mt-12 bg-slate-900/30 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
    <h3 className="text-2xl font-bold text-white mb-6">Setup Instructions</h3>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
            1
          </div>
          <div>
            <h4 className="font-semibold text-white">Install Firebase SDK</h4>
            <code className="text-sm bg-slate-800 px-3 py-1 rounded text-blue-400 block mt-1">
              npm install firebase
            </code>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
            2
          </div>
          <div>
            <h4 className="font-semibold text-white">Configure Firebase</h4>
            <p className="text-slate-400 text-sm mt-1">
              Create config file and import at the top
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
            3
          </div>
          <div>
            <h4 className="font-semibold text-white">Enable Upload Code</h4>
            <p className="text-slate-400 text-sm mt-1">
              Uncomment Firebase functions in uploadToFirebase
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
            4
          </div>
          <div>
            <h4 className="font-semibold text-white">Upload Files</h4>
            <p className="text-slate-400 text-sm mt-1">
              Add your certificate template and delegates Excel
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
            5
          </div>
          <div>
            <h4 className="font-semibold text-white">Configure & Generate</h4>
            <p className="text-slate-400 text-sm mt-1">
              Adjust positioning and upload all certificates
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default InstructionsSection;
