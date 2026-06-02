import { ErrorBoundary } from '@/components/ui/error-boundary';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
