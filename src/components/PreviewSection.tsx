import React from "react";

type PreviewSectionProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  width: number;
  height: number;
  currentName: string;
};

const PreviewSection: React.FC<PreviewSectionProps> = ({
  canvasRef,
  width,
  height,
  currentName,
}) => (
  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
    <h3 className="text-2xl font-bold text-white mb-6 text-center">
      Certificate Preview
    </h3>
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="max-w-full h-auto rounded-lg shadow-2xl mx-auto block"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <p className="text-center text-slate-400 mt-4">Current: {currentName}</p>
    </div>
  </div>
);

export default PreviewSection;
