import fs from 'fs';
import path from 'path';
import { PlaygroundProject } from '@/types';

export function getAllProjects(): PlaygroundProject[] {
  const raw = fs.readFileSync(
    path.join(process.cwd(), 'content', 'playground', 'metadata.json'),
    'utf-8'
  );
  return JSON.parse(raw);
}
