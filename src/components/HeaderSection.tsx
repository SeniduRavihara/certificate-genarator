import { Sparkles } from "lucide-react";
import React from "react";
import GoogleAuthButton from "./GoogleAuthButton";

const HeaderSection: React.FC = () => (
  <div className="relative text-center mb-12">
    <div className="absolute top-0 right-0 mt-2 mr-2 z-20">
      <GoogleAuthButton size={44} />
    </div>
    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl animate-pulse">
      <Sparkles className="w-10 h-10 text-white" />
    </div>
    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
      Certificate Generator
    </h1>
    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
      Create and upload beautiful certificates with Firebase integration
    </p>
  </div>
);

export default HeaderSection;
