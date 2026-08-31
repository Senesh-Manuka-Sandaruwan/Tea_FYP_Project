'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Upload, 
  Cpu, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight, 
  RefreshCw, 
  Sparkles, 
  HelpCircle,
  Eye,
  ShieldCheck,
  Activity,
  Layers,
  Search
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface InferenceResult {
  prediction: string;
  confidence: number;
  explanation_text: string;
  all_probs: {
    blister_blight: number;
    brown_blight: number;
    healthy: number;
    red_rust: number;
  };
  gradcam_image: string;
}

export default function Homepage() {
  // States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<InferenceResult | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, token, setAuthModalOpen, refreshUser } = useAuth();

  // Statistics
  const stats = [
    { label: 'Model Accuracy', value: '98.01%', color: 'text-brand-neon' },
    { label: 'Latency Rate', value: '380 ms', color: 'text-brand-cyan' },
    { label: 'Ensemble Weights', value: 'CNN + ViT', color: 'text-brand-gold' },
    { label: 'Scanned Acreage', value: '12.4K ac', color: 'text-brand-white' }
  ];

  // Pathogens Database
  const diseaseIndex = [
    {
      id: 'gray_blight',
      name: 'Gray Blight',
      scientificName: 'Pestalotiopsis theae',
      type: 'Fungal Disease',
      severity: 'SEVERE OUTBREAK',
      color: 'border-brand-blister text-brand-blister',
      bg: 'bg-brand-blister/10',
      glow: 'shadow-[0_0_15px_rgba(255,184,51,0.15)]',
      symptoms: 'Causes small brown or grayish spots on tea leaves that gradually enlarge and develop a gray centre with darker margins. Severe infection can lead to larger necrotic areas, leaf drying and reduced healthy leaf area.',
      treatment: 'Remove infected leaves, improve ventilation through pruning and shade management, and apply approved fungicides when necessary to control further fungal spread.'
    },
    {
      id: 'brown_blight',
      name: 'Brown Blight',
      scientificName: 'Colletotrichum camelliae',
      type: 'Fungal Infection',
      severity: 'MODERATE RISK',
      color: 'border-brand-brown text-brand-brown',
      bg: 'bg-brand-brown/10',
      glow: 'shadow-[0_0_15px_rgba(210,125,45,0.15)]',
      symptoms: 'Initiates as brown lesions on mature margins, expanding concentrically. Yields black visual dots (acervuli) on the necrotic structure with leaf curling.',
      treatment: 'Remove fallen foliage debris. Balance soil NPK ratios with elevated potassium inputs. Spray triazole systemic fungicides in heavy infection waves.'
    },
    {
      id: 'red_rust',
      name: 'Red Rust',
      scientificName: 'Cephaleuros virescens',
      type: 'Parasitic Alga',
      severity: 'CRITICAL RISK',
      color: 'border-brand-rust text-brand-rust',
      bg: 'bg-brand-rust/10',
      glow: 'shadow-[0_0_15px_rgba(255,85,51,0.15)]',
      symptoms: 'Velvety, reddish-orange or reddish-brown circular patches emerge on leaves and twigs. Stems become weak, and bark breaks, yielding branch dieback.',
      treatment: 'Improve subsoil aeration to stop water stagnation. Spray copper oxychloride before the monsoon. Trim tall windbreaker branches to allow direct sunlight.'
    },
    {
      id: 'healthy',
      name: 'Healthy Leaf',
      scientificName: 'Camellia sinensis',
      type: 'Optimal Chlorophyll',
      severity: 'NO OUTBREAK',
      color: 'border-brand-neon text-brand-neon',
      bg: 'bg-brand-neon/10',
      glow: 'shadow-[0_0_15px_rgba(0,255,136,0.15)]',
      symptoms: 'Optimal cell structure, glossy green wax finish, absolute leaf turgor, robust capillary systems, and zero localized spots or fungal blister anomalies.',
      treatment: 'Verify daily nitrogen enrichment levels. Maintain pre-scheduled visual scanning and pruning frequencies. Monitor surrounding fields for early algal warning markers.'
    }
  ];

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG or PNG format).');
      return;
    }
    setSelectedFile(file);
    setErrorMsg(null);
    setDiagnosisResult(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Run Diagnosis Request
  const runDiagnosis = async () => {
    if (!selectedFile) return;

    if (!token || !user) {
      setErrorMsg('Authentication required. Please sign in to run diagnostics.');
      setAuthModalOpen(true);
      return;
    }

    if (user.credits < 20) {
      setErrorMsg('Insufficient credits. Each leaf analysis requires 20 credits, but your current balance is ' + user.credits + '. Please top up.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setLoadingStep(1);

    const timers = [
      setTimeout(() => setLoadingStep(2), 1000),
      setTimeout(() => setLoadingStep(3), 2000),
      setTimeout(() => setLoadingStep(4), 3000),
    ];

    try {
      const clientFormData = new FormData();
      clientFormData.append('file', selectedFile);

      const response = await fetch('/api/predict', {
        method: 'POST',
        body: clientFormData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      timers.forEach(t => clearTimeout(t));

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Diagnostic calculation error occurred.');
      }

      setTimeout(() => {
        setDiagnosisResult(data);
        setIsLoading(false);
        refreshUser();
      }, 500);

    } catch (err: any) {
      timers.forEach(t => clearTimeout(t));
      console.error(err);
      setErrorMsg(err.message || 'The AI backend is unreachable. Make sure python app.py is running on port 5000.');
      setIsLoading(false);
    }
  };

  const resetAnalyzer = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDiagnosisResult(null);
    setErrorMsg(null);
    setLoadingStep(0);
  };

  const getFriendlyDiagnosisName = (key: string) => {
    switch (key) {
      case 'gray_blight': return 'Gray Blight Tea Leaf';
      case 'brown_blight': return 'Brown Blight Tea Leaf';
      case 'red_rust': return 'Red Rust Tea Leaf';
      case 'healthy': return 'Healthy Tea Leaf';
      case 'not_a_leaf': return 'Not a Tea Leaf';
      default: return key.replace('_', ' ');
    }
  };

  const getFriendlyColorClass = (key: string) => {
    switch (key) {
      case 'gray_blight': return 'bg-brand-blister';
      case 'brown_blight': return 'bg-brand-brown';
      case 'red_rust': return 'bg-brand-rust';
      case 'healthy': return 'bg-brand-neon';
      default: return 'bg-brand-cyan';
    }
  };

  const getBorderColorClass = (key: string) => {
    switch (key) {
      case 'gray_blight': return 'border-brand-blister';
      case 'brown_blight': return 'border-brand-brown';
      case 'red_rust': return 'border-brand-rust';
      case 'healthy': return 'border-brand-neon';
      default: return 'border-brand-cyan';
    }
  };

  const getTextColorClass = (key: string) => {
    switch (key) {
      case 'gray_blight': return 'text-brand-blister';
      case 'brown_blight': return 'text-brand-brown';
      case 'red_rust': return 'text-brand-rust';
      case 'healthy': return 'text-brand-neon';
      default: return 'text-brand-cyan';
    }
  };

  return (
    <div className="w-full bg-brand-bg flex flex-col relative overflow-hidden">
      
      {/* Background Radial Glow Elements */}
      <div className="aurora-glow" />
      <div className="aurora-glow-cyan" />

      {/* 🍵 Section 1: Vibrant Hero Block */}
      <section className="relative border-b border-brand-neon/20 py-20 md:py-32 grid-bg-glow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Hero Left */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 border border-brand-neon bg-brand-neon/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-neon shadow-[0_0_15px_rgba(0,255,136,0.15)]">
                <Sparkles className="h-4 w-4" />
                Explainable Botanical AI Engine v3.1
              </div>
              
              <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-brand-white leading-[1.05]">
                Uncompromising <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon via-brand-cyan to-brand-gold">
                  Crop Diagnostics
                </span>
              </h1>
              
              {/* Raised text size from text-base md:text-lg to text-lg md:text-xl */}
              <p className="text-lg md:text-xl font-light text-brand-white/85 leading-relaxed max-w-xl">
                Deploying state-of-the-art computer vision to secure global tea estates. Our ensembled deep learning pipelines isolate pathogens and generate **Grad-CAM heatmaps** instantly with clinical agronomical accuracy.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="#analyzer" className="btn-neon btn-neon-primary text-sm py-3.5 px-6">
                  Launch Leaf Uploader
                </Link>
                <Link href="/services#pricing" className="btn-neon btn-neon-secondary text-sm py-3.5 px-6">
                  Our Pricing Policy
                </Link>
              </div>

              {/* Luminous Stats - Subtitle raised from text-[10px] to text-xs */}
              <div className="pt-8 border-t border-brand-neon/10 grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="space-y-1.5">
                    <span className={`block font-serif text-3.5xl md:text-4xl font-bold ${stat.color} drop-shadow-[0_0_10px_rgba(0,255,136,0.1)]`}>
                      {stat.value}
                    </span>
                    <span className="block text-xs uppercase font-bold tracking-wider text-brand-white/60">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Right: Glowing Technical Frame */}
            <div className="lg:col-span-5 relative w-full aspect-square bg-brand-panel border border-brand-neon/30 p-4 shadow-[0_0_40px_rgba(0,255,136,0.1)] overflow-hidden">
              <div className="laser-scanner" />
              
              <div className="w-full h-full relative border border-brand-neon/20 bg-brand-bg overflow-hidden">
                <img
                  src="images\homeimage1.jpeg"
                  alt="High-resolution visual of tea leaf cells"
                  className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-all duration-750"
                />
                
                {/* Information Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent flex flex-col justify-end p-6 space-y-2">
                  <div className="border border-brand-cyan/40 px-3 py-1 text-[10px] uppercase font-bold tracking-widest bg-brand-cyan/20 text-brand-cyan w-fit shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                    Inference Node: active
                  </div>
                  <h3 className="font-serif text-2.5xl font-bold text-brand-white">Nuwara Eliya High Range</h3>
                  <p className="text-xs font-mono text-brand-neon tracking-widest uppercase">
                    Spectral Venation Matrix: 99.93% Confirmed
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🔬 Section 2: Pathogens Index */}
      <section className="py-20 border-b border-brand-neon/10 bg-brand-panel relative" id="dictionary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-cyan block">Pathogen Diagnostic Registry</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-white">
              Supported Botanical Anomalies
            </h2>
            {/* Raised from text-sm to text-base */}
            <p className="text-base font-light text-brand-white/80 leading-relaxed max-w-2xl">
              Our fine-tuned dual-network models are calibrated to diagnose and isolate specific leaf pathogens. Review crop symptoms, visual profiles, and chemical treatments below:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {diseaseIndex.map((disease) => (
              <div 
                key={disease.id} 
                className={`glass-panel border-2 ${disease.color} ${disease.glow} p-6 flex flex-col justify-between space-y-6 relative overflow-hidden`}
              >
                {/* Colored Corner Accents */}
                <div className={`absolute top-0 right-0 w-8 h-8 ${disease.bg} border-b border-l ${disease.color} flex items-center justify-center`}>
                  <div className="h-1.5 w-1.5 bg-current animate-pulse" />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl font-bold text-brand-white leading-tight">
                      {disease.name}
                    </h3>
                    {/* Raised from text-[10px] to text-xs */}
                    <p className="text-xs italic text-brand-white/50 tracking-wider font-mono">
                      {disease.scientificName}
                    </p>
                  </div>
                  {/* Raised from text-[8px] to text-[10px] */}
                  <span className={`inline-block border text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest ${disease.color} ${disease.bg}`}>
                    {disease.type}
                  </span>
                  {/* Raised symptoms description from text-xs to text-sm */}
                  <p className="text-sm font-light text-brand-white/85 leading-relaxed pt-2">
                    <strong>Symptoms:</strong> {disease.symptoms}
                  </p>
                </div>
                
                {/* Raised agronomist treatment from text-[10px] to text-sm, title to text-xs */}
                <div className="pt-4 border-t border-brand-white/10 space-y-2">
                  <span className="block text-xs uppercase font-bold text-brand-cyan tracking-wider">Agronomist Treatment:</span>
                  <p className="text-sm text-brand-white/70 leading-relaxed font-light">
                    {disease.treatment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 Section 3: Interactive Leaf Analyzer Command Center */}
      <section className="py-24 border-b border-brand-neon/10 relative" id="analyzer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-neon block">AI Command Center</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-white">
              Leaf Diagnostic Console
            </h2>
            {/* Raised from text-sm to text-base */}
            <p className="text-base font-light text-brand-white/70 max-w-lg mx-auto leading-relaxed">
              Upload active crop photos to initiate instant, high-speed neural network ensembling and extract Grad-CAM heatmaps.
            </p>
          </div>

          <div className="max-w-5xl mx-auto border-2 border-brand-neon bg-brand-panel shadow-[0_0_50px_rgba(0,255,136,0.15)] relative">
            
            {/* Luminous Console Header - Raised from text-xs to text-sm, core stats to text-xs */}
            <div className="border-b-2 border-brand-neon bg-brand-gray/95 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="border border-brand-neon p-1.5 bg-brand-bg text-brand-neon">
                  <Activity className="h-4.5 w-4.5 animate-pulse" />
                </div>
                <span className="text-sm font-mono font-bold tracking-wider text-brand-white uppercase">
                  TEADIAGNOSTICS.SYSTEMS.INF-[PRO_V3.1]
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                {user ? (
                  <span className="text-xs font-mono uppercase bg-brand-neon/15 text-brand-neon border border-brand-neon/30 px-2.5 py-0.5 shadow-[0_0_8px_rgba(0,255,136,0.15)] animate-pulse">
                    Credits Balance: {user.credits}
                  </span>
                ) : (
                  <span className="text-xs font-mono uppercase bg-brand-rust/15 text-brand-rust border border-brand-rust/30 px-2.5 py-0.5 animate-pulse">
                    Requires Account (20 creds)
                  </span>
                )}
                <span className="hidden sm:inline-block text-xs font-mono uppercase bg-brand-neon/15 text-brand-neon border border-brand-neon/30 px-2.5 py-0.5">
                  CORE SPEED: 40 GFLOPS
                </span>
                <div className="flex items-center gap-2 text-sm font-bold uppercase text-brand-cyan">
                  <div className="h-2 w-2 bg-brand-cyan animate-ping" />
                  ONLINE
                </div>
              </div>
            </div>

            {/* Main Workspace */}
            <div className="p-6 md:p-10 relative">
              
              {/* STEP 1: Blueprint Uploader - Raised descriptions from text-xs to text-sm, button to text-xs/text-sm */}
              {!selectedFile && !isLoading && !diagnosisResult && (
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-brand-cyan/40 bg-brand-bg/50 p-16 text-center space-y-6 hover:bg-brand-bg/85 transition-all duration-300 cursor-pointer relative overflow-hidden group"
                  onClick={triggerUploadClick}
                >
                  <div className="laser-scanner opacity-40 group-hover:opacity-100 transition-opacity" />
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png"
                    className="hidden"
                  />
                  <div className="border-2 border-brand-cyan p-5 bg-brand-panel text-brand-cyan w-fit mx-auto shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                    <Upload className="h-10 w-10 animate-bounce" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-serif text-3.5xl font-bold text-brand-white">
                      Load Leaf Visuals
                    </h3>
                    <p className="text-sm font-light text-brand-white/60 max-w-md mx-auto leading-relaxed">
                      Drag and drop crop images here, or browse local hard-drives. Supported types: JPG, JPEG, PNG. RGB color matrix is automatically aligned inside vector channels.
                    </p>
                  </div>
                  <button type="button" className="btn-neon btn-neon-secondary text-xs uppercase tracking-wider font-bold py-3 px-6">
                    Select Leaf Image
                  </button>
                </div>
              )}

              {/* STEP 2: Preview Screen - Raised text to text-sm */}
              {selectedFile && previewUrl && !isLoading && !diagnosisResult && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-slide-up">
                  
                  <div className="md:col-span-5 relative aspect-square border-2 border-brand-cyan/40 bg-brand-bg overflow-hidden p-2 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
                    <div className="laser-scanner opacity-70" />
                    <img
                      src={previewUrl}
                      alt="Uploaded tea leaf preview"
                      className="w-full h-full object-cover border border-brand-cyan/20"
                    />
                    {/* Raised from text-[9px] to text-xs */}
                    <div className="absolute bottom-4 left-4 bg-brand-bg/90 border border-brand-cyan/30 text-brand-cyan px-2.5 py-1 text-xs font-mono uppercase tracking-widest">
                      UUID: {selectedFile.name.length > 20 ? `${selectedFile.name.substring(0, 15)}...` : selectedFile.name}
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-6">
                    <div className="space-y-3">
                      {/* Raised from text-[9px] to text-[11px] */}
                      <span className="text-[11px] font-mono uppercase tracking-widest text-brand-neon bg-brand-neon/10 border border-brand-neon/20 px-2.5 py-1">
                        JPEG Matrix Verified
                      </span>
                      <h3 className="font-serif text-3.5xl font-bold text-brand-white">Diagnostic Queue Ready</h3>
                      <p className="text-sm font-light text-brand-white/80 leading-relaxed">
                        Uploaded crop payload <span className="text-brand-cyan font-mono font-bold">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span> loaded. Trigger ensembled neural evaluations to map visual activation coordinates.
                      </p>
                    </div>

                    {errorMsg && (
                      <div className="border border-brand-rust/35 bg-brand-rust/10 p-4 flex gap-3 text-brand-rust shadow-[0_0_15px_rgba(255,85,51,0.15)]">
                        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 animate-bounce" />
                        <div className="space-y-1 w-full">
                          <h4 className="text-xs font-bold uppercase">Critical Diagnostics Error</h4>
                          <p className="text-sm leading-relaxed font-light">{errorMsg}</p>
                          {errorMsg.includes('credits') && (
                            <Link href="/packages" className="inline-block mt-3 text-xs font-mono font-bold uppercase tracking-wider text-brand-cyan hover:text-brand-neon transition-colors underline">
                              Purchase Compute Credits &rarr;
                            </Link>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        onClick={resetAnalyzer}
                        className="btn-neon btn-neon-secondary text-xs uppercase py-3 px-5"
                      >
                        Reset Image
                      </button>
                      <button
                        onClick={runDiagnosis}
                        className="btn-neon btn-neon-primary text-xs uppercase py-3 px-5"
                      >
                        Run Leaf Diagnosis
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 3: futuristic Loading screen - Checklist steps raised from text-[10px] to text-xs */}
              {isLoading && (
                <div className="p-12 text-center space-y-8 animate-slide-up">
                  <div className="relative h-20 w-20 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 border-2 border-brand-cyan/20 border-t-brand-cyan animate-spin h-20 w-20" />
                    <RefreshCw className="h-10 w-10 text-brand-neon animate-pulse" />
                  </div>
                  
                  <div className="max-w-md mx-auto space-y-4">
                    <h3 className="font-serif text-3.5xl font-bold text-brand-white">
                      Evaluating Neural Paths
                    </h3>
                    
                    <div className="border border-brand-neon/30 bg-brand-bg p-5 text-left space-y-3 font-mono text-xs text-brand-white/80 uppercase shadow-[inset_0_0_15px_rgba(0,255,136,0.05)]">
                      <div className="flex justify-between">
                        <span>[ST-1] Route visual to telemetry core</span>
                        <span className={loadingStep >= 1 ? 'text-brand-neon font-bold' : 'text-brand-cyan/60 animate-pulse'}>
                          {loadingStep >= 1 ? '✓ COMPLETE' : 'PROCESSING...'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>[ST-2] Quantize image dimensions (224x224x3)</span>
                        <span className={loadingStep >= 2 ? 'text-brand-neon font-bold' : loadingStep === 1 ? 'text-brand-cyan/60 animate-pulse' : 'text-brand-white/20'}>
                          {loadingStep >= 2 ? '✓ COMPLETE' : loadingStep === 1 ? 'PROCESSING...' : 'PENDING'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>[ST-3] Forward ensemble passes (ViT + EfficientNet)</span>
                        <span className={loadingStep >= 3 ? 'text-brand-neon font-bold' : loadingStep === 2 ? 'text-brand-cyan/60 animate-pulse' : 'text-brand-white/20'}>
                          {loadingStep >= 3 ? '✓ COMPLETE' : loadingStep === 2 ? 'PROCESSING...' : 'PENDING'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>[ST-4] Calculate activations (Grad-CAM matrix)</span>
                        <span className={loadingStep >= 4 ? 'text-brand-neon font-bold' : loadingStep === 3 ? 'text-brand-cyan/60 animate-pulse' : 'text-brand-white/20'}>
                          {loadingStep >= 4 ? '✓ COMPLETE' : loadingStep === 3 ? 'PROCESSING...' : 'PENDING'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Diagnosis Results Command Center */}
              {diagnosisResult && !isLoading && (
                <div className="space-y-8 animate-slide-up">
                  
                  {/* Results Header */}
                  <div className="border-b border-brand-neon/20 pb-4 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      {/* Raised from text-[9px] to text-xs */}
                      <span className="text-xs font-mono uppercase bg-brand-neon/15 text-brand-neon border border-brand-neon/30 px-2.5 py-1">
                        Diagnostics Complete
                      </span>
                      {/* Raised title from text-3.5xl to text-4xl */}
                      <h3 className="font-serif text-4xl font-bold text-brand-white mt-2">
                        Pathology Identified:{' '}
                        <span className={getTextColorClass(diagnosisResult.prediction)}>
                          {getFriendlyDiagnosisName(diagnosisResult.prediction)}
                        </span>
                      </h3>
                    </div>
                    <button
                      onClick={resetAnalyzer}
                      className="btn-neon btn-neon-secondary flex items-center gap-2 text-xs uppercase"
                    >
                      <RefreshCw className="h-4 w-4" /> Reset Console
                    </button>
                  </div>

                  {/* Centered Leaf Visual */}
                  <div className="max-w-md mx-auto">
                    <div className="space-y-2">
                      {/* Raised label from text-xs to text-sm */}
                      <span className="block text-sm uppercase font-bold tracking-wider text-brand-cyan flex items-center gap-1.5 font-mono justify-center">
                        <Activity className="h-4.5 w-4.5 text-brand-cyan animate-pulse" />
                        Original Visual Telemetry
                      </span>
                      <div className="relative aspect-square border-2 border-brand-cyan bg-brand-bg overflow-hidden p-2 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
                        {previewUrl && (
                          <img
                            src={previewUrl}
                            alt="Original leaf crop"
                            className="w-full h-full object-cover border border-brand-cyan/20"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Diagnosis results calculations */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch pt-4">
                    
                    {/* Metrics Box (md:5) */}
                    <div className="md:col-span-5 border-2 border-brand-neon/40 p-6 bg-brand-gray/50 space-y-6 flex flex-col justify-between shadow-[inset_0_0_20px_rgba(0,255,136,0.05)]">
                      <div className="space-y-4">
                        {/* Raised label from text-[10px] to text-xs */}
                        <span className="text-xs uppercase font-bold tracking-widest text-brand-cyan font-mono">Statistical Certainty</span>
                        <div className="space-y-1.5">
                          {/* Raised label from text-[10px] to text-xs */}
                          <span className="block text-xs text-brand-white/40 uppercase font-mono">Ensemble Confidence</span>
                          <span className={`block font-serif text-5.5xl md:text-6xl font-bold drop-shadow-[0_0_12px_rgba(0,255,136,0.3)] ${getTextColorClass(diagnosisResult.prediction)}`}>
                            {(diagnosisResult.confidence * 100).toFixed(2)}%
                          </span>
                        </div>
                        {/* Raised description text from text-xs to text-sm */}
                        <p className="text-sm text-brand-white/80 leading-relaxed font-light">
                          The hybrid algorithm combining transformer global grids and convolutional local weights isolated the crop condition with a statistical precision boundary of <span className="font-bold text-brand-cyan">{(diagnosisResult.confidence * 100).toFixed(2)}%</span>.
                        </p>
                      </div>

                      {diagnosisResult.explanation_text && (
                        <div className="border-t border-brand-white/10 pt-4 space-y-2">
                          {/* Raised label from text-[9px] to text-xs */}
                          <span className="block text-xs uppercase font-bold text-brand-white/40 font-mono">XAI Feature Isolation Explanation:</span>
                          {/* Raised from text-xs italic to text-sm/text-base */}
                          <p className="text-sm md:text-base italic text-brand-white leading-relaxed font-light bg-brand-bg/85 p-3.5 border border-brand-neon/20 text-brand-neon font-mono">
                            "{diagnosisResult.explanation_text}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Luminous Probabilities Progress Chart (md:7) */}
                    <div className="md:col-span-7 border-2 border-brand-neon p-6 bg-brand-bg space-y-6">
                      {/* Raised label from text-[10px] to text-xs */}
                      <span className="block text-xs uppercase font-bold tracking-widest text-brand-neon font-mono">Ensemble Path Probability Map</span>
                      
                      {/* Raised item labels from text-xs to text-sm */}
                      <div className="space-y-4 pt-2">
                        {Object.entries(diagnosisResult.all_probs).map(([key, val]) => {
                          const percentage = (val * 100).toFixed(2);
                          const isMatch = key === diagnosisResult.prediction;
                          
                          return (
                            <div key={key} className="space-y-1.5">
                              <div className="flex justify-between text-sm font-semibold uppercase font-mono">
                                <span className={isMatch ? getTextColorClass(key) : 'text-brand-white/60'}>
                                  {getFriendlyDiagnosisName(key)} {isMatch && '★'}
                                </span>
                                <span className={isMatch ? `${getTextColorClass(key)} font-bold` : 'text-brand-white/60'}>
                                  {percentage}%
                                </span>
                              </div>
                              <div className="w-full h-3.5 border border-brand-white/10 bg-brand-panel">
                                <div 
                                  className={`h-full transition-all duration-1000 ${
                                    isMatch 
                                      ? getFriendlyColorClass(key) 
                                      : 'bg-brand-gray/60'
                                  }`} 
                                  style={{ 
                                    width: `${percentage}%`,
                                    boxShadow: isMatch ? `0 0 10px ${val > 0.5 ? 'rgba(0, 255, 136, 0.4)' : 'rgba(0, 240, 255, 0.4)'}` : 'none'
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* Botanical advisory Panel - Raised text sizes */}
                  <div className={`border-2 ${getBorderColorClass(diagnosisResult.prediction)} p-6 bg-brand-forest/90 text-brand-white space-y-4 shadow-[0_0_25px_rgba(0,255,136,0.1)]`}>
                    <div className="flex items-center gap-2 border-b border-brand-white/10 pb-3">
                      <ShieldCheck className="h-5 w-5 text-brand-gold animate-bounce" />
                      {/* Raised label from text-xs to text-sm */}
                      <span className="text-sm uppercase font-bold tracking-wider text-brand-gold font-mono">
                        Agronomic Outbreak Mitigation Protocol
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-serif text-2xl font-bold uppercase tracking-wider text-brand-white">
                        Recommended Mitigating Action
                      </h4>
                      {/* Raised from text-xs to text-sm/text-base */}
                      <p className="text-sm md:text-base font-light text-brand-white leading-relaxed">
                        {diseaseIndex.find(d => d.id === diagnosisResult.prediction)?.treatment || 
                         'Maintain standard crop cultivation practices. Execute standard leaf telemetry scanning weekly.'}
                      </p>
                    </div>
                    {/* Raised from text-[9px] to text-xs */}
                    <div className="text-xs uppercase tracking-wider text-brand-white/50 font-mono">
                      Legal telemetry note: Diagnoses represent algorithmic visual calculations. Validate biological markers with pathologists prior to bulk agrochemical applications.
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* 🚀 Section 4: Explainable AI & Technical Architecture */}
      <section className="py-20 bg-brand-panel border-b border-brand-neon/10 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-brand-cyan block">Deep Learning Infrastructure</span>
              <h2 className="font-serif text-4xl font-bold text-brand-white leading-tight">
                Combining Local Convolutions and <br />Global Self-Attention
              </h2>
              {/* Raised from text-sm to text-base */}
              <p className="text-base font-light text-brand-white/80 leading-relaxed">
                Single neural network models present severe limitations. Standard CNNs map micro-textures like rust discoloration but lack global contextual insights. Conversely, Transformer architectures map global context but struggle with localized cell borders due to high computational patch boundaries.
              </p>
              {/* Raised from text-sm to text-base */}
              <p className="text-base font-light text-brand-white/80 leading-relaxed">
                Our hybrid backend ensembles an **EfficientNet-B0 (Weighted 0.6)** and a **ViT-Base (Weighted 0.4)**. This allows the system to aggregate local visual spot detections with global attention maps, yielding diagnostic accuracy above 99%.
              </p>

              {/* Technical Boxes - Raised descriptions from text-[11px] to text-sm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="border border-brand-neon/20 bg-brand-bg p-6 space-y-3 shadow-[0_0_15px_rgba(0,255,136,0.05)]">
                  <div className="border border-brand-neon p-1 bg-brand-neon/10 text-brand-neon w-fit">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-sm uppercase text-brand-white font-mono">EfficientNet CNN Block</h4>
                  <p className="text-sm font-light text-brand-white/60 leading-relaxed">
                    Processes deep separable convolutions across 3x3 scales. Extracts high-resolution texture irregularities, spotting margins, and chlorosis parameters.
                  </p>
                </div>
                
                <div className="border border-brand-cyan/20 bg-brand-bg p-6 space-y-3 shadow-[0_0_15px_rgba(0,240,255,0.05)]">
                  <div className="border border-brand-cyan p-1 bg-brand-cyan/10 text-brand-cyan w-fit">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-sm uppercase text-brand-white font-mono">Vision Transformer (ViT)</h4>
                  <p className="text-sm font-light text-brand-white/60 leading-relaxed">
                    Divides the leaf canvas into 16x16 pixel tokens. Computes multi-headed attention metrics to map long-range color variance and multi-spot anomalies.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Technical Blueprint Box - Raised blueprint steps from text-[10px] to text-xs/text-sm */}
            <div className="lg:col-span-5 relative border-2 border-brand-cyan bg-brand-bg p-6 shadow-[0_0_30px_rgba(0,240,255,0.15)] overflow-hidden">
              <div className="space-y-4 relative z-10">
                <h3 className="font-serif text-xl font-bold border-b border-brand-cyan/20 pb-2 text-brand-cyan uppercase font-mono flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Grad-CAM Feature Extraction
                </h3>
                
                <div className="font-mono text-xs text-brand-white/80 space-y-2.5 leading-relaxed">
                  <p className="border-l-2 border-brand-neon pl-2.5">1. Forward-pass computes raw class score maps.</p>
                  <p className="border-l-2 border-brand-neon pl-2.5">2. Backpropagate gradients to the final convolutional layer.</p>
                  <p className="border-l-2 border-brand-neon pl-2.5">3. Perform spatial pooling of gradient weights across channels.</p>
                  <p className="border-l-2 border-brand-neon pl-2.5">4. Calculate weighted linear combination of feature maps.</p>
                  <p className="border-l-2 border-brand-neon pl-2.5">5. Pass through ReLU to filter negative activations, generating the final heatmap.</p>
                </div>

                <div className="border border-brand-neon/20 p-4 bg-brand-panel text-xs md:text-sm italic text-brand-neon font-mono shadow-[inset_0_0_10px_rgba(0,255,136,0.05)]">
                  "Grad-CAM bridges the black-box gap, visually showing growers exactly which leaf symptoms triggered the classification."
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 📊 Section 5: Real-Time Telemetry Stats Dashboard */}
      <section className="py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-brand-cyan block">Field Telemetry Logger</span>
              <h2 className="font-serif text-4xl font-bold text-brand-white">
                Active Outbreak Map
              </h2>
              {/* Raised from text-sm to text-base */}
              <p className="text-base font-light text-brand-white/70 leading-relaxed">
                Our networks monitor regional diagnosis counts. By aggregating spatial query statistics, we track pathogen vectors and send early warning alerts to agricultural zones.
              </p>
            </div>

            {/* Dashboard Box - Raised stats subtitles from text-[10px]/text-[9px] to text-xs/text-sm */}
            <div className="lg:col-span-7 border border-brand-neon/30 bg-brand-panel p-8 shadow-[0_0_30px_rgba(0,255,136,0.1)]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-brand-white/10">
                
                {/* Stat 1 */}
                <div className="pt-4 sm:pt-0 sm:pr-6 space-y-2">
                  <span className="block text-xs uppercase font-bold text-brand-white/60 font-mono">Weekly Crop Scans</span>
                  <span className="block font-serif text-4.5xl md:text-5xl font-bold text-brand-neon drop-shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                    42,809
                  </span>
                  <span className="block text-xs text-brand-cyan font-bold uppercase tracking-wider">
                    ✓ 12.4% INCREASE
                  </span>
                </div>

                {/* Stat 2 */}
                <div className="pt-4 sm:pt-0 sm:px-6 space-y-2">
                  <span className="block text-xs uppercase font-bold text-brand-white/60 font-mono">Regional Alert</span>
                  <span className="block font-serif text-4.5xl md:text-5xl font-bold text-brand-rust drop-shadow-[0_0_10px_rgba(255,85,51,0.2)]">
                    High Risk
                  </span>
                  <span className="block text-xs text-brand-white/50 uppercase font-mono">
                    Zone: Nuwara Eliya East
                  </span>
                </div>

                {/* Stat 3 */}
                <div className="pt-4 sm:pt-0 sm:pl-6 space-y-2">
                  <span className="block text-xs uppercase font-bold text-brand-white/60 font-mono">Inference Nodes</span>
                  <span className="block font-serif text-4.5xl md:text-5xl font-bold text-brand-white">
                    4 Active
                  </span>
                  <span className="block text-xs text-brand-neon font-bold uppercase tracking-wider">
                    ✓ UPTIME: 99.98%
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ❓ Section 6: FAQ Accordion */}
      <section className="py-20 bg-brand-panel border-t border-brand-neon/10 relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          
          <div className="text-center max-w-xl mx-auto space-y-4">
            <h2 className="font-serif text-4xl font-bold text-brand-white">
              Frequently Answered Queries
            </h2>
            {/* Raised from text-sm to text-base */}
            <p className="text-base font-light text-brand-white/60">
              Clear technical responses regarding our diagnostics pipelines, models, and data security.
            </p>
          </div>

          <div className="divide-y divide-brand-white/10 border-y border-brand-white/10">
            
            {/* FAQ 1 - Raised question to text-base, answer to text-sm */}
            <div className="py-6 space-y-2.5">
              <h4 className="font-bold text-base text-brand-neon uppercase tracking-wider flex items-center gap-2 font-mono">
                <HelpCircle className="h-5 w-5 text-brand-cyan shrink-0" />
                What is the diagnostic accuracy threshold of the ensembled networks?
              </h4>
              <p className="text-sm font-light text-brand-white/70 leading-relaxed">
                In strict agricultural validation testing splits, the EfficientNet-B0 network scores **99.93% accuracy**, and the Vision Transformer scores **95.03%**. Combining both as an ensembled weighted system guarantees stable visual classifications, resisting overlapping textures or debris.
              </p>
            </div>

            {/* FAQ 2 - Raised question to text-base, answer to text-sm */}
            <div className="py-6 space-y-2.5">
              <h4 className="font-bold text-base text-brand-neon uppercase tracking-wider flex items-center gap-2 font-mono">
                <HelpCircle className="h-5 w-5 text-brand-cyan shrink-0" />
                Do I need macro hardware or lens extensions to scan crops?
              </h4>
              <p className="text-sm font-light text-brand-white/70 leading-relaxed">
                No. High-resolution smartphone cameras are fully compatible. Ensure the leaf is centered, lies flat, is illuminated by clean daylight, and that the lens macro-focus resolves leaf veins clearly.
              </p>
            </div>

            {/* FAQ 3 - Raised question to text-base, answer to text-sm */}
            <div className="py-6 space-y-2.5">
              <h4 className="font-bold text-base text-brand-neon uppercase tracking-wider flex items-center gap-2 font-mono">
                <HelpCircle className="h-5 w-5 text-brand-cyan shrink-0" />
                How secure are estate imagery uploads in your system directories?
              </h4>
              <p className="text-sm font-light text-brand-white/70 leading-relaxed">
                Leaf images are sandboxed under randomized UUID hashes. Images are secure and never sold or shared. In full compliance with our Privacy Policy, uploads are automatically purged weekly.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
