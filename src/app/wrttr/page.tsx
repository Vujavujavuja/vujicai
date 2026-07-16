import { Library } from '@/components/wrttr/library';

export const metadata = {
  title: 'wrttr',
  robots: { index: false, follow: false },
};

export default function WrttrPage() {
  return <Library />;
}
