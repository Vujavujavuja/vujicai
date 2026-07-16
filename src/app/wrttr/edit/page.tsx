import { Editor } from '@/components/wrttr/editor';

export const metadata = {
  title: 'edit · wrttr',
  robots: { index: false, follow: false },
};

export default function EditPage() {
  return <Editor />;
}
