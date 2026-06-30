import { QrCard } from '@/components/ui/qr-card';

export const metadata = {
  title: 'Nemanja Vujic',
  // Hidden landing reached only by typing the URL (e.g. via QR code) —
  // keep it out of search results.
  robots: { index: false, follow: false },
};

export default function QrPage() {
  return <QrCard />;
}
