/**
 * @file src/pages/Settings/components/GeminiKeyCard.jsx
 * @description Google Gemini API Key management card
 */
import React, { useState } from 'react';
import { Key, Eye, EyeOff, CheckCircle2, Trash2, ExternalLink } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks.js';
import { setGeminiApiKey, removeGeminiApiKey } from '../../../store/slices/authSlice.js';
import { toast } from 'react-toastify';

export const GeminiKeyCard = () => {
  const dispatch = useAppDispatch();
  const currentKey = useAppSelector((state) => state.auth.geminiApiKey);

  const [inputKey, setInputKey] = useState(currentKey || '');
  const [showKey, setShowKey] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      toast.error('Please enter a valid Gemini API key');
      return;
    }
    dispatch(setGeminiApiKey(inputKey.trim()));
    toast.success('Gemini API key saved in browser storage');
  };

  const handleRemove = () => {
    dispatch(removeGeminiApiKey());
    setInputKey('');
    toast.info('Gemini API key removed');
  };

  return (
    <div className="bg-paper2 border border-rule rounded-card p-6 space-y-5 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Key size={16} />
          </div>
          <div>
            <h3 className="font-display lowercase text-base text-ink font-semibold">Google Gemini API Key</h3>
            <p className="text-xs text-muted">Required for AI audio transcription and viral hook analysis</p>
          </div>
        </div>

        {currentKey && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Configured
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="relative flex items-center">
          <input
            type={showKey ? 'text' : 'password'}
            placeholder="AIzaSy... or AQ.Ab..."
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="w-full h-11 px-3.5 pr-20 rounded-input border border-rule bg-paper text-xs font-mono text-ink focus:outline-none focus:border-ink transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 p-1.5 text-muted hover:text-ink transition-colors cursor-pointer"
            title={showKey ? 'Hide key' : 'Show key'}
          >
            {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs">
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-muted hover:text-ink underline transition-colors"
          >
            <span>Get your free Gemini API Key here</span>
            <ExternalLink size={12} />
          </a>

          <div className="flex items-center gap-2">
            {currentKey && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 rounded-input border border-rule text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <Trash2 size={12} />
                <span>Remove</span>
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-1.5 rounded-input bg-ink text-paper text-xs font-medium hover:bg-ink2 transition-colors cursor-pointer"
            >
              Save Key
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

