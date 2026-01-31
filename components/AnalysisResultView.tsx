
import React from 'react';
import { AnalysisResult, DiagnosticMode } from '../types';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  image: string;
  mode: DiagnosticMode;
  onReset: () => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ result, image, mode, onReset }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 sticky top-4">
            <img src={image} alt="Analyzed specimen" className="w-full h-auto object-cover" />
            <div className={`p-4 text-center font-bold text-white ${result.isHealthy ? 'bg-green-500' : 'bg-red-500'}`}>
              {result.isHealthy ? 'Specimen Looks Healthy' : 'Potential Disease Detected'}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{result.diseaseName}</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {result.confidence} Confidence
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-orange-50 p-4 rounded-xl">
                <h3 className="text-orange-800 font-bold mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Identified Symptoms
                </h3>
                <ul className="list-disc list-inside text-orange-700 space-y-1">
                  {result.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-xl">
                <h3 className="text-green-800 font-bold mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  Prevention Strategy
                </h3>
                <p className="text-green-700 leading-relaxed">{result.prevention}</p>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded-xl">
              <h3 className="text-blue-800 font-bold mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                Treatment Plan
              </h3>
              <p className="text-blue-700 leading-relaxed whitespace-pre-wrap">{result.treatment}</p>
            </div>

            {result.groundingLinks && result.groundingLinks.length > 0 && (
              <div className="mt-6">
                <h3 className="text-gray-700 font-bold mb-3 text-sm uppercase tracking-wider">Expert Resources & Sources</h3>
                <div className="flex flex-wrap gap-2">
                  {result.groundingLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-blue-600 transition"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={onReset}
              className="flex items-center px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition shadow-lg active:scale-95"
            >
              Start New Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
