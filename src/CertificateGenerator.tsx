// CertificateGenerator.tsx
// Modern Dark Theme with Enhanced UI
import type { ChangeEvent } from "react";
import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import AnimatedBackground from "./components/AnimatedBackground";
import ConfigSection from "./components/ConfigSection";
import HeaderSection from "./components/HeaderSection";
import PreviewSection from "./components/PreviewSection";
import StatusSection from "./components/StatusSection";
import UploadResults from "./components/UploadResults";
import UploadSection from "./components/UploadSection";
import { useAuth } from "./hooks/useAuth";

// Type Definitions
interface Delegate {
  id: string;
  certificateName: string;
  email: string;
  contactNumber: string;
  confirmedDateTime: string;
}

export interface CertificateConfig {
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

export interface FirebaseConfig {
  enabled: boolean;
  folderPath: string;
  generatePublicLinks: boolean;
}

interface CertificateData {
  delegate: Delegate;
  dataURL: string;
  filename: string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  filename: string;
  delegate: Delegate;
  uploadedAt?: string;
  error?: string;
}

// Add helper to get or create a folder in Google Drive
async function getOrCreateDriveFolder(
  token: string,
  folderName: string
): Promise<string> {
  // 1. Search for the folder
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(
      folderName
    )}'+and+mimeType='application/vnd.google-apps.folder'+and+trashed=false&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }
  // 2. Create the folder if not found
  const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    }),
  });
  const createData = await createRes.json();
  return createData.id;
}

const CertificateGenerator: React.FC = () => {
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [uploadedCertificates, setUploadedCertificates] = useState<
    UploadResult[]
  >([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [certificateConfig, setCertificateConfig] = useState<CertificateConfig>(
    {
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
    }
  );
  const [backgroundImage, setBackgroundImage] =
    useState<HTMLImageElement | null>(null);
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>({
    enabled: true,
    folderPath: "certificates",
    generatePublicLinks: true,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { accessToken } = useAuth();

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

  const handleBackgroundUpload = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
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

  const handleDelegatesUpload = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
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
            const jsonData = XLSX.utils.sheet_to_json(worksheet) as unknown[];

            const parsedDelegates: Delegate[] = jsonData.map((row) => {
              const r = row as Record<string, unknown>;
              return {
                id: (r["Email address"] || r["Email Address2"] || "")
                  .toString()
                  .trim(),
                certificateName: (r["Certificate Name"] || "")
                  .toString()
                  .trim(),
                email: (r["Email address"] || r["Email Address2"] || "")
                  .toString()
                  .trim(),
                contactNumber: (r["Contact Number"] || "").toString().trim(),
                confirmedDateTime: (r["Timestamp"] || "").toString().trim(),
              };
            });

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

  const generateSingleCertificate = async (
    delegate: Delegate
  ): Promise<CertificateData> => {
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
        ctx.fillText(
          `${certificateConfig.eventDate}`,
          canvas.width / 2,
          canvas.height - 100
        );
      }

      ctx.fillStyle = certificateConfig.textColor;
      ctx.font = `${certificateConfig.fontSize}px ${certificateConfig.fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        delegate.certificateName,
        certificateConfig.nameX,
        certificateConfig.nameY
      );

      const dataURL = canvas.toDataURL("image/png");
      resolve({
        delegate,
        dataURL,
        filename: `${delegate.certificateName}_certificate.png`,
      });
    });
  };

  const uploadToDrive = async (
    certificateData: CertificateData
  ): Promise<UploadResult> => {
    if (!accessToken) {
      return {
        success: false,
        error: "Not authenticated with Google Drive",
        filename: certificateData.filename,
        delegate: certificateData.delegate,
      };
    }
    try {
      // Convert dataURL to Blob
      const res = await fetch(certificateData.dataURL);
      const blob = await res.blob();
      // Get or create the folder in Drive
      const folderName = firebaseConfig.folderPath || "certificates";
      const folderId = await getOrCreateDriveFolder(accessToken, folderName);
      // Prepare metadata
      const metadata = {
        name: certificateData.filename,
        mimeType: "image/png",
        parents: [folderId],
      };
      // Prepare multipart form data
      const formData = new FormData();
      formData.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      formData.append("file", blob);
      // Upload to Google Drive
      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          url: `https://drive.google.com/file/d/${result.id}/view`,
          filename: certificateData.filename,
          delegate: certificateData.delegate,
          uploadedAt: new Date().toISOString(),
        };
      } else {
        const error = await response.text();
        return {
          success: false,
          error,
          filename: certificateData.filename,
          delegate: certificateData.delegate,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
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
        const uploadResult = await uploadToDrive(certificateData);
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

  const handleConfigChange = (field: string, value: string | number): void => {
    setCertificateConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleFirebaseConfigChange = (
    field: string,
    value: string | boolean
  ): void => {
    setFirebaseConfig((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      <AnimatedBackground />
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <HeaderSection />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <UploadSection
              onBackgroundUpload={handleBackgroundUpload}
              onDelegatesUpload={handleDelegatesUpload}
            />
            <ConfigSection
              certificateConfig={certificateConfig}
              firebaseConfig={firebaseConfig}
              onConfigChange={handleConfigChange}
              onFirebaseConfigChange={handleFirebaseConfigChange}
            />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <StatusSection
              delegatesCount={delegates.length}
              isGenerating={isGenerating}
              currentIndex={currentIndex}
              total={delegates.length}
              uploadProgress={uploadProgress}
              onPreview={generatePreview}
              onUploadAll={generateAndUploadAll}
            />
            <UploadResults
              uploadedCertificates={uploadedCertificates}
              onDownload={downloadCertificatesList}
            />
            <PreviewSection
              canvasRef={canvasRef}
              width={certificateConfig.width}
              height={certificateConfig.height}
              currentName={
                delegates[currentIndex]?.certificateName || "Sample Certificate"
              }
            />
          </div>
        </div>
        {/* <InstructionsSection /> */}
      </div>
    </div>
  );
};

export default CertificateGenerator;
