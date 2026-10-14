import type { ReactNode } from 'react';
import { TripWireTimeline } from './trip-wire-timeline';

// Components a post can drop inline with a `{{embed:name}}` line in its markdown.
export const EMBEDS: Record<string, () => ReactNode> = {
  'trip-wire-timeline': () => <TripWireTimeline />,
};

const MARKER = /<p>\{\{embed:([\w-]+)\}\}<\/p>/g;

/** Renders post HTML, swapping embed markers for their components. */
export function PostBody({ html, className }: { html: string; className?: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  MARKER.lastIndex = 0;
  while ((m = MARKER.exec(html)) !== null) {
    if (m.index > last) {
      parts.push(<div key={`h${last}`} dangerouslySetInnerHTML={{ __html: html.slice(last, m.index) }} />);
    }
    const render = EMBEDS[m[1]];
    if (render) parts.push(<div key={`e${m.index}`}>{render()}</div>);
    last = m.index + m[0].length;
  }
  if (last < html.length) {
    parts.push(<div key={`h${last}`} dangerouslySetInnerHTML={{ __html: html.slice(last) }} />);
  }
  return <div className={className}>{parts}</div>;
}
