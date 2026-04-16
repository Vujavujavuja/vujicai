import fs from 'fs';
import path from 'path';
import { Accomplishment } from '@/types';

export function getAllAccomplishments(): Accomplishment[] {
  const raw = fs.readFileSync(
    path.join(process.cwd(), 'content', 'accomplishments', 'metadata.json'),
    'utf-8'
  );
  return JSON.parse(raw);
}
