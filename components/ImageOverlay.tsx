import React from 'react';
import { VisionDetectionResult } from '../types';

interface ImageOverlayProps {
    imageSrc: string;
    result: VisionDetectionResult;
}

const ImageOverlay: React.FC<ImageOverlayProps> = ({ imageSrc, result }) => {
    return (
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900">
            <img src={imageSrc} alt="Analyzed" className="w-full h-auto block opacity-80" />

            {result.blocks.map((block, idx) => {
                const [ymin, xmin, ymax, xmax] = block.box_2d;

                // Convert normalized coordinates (0-1000) to percentages
                const top = (ymin / 1000) * 100;
                const left = (xmin / 1000) * 100;
                const height = ((ymax - ymin) / 1000) * 100;
                const width = ((xmax - xmin) / 1000) * 100;

                return (
                    <div
                        key={idx}
                        className="absolute flex items-center justify-center pointer-events-none group"
                        style={{
                            top: `${top}%`,
                            left: `${left}%`,
                            width: `${width}%`,
                            height: `${height}%`,
                        }}
                    >
                        {/* Bounding Box Border */}
                        <div className="absolute inset-0 border-2 border-indigo-400/50 rounded-sm bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-all"></div>

                        {/* Translated Text Overlay (Lens Style) */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 min-w-max bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-lg border border-white/50 text-xs font-bold text-slate-900 z-10 transform scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
                            <span className="text-indigo-600 mr-1.5">{block.language}</span>
                            {block.translatedText}
                        </div>
                    </div>
                );
            })}

            {/* Global Summary Badge */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white">
                <h4 className="text-sm font-bold text-indigo-300 mb-1">{result.detectedLanguage} ({(result.overallConfidence * 100).toFixed(0)}%)</h4>
                <p className="text-xs text-slate-200">{result.summary}</p>
            </div>
        </div>
    );
};

export default ImageOverlay;
