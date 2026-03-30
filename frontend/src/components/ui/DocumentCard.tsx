import { FileText, Download } from 'lucide-react';

interface DocumentCardProps {
  title: string;
  date: string;
  format: string;
  fileSize?: string;
  downloadUrl: string;
  previewUrl?: string;
  category?: string;
}

export function DocumentCard({
  title,
  date,
  format,
  fileSize,
  downloadUrl,
  category,
}: DocumentCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-card border border-silver bg-white p-4 transition-all duration-300 ease-standard hover:shadow-card-hover hover:-translate-y-0.5">
      <div className="flex-shrink-0 rounded-lg bg-ice p-3">
        <FileText size={24} className="text-royal" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-charcoal truncate">{title}</h3>
        <div className="mt-1 flex items-center gap-3 text-sm text-cool-gray">
          <span>{date}</span>
          <span className="inline-flex items-center rounded-full bg-ice px-2 py-0.5 text-xs font-medium text-royal">
            {format}
          </span>
          {fileSize && <span>{fileSize}</span>}
          {category && <span>{category}</span>}
        </div>
      </div>
      <a
        href={downloadUrl}
        download
        className="flex-shrink-0 rounded-lg p-2 text-royal hover:bg-ice transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
        aria-label={`Скачать ${title}`}
      >
        <Download size={20} strokeWidth={1.5} aria-hidden="true" />
      </a>
    </div>
  );
}
