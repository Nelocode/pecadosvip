'use client';

import React, { useState } from 'react';
import { deriveKycMasterKey, encryptKycDocument, decryptKycDocument } from '@/lib/security/kyc-vault';

export default function EncryptedKycVaultPage() {
  const [selectedModel, setSelectedModel] = useState('valeria');
  const [documentType, setDocumentType] = useState<'id_card' | 'verification_selfie' | 'rights_contract'>('id_card');
  const [isVerifiedBadgeActive, setIsVerifiedBadgeActive] = useState(true);
  const [masterSecret, setMasterSecret] = useState('kyc-production-master-secret-key-12345');
  const [logs, setLogs] = useState<string[]>([]);

  const handleEncryptAndStore = () => {
    try {
      const masterKey = deriveKycMasterKey(masterSecret);
      const fakeDocBuffer = Buffer.from(`DNI_PASSPORT_CONTENT_${selectedModel}_${Date.now()}`);

      const encrypted = encryptKycDocument(fakeDocBuffer, masterKey);

      // Verify decryption immediately to prove AES-256-GCM integrity
      const decrypted = decryptKycDocument(encrypted, masterKey);

      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] ✅ Documento (${documentType}) cifrado exitosamente con AES-256-GCM. AuthTag: ${encrypted.authTagHex.substring(0, 8)}... Contenido verificado: "${decrypted.toString('utf8').substring(0, 20)}..."`,
        ...prev,
      ]);
    } catch (err) {
      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] ❌ Error de cifrado: ${err instanceof Error ? err.message : String(err)}`,
        ...prev,
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold text-amber-400">
          🔒 Bóveda Interna de Documentación KYC (AES-256-GCM)
        </h1>
        <p className="text-xs text-zinc-400">
          Acceso exclusivo para el Oficial de Cumplimiento / KYC. Resguardo cifrado de identificaciones (+18), selfies de verificación y contratos de derechos de imagen.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column: Upload & Encryption Control */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-6">
          <h2 className="text-base font-bold text-zinc-100 border-b border-zinc-800 pb-2">
            Carga Cifrada de Documentos KYC
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-zinc-300">Modelo Seleccionada</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-sm text-zinc-100"
              >
                <option value="valeria">Valeria (Madrid)</option>
                <option value="sofia">Sofía (Barcelona)</option>
                <option value="lucia">Lucía (Madrid)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-zinc-300">Tipo de Documento Legal</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-sm text-zinc-100"
              >
                <option value="id_card">Copia de Identificación Oficial / Pasaporte (+18)</option>
                <option value="verification_selfie">Fotografía / Selfie de Verificación de Identidad</option>
                <option value="rights_contract">Contrato Firmado de Cesión de Imagen</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-zinc-300">Clave Maestra KYC (Cifrado AES-256)</label>
              <input
                type="password"
                value={masterSecret}
                onChange={(e) => setMasterSecret(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-sm text-zinc-100"
              />
            </div>

            {/* Verified Badge Toggle */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-amber-400 text-sm">Insignia de Perfil Verificado</p>
                <p className="text-[11px] text-zinc-400">
                  Despliega la etiqueta pública de verificación cuando la documentación sea validada.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsVerifiedBadgeActive(!isVerifiedBadgeActive)}
                className={`rounded-full px-4 py-1.5 font-bold text-xs transition ${
                  isVerifiedBadgeActive
                    ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400'
                    : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                }`}
              >
                {isVerifiedBadgeActive ? '✓ Verificada' : 'Pendiente'}
              </button>
            </div>

            <button
              type="button"
              onClick={handleEncryptAndStore}
              className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-zinc-950 hover:bg-emerald-500 transition"
            >
              🔒 Cifrar con AES-256-GCM y Almacenar en Bóveda
            </button>
          </div>
        </div>

        {/* Right Column: Encrypted Vault Inspection Log */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
          <h2 className="text-base font-bold text-zinc-100 border-b border-zinc-800 pb-2">
            Registro de Cifrado y Auditoría de Bóveda
          </h2>

          <div className="h-80 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-[11px] text-zinc-300 space-y-2">
            {logs.length === 0 ? (
              <p className="text-zinc-600 italic">No hay operaciones recientes en esta sesión.</p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="border-b border-zinc-900 pb-1.5">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
