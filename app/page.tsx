"use client";

import { useState, useCallback, useEffect } from "react";
import { config } from "./config";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Share2, Copy, ExternalLink, Github, Twitter, CloudUpload, CheckCircle2, Settings, Activity, Database, ChevronDown } from "lucide-react";
import { AnimatedText } from "./components/animated-text";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";
import { Header } from "./components/header";
import { SystemModal } from "./components/system-modal";
import { StorageModal } from "./components/storage-modal";
import { SettingsModal } from "./components/settings-modal";

export default function Home() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cliCommand, setCliCommand] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [systemModalOpen, setSystemModalOpen] = useState(false);
  const [storageModalOpen, setStorageModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    remote: "oned",
    remoteFolder: "/",
    remoteFileName: "",
    chunkSize: "4"
  });
  const { toast } = useToast();

  const updateCliCommand = useCallback(() => {
    if (!selectedFile) return;
    
    let command = `ksau-go upload -f "${selectedFile.name}"`;
    command += ` -r "${formValues.remoteFolder || '/'}"`;
    if (formValues.remoteFileName) {
      command += ` -n "${formValues.remoteFileName}"`;
    }
    command += ` -s ${parseInt(formValues.chunkSize) * 1024 * 1024}`;
    command += ` --remote-config ${formValues.remote}`;
    
    setCliCommand(command.trim());
  }, [selectedFile, formValues]);

  useEffect(() => {
    updateCliCommand();
  }, [selectedFile, formValues, updateCliCommand]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      toast({
        title: "File selected",
        description: `${acceptedFiles[0].name} (${(acceptedFiles[0].size / 1024 / 1024).toFixed(2)} MB)`,
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleFormChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile || isUploading) return;
    
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData(event.currentTarget);
    formData.set('file', selectedFile);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 500);

      const response = await fetch(`${config.apiEndpoint}${config.endpoints.upload}`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      const result = await response.json();
      if (response.ok) {
        setUploadProgress(100);
        setDownloadUrl(result.downloadURL);
        toast({
          title: "Upload complete",
          description: "File uploaded successfully to the cloud",
        });
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      setUploadProgress(0);
      console.error('Upload error:', error);
      
      let errorMessage = "Upload failed";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (!navigator.onLine) {
        errorMessage = "No internet connection";
      } else {
        try {
          const errorResponse = await (error as Response).json();
          errorMessage = errorResponse.message || errorMessage;
        } catch {
          // Keep default error message if json parsing fails
        }
      }

      toast({
        title: "Upload Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(downloadUrl).then(() => {
      toast({
        title: "URL Copied",
        description: "Download link copied to clipboard",
      });
    });
  };

  const openUrl = () => {
    window.open(downloadUrl, "_blank");
  };

  const copyCliCommand = () => {
    navigator.clipboard.writeText(cliCommand).then(() => {
      toast({
        title: "Command Copied",
        description: "CLI command copied to clipboard",
      });
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-12 max-w-2xl">
        {/* Hero Section */}
        <section className="text-center space-y-8 mb-16 fade-in">
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-3xl rounded-full"></div>
                <CloudUpload className="relative h-16 w-16 text-primary" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-5xl font-light tracking-tight">Ksau</h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                Simple, fast file sharing for developers
              </p>
            </div>
          </div>
        </section>

        {/* Main Upload Card */}
        <Card className="mb-8 slide-in border-border/50 shadow-lg backdrop-blur-sm bg-card/50">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Upload Drop Zone */}
              <div 
                {...getRootProps()} 
                className={`drop-zone p-12 text-center transition-all duration-300 rounded-2xl ${
                  isDragActive ? 'active scale-[1.02]' : ''
                } ${isUploading ? 'pointer-events-none opacity-50' : 'hover:bg-muted/30 cursor-pointer'}`}
              >
                <input {...getInputProps()} disabled={isUploading} />
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 blur-2xl rounded-full"></div>
                    <Upload className={`relative h-14 w-14 mx-auto transition-all duration-300 ${
                      isDragActive ? 'text-primary scale-110' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium">
                      {isDragActive
                        ? "Drop your file here"
                        : selectedFile 
                          ? "File ready to upload"
                          : "Drop a file or click to browse"}
                    </h3>
                    {selectedFile && (
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-foreground">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                        </p>
                      </div>
                    )}
                    {!selectedFile && (
                      <p className="text-sm text-muted-foreground">
                        Maximum file size: 100MB
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  Advanced Options
                  <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </Button>
                
                {showAdvanced && (
                  <div className="space-y-6 p-6 bg-muted/30 rounded-xl border border-border/50 slide-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Storage Remote</label>
                        <Select 
                          name="remote" 
                          defaultValue={formValues.remote}
                          onValueChange={(value) => handleFormChange('remote', value)}
                          disabled={isUploading}
                        >
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Select remote" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hakimionedrive">Hakimi OneDrive</SelectItem>
                            <SelectItem value="oned">OneDrive</SelectItem>
                            <SelectItem value="saurajcf">Sauraj CF</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Chunk Size</label>
                        <Select 
                          name="chunkSize" 
                          defaultValue={formValues.chunkSize}
                          onValueChange={(value) => handleFormChange('chunkSize', value)}
                          disabled={isUploading}
                        >
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Select chunk size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2MB</SelectItem>
                            <SelectItem value="4">4MB</SelectItem>
                            <SelectItem value="8">8MB</SelectItem>
                            <SelectItem value="16">16MB</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Remote Folder</label>
                      <Input
                        type="text"
                        name="remoteFolder"
                        value={formValues.remoteFolder}
                        onChange={(e) => handleFormChange('remoteFolder', e.target.value)}
                        placeholder="Enter target directory"
                        disabled={isUploading}
                        className="bg-background/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Custom Filename (Optional)</label>
                      <Input
                        type="text"
                        name="remoteFileName"
                        value={formValues.remoteFileName}
                        onChange={(e) => handleFormChange('remoteFileName', e.target.value)}
                        placeholder="Enter custom filename"
                        disabled={isUploading}
                        className="bg-background/50"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Section */}
              {isUploading && (
                <div className="space-y-4 p-6 bg-muted/30 rounded-xl border border-border/50 slide-in">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Upload Progress</span>
                    <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Upload Button */}
              <Button
                type="submit"
                disabled={isUploading || !selectedFile}
                className="w-full h-12 text-lg font-medium rounded-xl"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <Upload className="h-5 w-5 mr-2 animate-pulse" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CloudUpload className="h-5 w-5 mr-2" />
                    Upload File
                  </>
                )}
              </Button>

              {/* CLI Command Display */}
              {selectedFile && !isUploading && (
                <div className="p-4 bg-muted/30 rounded-xl border border-border/50 space-y-3 slide-in">
                  <p className="text-sm font-medium">Equivalent CLI Command:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono bg-background/50 px-3 py-2 rounded-lg flex-1 overflow-x-auto">
                      {cliCommand}
                    </code>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={copyCliCommand}
                      className="flex-shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {downloadUrl && (
          <Card className="mb-8 slide-in border-success/20 bg-success/5">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <h3 className="text-lg font-medium">Upload Complete</h3>
                </div>
                <div className="download-box">
                  <div className="download-box-content flex items-center gap-3">
                    <Share2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <AnimatedText
                        text={downloadUrl}
                        className="text-sm font-mono break-all"
                        config={{
                          charDelay: 20,
                          animDuration: 150
                        }}
                      />
                    </div>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={copyUrl}
                        className="flex-shrink-0 h-8 w-8"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={openUrl}
                        className="flex-shrink-0 h-8 w-8"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 action-bar">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSystemModalOpen(true)}
            className="rounded-full"
          >
            <Activity className="h-4 w-4 mr-2" />
            System Status
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStorageModalOpen(true)}
            className="rounded-full"
          >
            <Database className="h-4 w-4 mr-2" />
            Storage
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSettingsModalOpen(true)}
            className="rounded-full"
          >
            <Settings className="h-4 w-4 mr-2" />
            Info
          </Button>
        </div>

        {/* Footer */}
        <footer className="text-center space-y-6 pt-8 border-t border-border/50">
          <div className="flex justify-center gap-6">
            <a
              href="https://github.com/global-index-source/ksau-go"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted/50"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://x.com/k_sauraj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted/50"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ by the open-source community
          </p>
        </footer>
      </main>

      {/* Modals */}
      <SystemModal open={systemModalOpen} onOpenChange={setSystemModalOpen} />
      <StorageModal open={storageModalOpen} onOpenChange={setStorageModalOpen} />
      <SettingsModal open={settingsModalOpen} onOpenChange={setSettingsModalOpen} />
    </div>
  );
}