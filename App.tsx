
import React, { useState, useRef, useEffect } from 'react';
import { DiagnosticMode, AnalysisResult, HistoryItem } from './types';
import { analyzeImage } from './services/geminiService';
import { CameraView } from './components/CameraView';
import { AnalysisResultView } from './components/AnalysisResultView';
import { HelpModal } from './components/HelpModal';

const App: React.FC = () => {
  const [mode, setMode] = useState<DiagnosticMode>(DiagnosticMode.LEAF);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<{ image: string; result: AnalysisResult } | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('agro_shield_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  const saveToHistory = (image: string, result: AnalysisResult) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      mode,
      image,
      result
    };
    const updatedHistory = [newItem, ...history].slice(0, 10); // Keep last 10
    setHistory(updatedHistory);
    localStorage.setItem('agro_shield_history', JSON.stringify(updatedHistory));
  };

  const handleAnalysis = async (imageData: string) => {
    setIsAnalyzing(true);
    setError(null);
    setIsCameraOpen(false);
    
    try {
      const result = await analyzeImage(imageData, mode);
      setCurrentAnalysis({ image: imageData, result });
      saveToHistory(imageData, result);
    } catch (err) {
      setError("Diagnosis failed. The image might be too blurry or the server is busy. Please try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleAnalysis(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-green-100 selection:text-green-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white shadow-green-200 shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900 hidden sm:inline">AgroShield AI</span>
            <button 
              onClick={() => setIsHelpOpen(true)}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition"
              title="How to use"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </button>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => { setMode(DiagnosticMode.LEAF); setCurrentAnalysis(null); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${mode === DiagnosticMode.LEAF ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Plant
            </button>
            <button
              onClick={() => { setMode(DiagnosticMode.CHICKEN); setCurrentAnalysis(null); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${mode === DiagnosticMode.CHICKEN ? 'bg-white text-orange-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Poultry
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!currentAnalysis ? (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                Instantly diagnose <span className={mode === DiagnosticMode.LEAF ? 'text-green-600' : 'text-orange-600'}>
                  {mode === DiagnosticMode.LEAF ? 'crop diseases' : 'poultry health'}
                </span>
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Professional-grade agricultural AI at your fingertips. Detect issues early and get treatment plans immediately.
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <button
                onClick={() => setIsCameraOpen(true)}
                className="group relative h-64 bg-white border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center hover:border-green-500 hover:bg-green-50/50 transition-all shadow-sm"
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-1">Live Camera Capture</h3>
                <p className="text-gray-500 text-sm">Best for real-time diagnostics in the field</p>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="group relative h-64 bg-white border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50/50 transition-all shadow-sm"
              >
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-1">Upload Photo</h3>
                <p className="text-gray-500 text-sm">Upload high-res images for deep analysis</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </button>
            </div>

            {/* History Section */}
            {history.length > 0 && (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Recent Assessments
                  </h2>
                  <button onClick={() => { localStorage.removeItem('agro_shield_history'); setHistory([]); }} className="text-xs text-gray-400 hover:text-red-500 transition">Clear History</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentAnalysis({ image: item.image, result: item.result })}
                      className="group text-left"
                    >
                      <div className="aspect-square rounded-2xl overflow-hidden mb-2 shadow-sm border border-gray-100 group-hover:ring-2 group-hover:ring-green-500 transition-all">
                        <img src={item.image} alt="History item" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs font-bold truncate text-gray-800">{item.result.diseaseName}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{item.mode} • {new Date(item.timestamp).toLocaleDateString()}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <AnalysisResultView
            result={currentAnalysis.result}
            image={currentAnalysis.image}
            mode={mode}
            onReset={() => setCurrentAnalysis(null)}
          />
        )}
      </main>

      {/* Analysis Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-8 text-center">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Analyzing Specimen...</h2>
          <p className="text-gray-600 max-w-xs">Scanning for pathogenic signatures and visual symptoms using Gemini AI...</p>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8">
          <div className="bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-4 max-w-md">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <p className="text-sm font-bold leading-tight">{error}</p>
            <button onClick={() => setError(null)} className="text-white/80 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      {isCameraOpen && (
        <CameraView
          onCapture={handleAnalysis}
          onClose={() => setIsCameraOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center items-center space-x-2 grayscale opacity-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            <span className="font-bold uppercase tracking-widest text-xs">Biosecurity Protected</span>
          </div>
          <p className="text-sm text-gray-400">© 2024 AgroShield AI. Powered by Google Gemini. For advisory purposes only.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
