/**
 * @file src/pages/Settings/index.jsx
 * @description Settings domain page view for API keys and Agent setup
 */
import React from 'react';
import { GeminiKeyCard } from './components/GeminiKeyCard.jsx';
import McpConnectCard from '../../components/McpConnectCard.jsx';
import { Settings as SettingsIcon, Server } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h2 className="font-display lowercase text-2xl sm:text-3xl text-ink font-semibold">Settings</h2>
        <p className="text-xs text-muted mt-1">Manage API keys, model configurations, and connected AI agents</p>
      </div>

      <div className="space-y-6">
        {/* Gemini API Key */}
        <GeminiKeyCard />

        {/* MCP Connect Card */}
        <McpConnectCard />

        {/* Backend Node Status Card */}
        <div className="bg-paper2 border border-rule rounded-card p-6 space-y-3">
          <div className="flex items-center gap-2 text-ink font-medium text-xs">
            <Server size={14} className="text-muted" />
            <span>Node.js Backend Server</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Running locally on <code className="text-ink font-mono bg-paper3 px-1.5 py-0.5 rounded">http://localhost:5050</code> with automatic YouTube video ingestion, live stream rolling buffer, and FFmpeg 9:16 rendering.
          </p>
        </div>
      </div>
    </div>
  );
}

