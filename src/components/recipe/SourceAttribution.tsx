import { ExternalLink } from 'lucide-react';

interface SourceAttributionProps {
  sourceUrl: string;
  sourceName: string | null;
  sourceDomain: string;
}

export function SourceAttribution({
  sourceUrl,
  sourceName,
  sourceDomain,
}: SourceAttributionProps) {
  return (
    <div className="flex items-center gap-2 p-4 rounded-xl bg-neutral-100 border border-neutral-200">
      <span className="text-sm text-neutral-600">
        Recipe from{' '}
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary-600 hover:text-primary-700 hover:underline inline-flex items-center gap-1"
        >
          {sourceName || sourceDomain}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </span>
    </div>
  );
}
