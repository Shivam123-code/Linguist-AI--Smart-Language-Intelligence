
import React, { useState } from 'react';
import { TranslationResult } from '../types';
import { translateText } from '../services/geminiService';

interface TranslationViewProps {
  sourceText: string;
}

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Chinese (Simplified)", 
  "Japanese", "Korean", "Russian", "Arabic", "Portuguese", 
  "Italian", "Hindi", "Dutch", "Turkish", "Vietnamese"
];

const TranslationView: React.FC<TranslationViewProps> = ({ sourceText }) => {
  const [targetLang, setTargetLang] = useState('English');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText) return;
    setLoading(true);
    try {
      const translation = await translateText(sourceText, targetLang);
      setResult(translation);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-slate-900">Translation</h3>
        <select 
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
        >
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleTranslate}
        disabled={loading || !sourceText}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
        )}
        {loading ? 'Translating...' : 'Translate'}
      </button>

      {result && (
        <div className="mt-6 p-5 bg-indigo-50/50 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">Result ({result.targetLanguage})</span>
            <button 
              onClick={() => navigator.clipboard.writeText(result.translatedText)}
              className="text-indigo-400 hover:text-indigo-600 transition-colors"
              title="Copy to clipboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
            </button>
          </div>
          <p className="text-slate-800 text-lg leading-relaxed">{result.translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default TranslationView;
