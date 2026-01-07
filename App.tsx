
import React, { useState, useCallback } from 'react';
import { detectLanguage, detectFromImage } from './services/geminiService';
import { DetectionResult, HistoryItem, VisionDetectionResult } from './types';
import DetectionView from './components/DetectionView';
import TranslationView from './components/TranslationView';
import ImageUpload from './components/ImageUpload';
import ImageOverlay from './components/ImageOverlay';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'vision'>('text');
  const [inputText, setInputText] = useState('');
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Vision State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visionResult, setVisionResult] = useState<VisionDetectionResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleDetect = async () => {
    if (activeTab === 'text') {
      if (!inputText.trim()) return;
      setLoading(true);
      setError(null);
      try {
        const result = await detectLanguage(inputText);
        setDetectionResult(result);

        const newHistoryItem: HistoryItem = {
          id: Math.random().toString(36).substr(2, 9),
          text: inputText,
          result: result,
          timestamp: Date.now()
        };
        setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
      } catch (error) {
        console.error("Detection error:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    } else {
      if (!selectedImage) return;
      setLoading(true);
      try {
        const result = await detectFromImage(selectedImage);
        setVisionResult(result);
      } catch (error) {
        console.error("Vision detection error:", error);
        setError(error instanceof Error ? error.message : "Vision analysis failed. Check your API Key.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClear = () => {
    setInputText('');
    setDetectionResult(null);
    setSelectedImage(null);
    setVisionResult(null);
    setError(null);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setInputText(item.text);
    setDetectionResult(item.result);
    setError(null);
    setActiveTab('text');
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-6 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21l-8-4.5v-9L12 3m0 18l8-4.5v-9L12 3m0 18V3"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">LinguistAI</h1>
              <p className="text-xs text-slate-500 font-medium">Smart Language Intelligence</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${activeTab === 'text' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'hover:text-indigo-600'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              Text Analysis
            </button>
            <button
              onClick={() => setActiveTab('vision')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${activeTab === 'vision' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'hover:text-indigo-600'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Vision Lens
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-8 max-w-6xl">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="font-medium">{error}</p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Input Section */}
          <div className="lg:col-span-7 space-y-6">
            {activeTab === 'text' ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500 uppercase tracking-tight">Input Text</span>
                  <button
                    onClick={handleClear}
                    className="text-slate-400 hover:text-rose-500 transition-colors text-xs font-bold flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    Clear
                  </button>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your text here to identify the language..."
                  className="w-full h-48 p-6 text-lg text-slate-800 focus:outline-none resize-none placeholder:text-slate-300"
                />
                <div className="p-4 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {inputText.length} characters
                  </div>
                  <button
                    onClick={handleDetect}
                    disabled={loading || !inputText.trim()}
                    className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                  >
                    {loading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    )}
                    {loading ? 'Analyzing...' : 'Identify Language'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <ImageUpload
                  selectedImage={selectedImage}
                  onImageSelect={setSelectedImage}
                  onClear={handleClear}
                />
                {!visionResult && selectedImage && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleDetect}
                      disabled={loading}
                      className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                    >
                      {loading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      )}
                      {loading ? 'Scanning...' : 'Scan Image'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {detectionResult && activeTab === 'text' && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <DetectionView result={detectionResult} />
              </div>
            )}

            {visionResult && activeTab === 'vision' && selectedImage && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <ImageOverlay imageSrc={selectedImage} result={visionResult} />
              </div>
            )}
          </div>

          {/* Sidebar / Tools */}
          {/* Sidebar / Tools */}
          <div className="lg:col-span-5 space-y-6">
            {activeTab === 'text' ? (
              detectionResult ? (
                <TranslationView sourceText={inputText} />
              ) : (
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                  </div>
                  <h3 className="text-2xl font-bold">Waiting for input</h3>
                  <p className="text-indigo-100 font-medium leading-relaxed">
                    Enter any text on the left to unlock advanced linguistic analysis and translation tools.
                  </p>
                </div>
              )
            ) : (
              visionResult ? (
                <div className="animate-in fade-in slide-in-from-right duration-500">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-4">
                    <h4 className="font-bold text-slate-800 mb-2">Detected Text Blocks</h4>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {visionResult.blocks.map((block, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-lg text-sm">
                          <p className="font-medium text-slate-700 mb-1">{block.text}</p>
                          <p className="text-indigo-600 italic">➡ {block.translatedText}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <h3 className="text-2xl font-bold">Vision Mode</h3>
                  <p className="text-emerald-100 font-medium leading-relaxed">
                    Upload an image to detect text, signs, or menus in the wild. We'll translate it for you instantly.
                  </p>
                </div>
              )
            )}

            {history.length > 0 && activeTab === 'text' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Detections</h3>
                <div className="space-y-3">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="w-full p-4 rounded-xl border border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all text-left group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {item.result.detectedLanguage}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 italic">"{item.text}"</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Stats / Footer Feature Section */}
      <section className="container mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Universal Detection", desc: "Recognizes over 100 languages and variations instantly.", icon: "🌍" },
            { title: "Dialect Identification", desc: "Differentiates between regional variants like Mexican vs Spain Spanish.", icon: "📍" },
            { title: "Confidence Scores", desc: "Probability analysis using state-of-the-art Gemini 3 intelligence.", icon: "📈" }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
              <span className="text-3xl">{feature.icon}</span>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">{feature.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default App;
