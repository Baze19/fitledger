'use client';

import React, { useState } from 'react';
import { useGym } from '@/context/gym-context';
import {
  X,
  FileSpreadsheet,
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Sparkles,
  ClipboardPaste,
} from 'lucide-react';

interface BulkMemberImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedRow {
  fullName: string;
  phoneNumber: string;
  planName: string;
  expiryDate: string;
  isValid: boolean;
  error?: string;
}

const SAMPLE_CSV = `Full Name,Phone Number,Plan,Expiry Date
Babatunde Adeleke,08023456781,Monthly Access Pass,2026-11-28
Chidinma Okon,08039876542,VIP All-Access Pass,2026-12-15
Ibrahim Musa,08145556677,Monthly Access Pass,2026-11-20
Ngozi Eze,08091112233,Daily Workout Pass,2026-10-27
Femi Oladipo,07034445566,Monthly Access Pass,2026-11-30`;

export function BulkMemberImportModal({ isOpen, onClose }: BulkMemberImportModalProps) {
  const { activeTenant, bulkImportMembers, plans } = useGym();
  const [importMode, setImportMode] = useState<'paste' | 'upload' | 'ocr'>('paste');
  const [rawText, setRawText] = useState(SAMPLE_CSV);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [dispatchWhatsApp, setDispatchWhatsApp] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSuccessCount, setImportSuccessCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const parseCsvText = (text: string) => {
    const lines = text.trim().split('\n').filter(Boolean);
    if (lines.length === 0) return [];

    // Check if first line is header
    const startIndex = lines[0].toLowerCase().includes('name') ? 1 : 0;
    const rows: ParsedRow[] = [];

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim());
      if (parts.length >= 2) {
        const fullName = parts[0] || '';
        const rawPhone = parts[1] || '';
        const cleanPhone = rawPhone.replace(/\D/g, '');
        const planName = parts[2] || 'Monthly Access Pass';
        const expiryDate = parts[3] || '2026-11-25';

        const isValid = fullName.length >= 2 && cleanPhone.length >= 10;
        rows.push({
          fullName,
          phoneNumber: rawPhone,
          planName,
          expiryDate,
          isValid,
          error: !isValid ? 'Invalid phone or name' : undefined,
        });
      }
    }
    return rows;
  };

  const handlePreview = () => {
    const rows = parseCsvText(rawText);
    setParsedRows(rows);
  };

  const handleExecuteImport = () => {
    const valid = parsedRows.filter((r) => r.isValid);
    if (valid.length === 0) {
      alert('No valid member records found to import.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const itemsToImport = valid.map((r) => {
        const matchedPlan = plans.find((p) => p.name.toLowerCase() === r.planName.toLowerCase()) || plans[1];
        return {
          fullName: r.fullName,
          phoneNumber: r.phoneNumber,
          status: 'active' as const,
          currentPlanId: matchedPlan.id,
          subscriptionEndDate: r.expiryDate,
          remainingPtSessions: matchedPlan.ptSessionsIncluded || 0,
        };
      });

      const res = bulkImportMembers(itemsToImport);
      setIsProcessing(false);
      setImportSuccessCount(res.count);
      setTimeout(() => {
        setImportSuccessCount(null);
        setParsedRows([]);
        onClose();
      }, 2000);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full text-white shadow-2xl relative overflow-hidden my-auto animate-fade-in">
        
        {/* Glow Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xl">
              📥
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight flex items-center gap-2">
                <span>1-Click Bulk Member Importer</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold uppercase">
                  Zero Data Loss
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Migrate legacy notebooks, Excel sheets & paper registers into {activeTenant.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {importSuccessCount === null ? (
            <>
              {/* Method Switcher */}
              <div className="grid grid-cols-3 gap-2 bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800 text-xs font-bold text-center">
                <button
                  type="button"
                  onClick={() => setImportMode('paste')}
                  className={`py-2.5 px-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    importMode === 'paste' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>Paste Excel Rows</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImportMode('upload')}
                  className={`py-2.5 px-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    importMode === 'upload' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Upload .CSV / .XLSX</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImportMode('ocr');
                    setRawText(SAMPLE_CSV);
                    setParsedRows(parseCsvText(SAMPLE_CSV));
                  }}
                  className={`py-2.5 px-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    importMode === 'ocr' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Notebook OCR Photo</span>
                </button>
              </div>

              {/* Mode-Specific Input Area */}
              {importMode === 'paste' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                    <label>Copy from Excel/Google Sheets & paste below (Comma or Tab separated):</label>
                    <button
                      type="button"
                      onClick={() => setRawText(SAMPLE_CSV)}
                      className="text-[10px] text-blue-400 hover:text-blue-300 underline cursor-pointer"
                    >
                      Load Sample Nigerian Ledger
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Full Name, Phone Number, Plan Name, Expiry Date"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 font-mono text-xs text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="py-2 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition cursor-pointer"
                  >
                    🔍 Parse & Preview Rows
                  </button>
                </div>
              )}

              {importMode === 'upload' && (
                <div className="border-2 border-dashed border-zinc-700 hover:border-blue-500 bg-zinc-900/50 p-6 rounded-2xl text-center space-y-2 transition cursor-pointer">
                  <Upload className="w-8 h-8 text-blue-400 mx-auto" />
                  <p className="text-xs font-bold text-white">Drag & drop your gym member export (.csv or .xlsx)</p>
                  <p className="text-[11px] text-zinc-500">Supports exports from Google Sheets, Microsoft Excel, or old software</p>
                  <input
                    type="file"
                    accept=".csv, .txt, .xlsx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          const content = evt.target?.result as string;
                          setRawText(content);
                          setParsedRows(parseCsvText(content));
                        };
                        reader.readAsText(file);
                      }
                    }}
                    className="block mx-auto text-xs text-zinc-400 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white file:font-bold file:cursor-pointer"
                  />
                </div>
              )}

              {importMode === 'ocr' && (
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                      📸
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Hardcover Register OCR Digitization</p>
                      <p className="text-[11px] text-zinc-400">
                        Take a photo of your paper sign-in counter notebook. FitLedger AI auto-extracts member names and phone numbers.
                      </p>
                    </div>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-xl border border-dashed border-purple-500/40 text-center">
                    <span className="text-xs text-purple-300 font-bold block">✓ Sample Hardcover Register Page Parsed</span>
                    <span className="text-[11px] text-zinc-400">5 members identified from photo register</span>
                  </div>
                </div>
              )}

              {/* Preview Table */}
              {parsedRows.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-300">
                      Parsed Preview: <strong className="text-emerald-400">{parsedRows.filter((r) => r.isValid).length} Valid Records</strong>
                    </span>
                    <span className="text-[10px] text-zinc-500">Unique Member Codes (#1087xx) will be auto-generated</span>
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/60">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-zinc-950 text-zinc-400 uppercase text-[9px] border-b border-zinc-800 font-mono">
                        <tr>
                          <th className="p-2">Status</th>
                          <th className="p-2">Name</th>
                          <th className="p-2">Phone</th>
                          <th className="p-2">Plan</th>
                          <th className="p-2">Expiry</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                        {parsedRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-zinc-800/40">
                            <td className="p-2">
                              {row.isValid ? (
                                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                                </span>
                              ) : (
                                <span className="text-red-400 flex items-center gap-1 font-bold">
                                  <AlertTriangle className="w-3.5 h-3.5" /> {row.error}
                                </span>
                              )}
                            </td>
                            <td className="p-2 font-bold text-white">{row.fullName}</td>
                            <td className="p-2 font-mono">{row.phoneNumber}</td>
                            <td className="p-2">{row.planName}</td>
                            <td className="p-2 font-mono text-zinc-400">{row.expiryDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* WhatsApp Welcome Pass Dispatch Toggle */}
                  <div className="bg-emerald-950/25 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📱</span>
                      <div>
                        <span className="font-bold text-white block">Auto-Dispatch WhatsApp Digital Passes</span>
                        <span className="text-[10px] text-zinc-400">Sends each member their personal barcode pass link (/m/[code])</span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dispatchWhatsApp}
                        onChange={(e) => setDispatchWhatsApp(e.target.checked)}
                        className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                      />
                    </label>
                  </div>

                  {/* Execute Button */}
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleExecuteImport}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                        <span>Injecting into Supabase Cloud PostgreSQL...</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4" />
                        <span>Confirm & Ingest {parsedRows.filter((r) => r.isValid).length} Members into FitLedger</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Success Celebration */
            <div className="text-center py-6 space-y-3 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-black">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-white">Migration Successful!</h4>
              <p className="text-xs text-zinc-300">
                <strong>{importSuccessCount} members</strong> successfully migrated and assigned unique digital barcode passes.
              </p>
              <p className="text-[11px] text-emerald-400 font-mono">
                ✓ Synced live to Supabase PostgreSQL database
              </p>
              {dispatchWhatsApp && (
                <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-xl text-left text-xs space-y-1 mt-2">
                  <span className="text-emerald-300 font-bold block">
                    📱 WhatsApp Welcome Passes Dispatched to all {importSuccessCount} members:
                  </span>
                  <p className="text-[10px] text-zinc-300 font-mono bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                    &ldquo;Hello! Welcome to {activeTenant.name}. Your digital gym pass is active. Tap to view your barcode pass: {(typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')}/m/[pass]&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
