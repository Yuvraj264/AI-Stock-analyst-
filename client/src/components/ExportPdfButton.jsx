import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, RefreshCw } from 'lucide-react';

/**
 * ExportPdfButton Component.
 * Takes a target DOM element ID, snapshots it using html2canvas,
 * and compiles it into a high-res multipage A4 PDF document using jsPDF.
 */
export const ExportPdfButton = ({ elementId, fileName = 'research-report' }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`[PDF Export] Element with ID "${elementId}" not found in DOM.`);
      alert('Error: Export target element not resolved.');
      return;
    }

    setExporting(true);

    try {
      console.log(`[PDF Export] Capturing element "${elementId}" using html2canvas...`);
      
      // Temporarily add a printing class or styles to ensure clean layouts
      const canvas = await html2canvas(element, {
        scale: 2, // 2x resolution for printing sharpness
        useCORS: true,
        logging: false,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#f8fafc' // Sync with theme bg
      });

      console.log(`[PDF Export] Compiling jsPDF multi-page document...`);
      const imgData = canvas.toDataURL('image/png');
      
      // jsPDF setup (A4 standard: 210mm x 297mm)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295; // Slightly less than 297 to leave margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Render first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
      heightLeft -= pageHeight;

      // Handle multi-page offsets
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= pageHeight;
      }

      console.log(`[PDF Export] Export successful. Downloading file: "${fileName}.pdf"`);
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('[PDF Export Error] Failed to generate PDF document:', error);
      alert('Operational failure: PDF compile failed.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={exporting}
      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-white transition-colors duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed shadow-sm"
      title="Export analysis to PDF report"
    >
      {exporting ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin text-emerald-500" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4 text-emerald-500" />
          <span>Export PDF</span>
        </>
      )}
    </button>
  );
};

export default ExportPdfButton;
