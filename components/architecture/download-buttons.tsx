'use client';

import { Button } from '@/components/ui/button';
import type { ArchitecturePlan } from '@/types';
import { PDFDocument, StandardFonts } from 'pdf-lib';

export type DownloadButtonsProps = {
  plan?: ArchitecturePlan;
};

async function generatePdf(plan: ArchitecturePlan) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const lineHeight = fontSize + 4;
  let y = 760;

  const writeLine = (text: string) => {
    if (y <= 40) {
      y = 760;
      pdfDoc.addPage([612, 792]);
    }
    const currentPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
    currentPage.drawText(text, {
      x: 32,
      y,
      size: fontSize,
      font,
    });
    y -= lineHeight;
  };

  writeLine(`Architecture Plan — ${plan.projectName}`);
  writeLine('');
  writeLine('Summary:');
  plan.summary.split('\n').forEach(writeLine);
  writeLine('');
  writeLine('Architecture:');
  plan.architecture.split('\n').forEach(writeLine);
  writeLine('');
  writeLine('Decisions:');
  plan.decisions.forEach((decision, index) => writeLine(`${index + 1}. ${decision}`));
  writeLine('');
  writeLine('Risks & Mitigation:');
  plan.risks.forEach((risk, index) => writeLine(`${index + 1}. ${risk}`));
  plan.mitigation.forEach((mitigation, index) => writeLine(`Mitigation ${index + 1}: ${mitigation}`));
  writeLine('');
  writeLine('Verification Checklist:');
  plan.verificationChecklist.forEach((item, index) => writeLine(`${index + 1}. ${item}`));
  writeLine('');
  writeLine('Acceptance Criteria:');
  plan.acceptanceCriteria.forEach((item, index) => writeLine(`${index + 1}. ${item}`));

  const bytes = await pdfDoc.save();
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${plan.projectName.toLowerCase().replace(/\s+/g, '-')}-architecture.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function downloadJson(plan: ArchitecturePlan) {
  const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${plan.projectName.toLowerCase().replace(/\s+/g, '-')}-architecture.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function DownloadButtons({ plan }: DownloadButtonsProps) {
  if (!plan) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button type="button" variant="secondary" onClick={() => downloadJson(plan)}>
        Download JSON
      </Button>
      <Button type="button" onClick={() => generatePdf(plan)}>
        Download PDF
      </Button>
    </div>
  );
}
