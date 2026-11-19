/**
 * @file src/pages/AiAgent/index.jsx
 * @description AI Agent domain page view for MCP server integration
 */
import React from 'react';
import McpConnectCard from '../../components/McpConnectCard.jsx';
import { Bot, Terminal, Code, Cpu } from 'lucide-react';

export default function AiAgentPage() {
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-display lowercase text-2xl sm:text-3xl text-ink font-semibold">AI Agent Integration</h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-paper3 text-muted border border-rule/50">
            BYOK
          </span>
        </div>
        <p className="text-xs text-muted mt-1">
          Connect Cursor, Claude Code, ChatGPT, or n8n to automate video clipping, editing, and publishing via Model Context Protocol (MCP).
        </p>
      </div>

      <div className="space-y-6">
        <McpConnectCard />

        {/* Available MCP Tools Showcase */}
        <div className="bg-paper2 border border-rule rounded-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink">
            <Cpu size={15} className="text-muted" />
            <span>Built-in Agent Tool Capabilities</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-paper rounded-lg border border-rule/60 space-y-1">
              <span className="font-mono text-ink text-[11px] font-medium">clip_video</span>
              <p className="text-[11px] text-muted">Pass any YouTube URL or file to generate vertical shorts</p>
            </div>
            <div className="p-3 bg-paper rounded-lg border border-rule/60 space-y-1">
              <span className="font-mono text-ink text-[11px] font-medium">check_job_status</span>
              <p className="text-[11px] text-muted">Poll pipeline progress and retrieve generated clip URLs</p>
            </div>
            <div className="p-3 bg-paper rounded-lg border border-rule/60 space-y-1">
              <span className="font-mono text-ink text-[11px] font-medium">add_subtitles</span>
              <p className="text-[11px] text-muted">Burn animated karaoke subtitles into any clip</p>
            </div>
            <div className="p-3 bg-paper rounded-lg border border-rule/60 space-y-1">
              <span className="font-mono text-ink text-[11px] font-medium">edit_hook</span>
              <p className="text-[11px] text-muted">Customize the opening headline and visual pill style</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

