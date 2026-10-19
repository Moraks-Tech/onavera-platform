"use client";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-sm"
    >
      Print / Download PDF
    </button>
  );
}