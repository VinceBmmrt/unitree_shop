import type { Metadata } from 'next';
import { HeroSection } from '@/components/layout/hero-section';
import { TrustBadges } from '@/components/layout/trust-badges';
import { UseCases } from '@/components/layout/use-cases';
import { SpecsComparison } from '@/components/product/specs-comparison';
import { EnterpriseSection } from '@/components/layout/enterprise-section';

export const metadata: Metadata = {
  title: 'Unitree Robotics — Advanced Humanoid Robots',
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustBadges />
      <UseCases />
      <SpecsComparison />
      <EnterpriseSection />
    </main>
  );
}
