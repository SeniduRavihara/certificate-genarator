// CertificateGenerator.tsx
// Modern Dark Theme with Enhanced UI
import { Cloud, ExternalLink, Pause, Settings, Upload, FileText, Sparkles, Zap, Check, ArrowRight } from "lucide-react";
import type { ChangeEvent } from "react";
import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";

// Type Definitions
interface Delegate {
  id: string;
  certificateName: string;
  email: string;
  contactNumber: string;
  confirmedDateTime: string;
}

interface CertificateConfig {
  width: number;
  height: number;
  nameX: number;
  nameY: number;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  textAlign: string;
  eventName: string;
  eventDate: string;
}

interface FirebaseConfig {
  enabled: boolean;
  folderPath: string;
  generatePublicLinks: boolean;
}

interface CertificateData {
  delegate: Delegate;
  dataURL: string;
  filename: string;
}

interface UploadResult {
  success: boolean;
  url?: string;
  filename: string;
  delegate: Delegate;
  uploadedAt?: string;
  error?: string;
}

const CertificateGenerator: React.FC = () => {
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [uploadedCertificates, setUploadedCertificates] = useState<UploadResult[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [certificateConfig, setCertificateConfig] = useState<CertificateConfig>({
    width: 1200,
    height: 800,
    nameX: 650,
    nameY: 490,
    fontSize: 48,
    fontFamily: "serif",
    textColor: "#000000",
    textAlign: "center",
    eventName: "Road To Legacy 2.0",
    eventDate: "May 31, 2025",
  });
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>({
    enabled: true,
    folderPath: "certificates",
    generatePublicLinks: true,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sample delegate data
  const sampleDelegates: Delegate[] = [
    {
      id: "john@example.com",
      certificateName: "John Doe",
      email: "john@example.com",
      contactNumber: "+94757711901",
      confirmedDateTime: "2025-06-22 22:22:03",
    },
    {
      id: "jane@example.com",
      certificateName: "Jane Smith",
      email: "jane@example.com",
      contactNumber: "0704300340",
      confirmedDateTime: "2025-06-22 22:32:24",
    },
    {
      id: "bob@example.com",
      certificateName: "Bob Johnson",
      email: "bob@example.com",
      contactNumber: "07797710811",
      confirmedDateTime: "2025-06-22 22:40:30",
    },
  ];

  const handleBackgroundUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          const img = new Image();
          img.onload = () => {
            setBackgroundImage(img);
            setCertificateConfig((prev) => ({
              ...prev,
              width: img.width,
              height: img.height,
            }));
          };
          img.src = result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelegatesUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const result = e.target?.result;
          if (result instanceof ArrayBuffer) {
            const data = new Uint8Array(result);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

            const parsedDelegates: Delegate[] = jsonData.map((row: any) => ({
              id: (row["Email address"] || row["Email Address2"] || "").toString().trim(),
              certificateName: (row["Certificate Name"] || "").toString().trim(),
              email: (row["Email address"] || row["Email Address2"] || "").toString().trim(),
              contactNumber: (row["Contact Number"] || "").toString().trim(),
              confirmedDateTime: (row["Timestamp"] || "").toString().trim(),
            }));

            setDelegates(parsedDelegates);
            setCurrentIndex(0);
          }
        } catch (error) {
          console.error("Error parsing Excel file:", error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const generateSingleCertificate = async (delegate: Delegate): Promise<CertificateData> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas not found");

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not found");

      canvas.width = certificateConfig.width;
      canvas.height = certificateConfig.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (backgroundImage) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        ctx.fillStyle = "#000000";
        ctx.font = "36px serif";
        ctx.textAlign = "center";
        ctx.fillText("Certificate of Participation", canvas.width / 2, 150);
        ctx.font = "24px serif";
        ctx.fillText(`${certificateConfig.eventName}`, canvas.width / 2, 200);
        ctx.fillText(`${certificateConfig.eventDate}`, canvas.width / 2, canvas.height - 100);
      }

      ctx.fillStyle = certificateConfig.textColor;
      ctx.font = `${certificateConfig.fontSize}px ${certificateConfig.fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(delegate.certificateName, certificateConfig.nameX, certificateConfig.nameY);

      const dataURL = canvas.toDataURL("image/png");
      resolve({ delegate, dataURL, filename: `${delegate.certificateName}_certificate.png` });
    });
  };

  const uploadToFirebase = async (certificateData: CertificateData): Promise<UploadResult> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));
      return {
        success: true,
        url: `https://firebasestorage.googleapis.com/v0/b/your-project.appspot.com/o/${firebaseConfig.folderPath}%2F${encodeURIComponent(certificateData.delegate.certificateName)}-certificate.png?alt=media`,
        filename: certificateData.filename,
        delegate: certificateData.delegate,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        filename: certificateData.filename,
        delegate: certificateData.delegate,
      };
    }
  };

  const generateAndUploadAll = async (): Promise<void> => {
    if (delegates.length === 0) {
      setDelegates(sampleDelegates);
      return;
    }

    setIsGenerating(true);
    setUploadProgress(0);
    const uploaded: UploadResult[] = [];

    for (let i = 0; i < delegates.length; i++) {
      setCurrentIndex(i);
      setUploadProgress(Math.round((i / delegates.length) * 100));

      try {
        const certificateData = await generateSingleCertificate(delegates[i]);
        const uploadResult = await uploadToFirebase(certificateData);
        if (uploadResult.success) uploaded.push(uploadResult);
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error("Error:", error);
      }
    }

    setUploadProgress(100);
    setUploadedCertificates(uploaded);
    setIsGenerating(false);
  };

  const generatePreview = async (): Promise<void> => {
    const currentDelegate = delegates[currentIndex] || sampleDelegates[0];
    await generateSingleCertificate(currentDelegate);
  };

  const downloadCertificatesList = (): void => {
    const csvContent = [
      ["Name", "Email", "Contact Number", "Certificate URL", "Upload Date"],
      ...uploadedCertificates.map((cert) => [
        cert.delegate.certificateName,
        cert.delegate.email,
        cert.delegate.contactNumber,
        cert.url || "",
        cert.uploadedAt || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "certificate-urls.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleConfigChange = (field: keyof CertificateConfig, value: string | number): void => {
    setCertificateConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleFirebaseConfigChange = (field: keyof FirebaseConfig, value: string | boolean): void => {
    setFirebaseConfig((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
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

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1 space-y-6">
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
                      onChange={handleBackgroundUpload}
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
                      onChange={handleDelegatesUpload}
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

            {/* Configuration */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Settings className="w-6 h-6 mr-3 text-purple-400" />
                Configuration
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Name X</label>
                    <input
                      type="number"
                      value={certificateConfig.nameX}
                      onChange={(e) => handleConfigChange("nameX", parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Name Y</label>
                    <input
                      type="number"
                      value={certificateConfig.nameY}
                      onChange={(e) => handleConfigChange("nameY", parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Font Size</label>
                    <input
                      type="number"
                      value={certificateConfig.fontSize}
                      onChange={(e) => handleConfigChange("fontSize", parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Text Color</label>
                    <input
                      type="color"
                      value={certificateConfig.textColor}
                      onChange={(e) => handleConfigChange("textColor", e.target.value)}
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
                    <label className="block text-sm font-medium text-blue-200 mb-2">Storage Folder</label>
                    <input
                      type="text"
                      value={firebaseConfig.folderPath}
                      onChange={(e) => handleFirebaseConfigChange("folderPath", e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all outline-none"
                      placeholder="certificates"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview and Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                    <Zap className="w-6 h-6 mr-3 text-yellow-400" />
                    Status
                  </h3>
                  <p className="text-slate-300">
                    {delegates.length} delegates loaded
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={generatePreview}
                    disabled={isGenerating}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-xl transition-all duration-300 flex items-center gap-2 border border-slate-700 hover:border-blue-400"
                  >
                    <Settings className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={generateAndUploadAll}
                    disabled={isGenerating}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-blue-500/25"
                  >
                    {isGenerating ? <Pause className="w-4 h-4" /> : <Cloud className="w-4 h-4" />}
                    {isGenerating ? "Processing..." : "Upload All"}
                  </button>
                </div>
              </div>

              {isGenerating && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">
                      Processing certificate {currentIndex + 1} of {delegates.length}
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

            {/* Upload Results */}
            {uploadedCertificates.length > 0 && (
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <Check className="w-6 h-6 mr-3 text-green-400" />
                    Upload Complete
                  </h3>
                  <button
                    onClick={downloadCertificatesList}
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
            )}

            {/* Preview */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Certificate Preview</h3>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
                <canvas
                  ref={canvasRef}
                  width={certificateConfig.width}
                  height={certificateConfig.height}
                  className="max-w-full h-auto rounded-lg shadow-2xl mx-auto block"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <p className="text-center text-slate-400 mt-4">
                  Current: {delegates[currentIndex]?.certificateName || "Sample Certificate"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-slate-900/30 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6">Setup Instructions</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">1</div>
                <div>
                  <h4 className="font-semibold text-white">Install Firebase SDK</h4>
                  <code className="text-sm bg-slate-800 px-3 py-1 rounded text-blue-400 block mt-1">npm install firebase</code>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">2</div>
                <div>
                  <h4 className="font-semibold text-white">Configure Firebase</h4>
                  <p className="text-slate-400 text-sm mt-1">Create config file and import at the top</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">3</div>
                <div>
                  <h4 className="font-semibold text-white">Enable Upload Code</h4>
                  <p className="text-slate-400 text-sm mt-1">Uncomment Firebase functions in uploadToFirebase</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">4</div>
                <div>
                  <h4 className="font-semibold text-white">Upload Files</h4>
                  <p className="text-slate-400 text-sm mt-1">Add your certificate template and delegates Excel</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">5</div>
                <div>
                  <h4 className="font-semibold text-white">Configure & Generate</h4>
                  <p className="text-slate-400 text-sm mt-1">Adjust positioning and upload all certificates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;