import { jsPDF } from 'jspdf';

export const exportChatToPDF = (roomName, messages = []) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, pageWidth, 26, 'F');

  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('VCLT - Meeting Chat Transcript', 14, 16);

  // Subheader
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.setFont('Helvetica', 'normal');
  doc.text(`Room: ${roomName}  |  Generated: ${new Date().toLocaleString()}`, 14, 34);

  doc.setDrawColor(220, 220, 220);
  doc.line(14, 38, pageWidth - 14, 38);

  let y = 46;
  if (!messages || messages.length === 0) {
    doc.text('No chat messages recorded during this meeting.', 14, y);
  } else {
    messages.forEach((msg) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(79, 70, 229);
      doc.text(`${msg.sender || 'Participant'} (${msg.time || ''}):`, 14, y);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      const splitText = doc.splitTextToSize(msg.text || '', pageWidth - 28);
      doc.text(splitText, 14, y + 5);

      y += 8 + splitText.length * 5;
    });
  }

  doc.save(`VCLT_Chat_${roomName}_${Date.now()}.pdf`);
};

export const exportNotesToPDF = (roomName, notes = []) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, pageWidth, 26, 'F');

  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('VCLT - Translated Meeting Notes & Minutes', 14, 16);

  // Subheader
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.setFont('Helvetica', 'normal');
  doc.text(`Room: ${roomName}  |  Generated: ${new Date().toLocaleString()}`, 14, 34);

  doc.setDrawColor(220, 220, 220);
  doc.line(14, 38, pageWidth - 14, 38);

  let y = 46;
  if (!notes || notes.length === 0) {
    doc.text('No meeting notes recorded during this session.', 14, y);
  } else {
    notes.forEach((note) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(5, 150, 105);
      doc.text(`[${note.time || ''}] ${note.speaker || 'Speaker'}:`, 14, y);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      const splitText = doc.splitTextToSize(note.text || '', pageWidth - 28);
      doc.text(splitText, 14, y + 5);

      if (note.original && note.original !== note.text) {
        doc.setFont('Helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        const originalSplit = doc.splitTextToSize(`(Original: ${note.original})`, pageWidth - 28);
        doc.text(originalSplit, 14, y + 7 + splitText.length * 5);
        y += 12 + (splitText.length + originalSplit.length) * 5;
      } else {
        y += 9 + splitText.length * 5;
      }
    });
  }

  doc.save(`VCLT_Meeting_Notes_${roomName}_${Date.now()}.pdf`);
};
