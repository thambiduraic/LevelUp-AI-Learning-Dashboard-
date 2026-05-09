import { LoadingScreen } from '@/components/layout/LoadingScreen';

export default function Loading() {
  // Use non-full-screen loader so sidebar remains visible
  return <LoadingScreen fullScreen={false} />;
}

