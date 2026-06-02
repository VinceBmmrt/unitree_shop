'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Trash2, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

export default function DonneesPage() {
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteRequested, setDeleteRequested] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const res = await apiClient.get('/gdpr/export');
      const data = res.data.data ?? res.data;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `unitree-mes-donnees-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erreur lors de l'export. Veuillez réessayer.");
    } finally {
      setExporting(false);
    }
  }

  async function handleDeleteRequest() {
    setDeleting(true);
    try {
      await apiClient.delete('/gdpr/me', { data: { reason: deleteReason || undefined } });
      setDeleteRequested(true);
      setShowDeleteConfirm(false);
    } catch {
      alert('Erreur lors de la demande. Veuillez réessayer.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/compte"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Mon compte
        </Link>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-foreground">Mes données personnelles</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Conformément au RGPD (Règlement Général sur la Protection des Données), vous avez le droit
          d&apos;accéder à vos données, de les télécharger et de demander leur suppression.
        </p>
      </div>

      {/* Export */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground mb-1">Exporter mes données</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Téléchargez une copie de toutes vos données personnelles (profil, commandes, devis,
              historique de consentements) au format JSON.{' '}
              <span className="text-foreground">Art. 20 RGPD — Droit à la portabilité.</span>
            </p>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-50 transition-colors"
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {exporting ? 'Préparation…' : 'Télécharger mes données'}
            </button>
          </div>
        </div>
      </div>

      {/* Deletion */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground mb-1">Supprimer mon compte</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Vous pouvez demander la suppression de votre compte et de vos données personnelles. La
              demande sera traitée dans un délai de{' '}
              <strong className="text-foreground">30 jours</strong>. Certaines données peuvent être
              conservées pour des obligations légales (comptabilité, litiges).{' '}
              <span className="text-foreground">Art. 17 RGPD — Droit à l&apos;effacement.</span>
            </p>

            {deleteRequested ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 text-sm">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                Votre demande a été enregistrée. Elle sera traitée dans les 30 jours.
              </div>
            ) : !showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Demander la suppression de mon compte
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Cette action est irréversible. Toutes vos données seront supprimées dans les 30
                    jours. Vos commandes en cours ne seront pas annulées.
                  </span>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">
                    Motif de suppression (optionnel)
                  </label>
                  <textarea
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    rows={3}
                    placeholder="Indiquez votre motif si vous le souhaitez…"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-red-500/40 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDeleteRequest}
                    disabled={deleting}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 disabled:opacity-50 transition-colors"
                  >
                    {deleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Confirmer la suppression
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legal links */}
      <p className="text-xs text-muted-foreground text-center">
        Pour toute question :{' '}
        <a href="mailto:privacy@unitree-robotics.fr" className="text-blue-500 hover:underline">
          privacy@unitree-robotics.fr
        </a>{' '}
        ·{' '}
        <Link href="/privacy" className="text-blue-500 hover:underline">
          Politique de confidentialité
        </Link>
      </p>
    </div>
  );
}
