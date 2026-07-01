import { PlaygroundContent } from '@/components/ui/playground-content';
import { sharePreview } from '@/lib/seo';

const DESC =
  'Projects and experiments by Nemanja Vujić — AI tools, MCP servers, and side projects.';

export const metadata = {
  title: 'Playground',
  description: DESC,
  ...sharePreview('Playground · Nemanja Vujić', DESC),
};

export default function PlaygroundPage() {
  return <PlaygroundContent />;
}
