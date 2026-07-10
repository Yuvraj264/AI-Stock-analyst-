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
      
      // Captured canvas forced to terminal theme background color #0A0E17
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#0A0E17'
      });

      console.log(`[PDF Export] Compiling jsPDF multi-page document...`);
      const imgData = canvas.toDataURL('image/png');
      
      // jsPDF setup (A4 standard: 210mm x 297mm)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
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
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-[#1F2937] bg-[#111827] text-[10px] font-mono font-bold uppercase tracking-wider text-[#9CA3AF] hover:text-[#00D4AA] hover:border-[#00D4AA] hover:bg-[#0A0E17] transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      title="Export analysis to PDF report"
    >
      {exporting ? (
        <>
          <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#00D4AA]" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="h-3.5 w-3.5 text-[#00D4AA]" />
          <span>Export PDF</span>
        </>
      )}
    </button>
  );
};

export default ExportPdfButton;
