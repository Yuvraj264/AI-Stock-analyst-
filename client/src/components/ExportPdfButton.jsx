import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Download, RefreshCw } from 'lucide-react';
import { PdfReportTemplate } from './PdfReportTemplate.jsx';

/**
 * ExportPdfButton Component.
 * Formulates a professional multi-page institutional investor report directly from
 * structured analysis data using a clean white theme and custom SVG data representations.
 */
export const ExportPdfButton = ({ analysis, fileName = 'research-report' }) => {
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleExport = async () => {
    if (!analysis) {
      alert('Error: No analysis data found to generate report.');
      return;
    }

    setExporting(true);
    setExportStatus('Initializing...');

    try {
      console.log(`[PDF Export] Initiating institutional PDF generation for: ${analysis.ticker}...`);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const totalPages = 6;

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        setExportStatus(`Compiling Page ${pageNum}/${totalPages}...`);
        
        const pageElement = document.getElementById(`pdf-page-${pageNum}`);
        if (!pageElement) {
          throw new Error(`DOM node for page ${pageNum} not resolved.`);
        }

        console.log(`[PDF Export] Capturing Page ${pageNum} using html2canvas...`);
        
        // High density print settings
        const canvas = await html2canvas(pageElement, {
          scale: 2.5, // High-res export
          useCORS: true,
          logging: false,
          backgroundColor: '#FFFFFF',
          windowWidth: 794,
          windowHeight: 1122
        });

        const imgData = canvas.toDataURL('image/png');
        
        if (pageNum > 1) {
          pdf.addPage();
        }

        // Render precisely to A4 dimensions (210mm x 297mm)
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, '', 'FAST');
      }

      setExportStatus('Saving PDF...');
      console.log(`[PDF Export] Saving document: ${fileName}.pdf`);
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('[PDF Export Error] Compilation pipeline crashed:', error);
      alert('Operational failure: Institutional PDF compilation failed.');
    } finally {
      setExporting(false);
      setExportStatus('');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleExport}
        disabled={exporting}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-[#1F2937] bg-[#111827] text-[10px] font-mono font-bold uppercase tracking-wider text-[#9CA3AF] hover:text-[#00D4AA] hover:border-[#00D4AA] hover:bg-[#0A0E17] transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        title="Export institutional PDF report"
      >
        {exporting ? (
          <>
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#00D4AA]" />
            <span>{exportStatus}</span>
          </>
        ) : (
          <>
            <Download className="h-3.5 w-3.5 text-[#00D4AA]" />
            <span>Export PDF</span>
          </>
        )}
      </button>

      {/* Hidden PDF template rendered into standard DOM for snapshotting, portalled to body to escape parent data-html2canvas-ignore */}
      {analysis && createPortal(
        <PdfReportTemplate analysis={analysis} dateString={formattedDate} />,
        document.body
      )}
    </>
  );
};

export default ExportPdfButton;
