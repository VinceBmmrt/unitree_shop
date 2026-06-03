'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ChevronDown } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

const CONSENT_KEY = 'unitree_cookie_consent';
const BANNER_VERSION = '1.0';

interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  version: string;
  recordedAt: string;
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [sessionId] = useState(() =>
    typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).slice(2),
  );

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      const consent: ConsentState = JSON.parse(stored);
      // Re-show if banner version changed
      if (consent.version === BANNER_VERSION) return;
    }
    // Slight delay — don't block initial render
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  async function recordConsent(analyticsChoice: boolean, marketingChoice: boolean) {
    const consent: ConsentState = {
      analytics: analyticsChoice,
      marketing: marketingChoice,
      version: BANNER_VERSION,
      recordedAt: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    setVisible(false);

    // Record server-side (non-blocking)
    apiClient
      .post('/gdpr/consent', {
        analytics: analyticsChoice,
        marketing: marketingChoice,
        sessionId,
      })
      .catch(() => {}); // consent store failure must not affect UX
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 250 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50"
        >
          <div className="glass rounded-2xl p-5 shadow-2xl border border-border/60">
            <div className="flex items-start gap-3 mb-4">
              <Cookie className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">Vos préférences cookies</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez choisir
                  lesquels accepter (RGPD).
                </p>
              </div>
              <button
                onClick={() => setVisible(false)}
                className="p-1 rounded hover:bg-muted transition-colors"
                aria-label="Fermer sans choisir"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>

            {/* Expandable options */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-4"
                >
                  <div className="space-y-2 pt-2 pb-3 border-t border-border">
                    <ToggleRow
                      label="Cookies essentiels"
                      description="Authentification, panier, sécurité. Ne peuvent pas être refusés."
                      checked={true}
                      disabled
                      onChange={() => {}}
                    />
                    <ToggleRow
                      label="Cookies analytiques"
                      description="Mesure d'audience anonymisée (ex: Plausible)."
                      checked={analytics}
                      onChange={setAnalytics}
                    />
                    <ToggleRow
                      label="Cookies marketing"
                      description="Publicités personnalisées sur d'autres sites."
                      checked={marketing}
                      onChange={setMarketing}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => recordConsent(true, true)}
                  className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  Tout accepter
                </button>
                <button
                  onClick={() => recordConsent(false, false)}
                  className="flex-1 py-2 rounded-lg border border-border text-xs hover:bg-muted/50 transition-colors"
                >
                  Refuser
                </button>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Personnaliser
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
                  />
                </button>
                {expanded && (
                  <button
                    onClick={() => recordConsent(analytics, marketing)}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Enregistrer mes choix
                  </button>
                )}
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground/60 mt-3">
              <a href="/privacy" className="hover:underline">
                Politique de confidentialité
              </a>
              {' · '}
              <a href="/mentions-legales" className="hover:underline">
                Mentions légales
              </a>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`mt-0.5 w-8 h-4.5 rounded-full transition-colors flex-shrink-0 relative ${
          checked ? 'bg-primary' : 'bg-muted'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-3.5' : 'translate-x-0'
          }`}
        />
      </button>
      <div>
        <p className="text-xs font-medium">{label}</p>
        <p className="text-[10px] text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
