import React, { useState, useEffect } from 'react';
import { useToast } from '../components/Toast.jsx';
import SettingsSection from '../components/SettingsSection.jsx';
import SettingsCard from '../components/SettingsCard.jsx';
import { 
  User, 
  Cpu, 
  Bell, 
  Eye, 
  FileDown, 
  ShieldCheck, 
  Save, 
  RefreshCw,
  Sliders,
  CheckCircle2,
  Key
} from 'lucide-react';

const DEFAULT_SETTINGS = {
  // Profile
  profileName: 'Yuvraj Singh',
  profileEmail: 'yuvraj@institutional-capital.com',
  apiToken: 'eq_live_83f98c110da29281bc89d02',

  // AI Configuration
  geminiModel: 'gemini-2.5-flash',
  temperature: 0.2,
  maxTokens: 4096,
  enableNewsScrape: true,
  enableYahooIndex: true,

  // Notifications
  emailAlerts: true,
  slackAlerts: false,
  pushAlerts: true,
  consensusChanges: true,

  // Appearance
  themePreference: 'graphite',
  fontSize: 'medium',
  compactGrid: false,
  enableAnimations: true,

  // PDF Export
  pdfIncludeSummary: true,
  pdfIncludeCharts: true,
  pdfIncludeRisks: true,
  pdfIncludeMetadata: true,

  // Security
  mfaEnabled: false,
  sessionTimeout: '60'
};

// Custom Toggle Switch Helper Component
const Toggle = ({ checked, onChange, label, description }) => {
  return (
    <div className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
      <div className="flex flex-col pr-4">
        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#FFFFFF]">
          {label}
        </span>
        {description && (
          <span className="text-[9px] font-sans text-[#9AA4B2] leading-relaxed mt-0.5">
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-[#FFFFFF]' : 'bg-white/10'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#0F1115] shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

export const Settings = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('user_platform_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse settings from localStorage', e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Handle setting updates
  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Save Settings to Local Storage
  const handleSave = (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      localStorage.setItem('user_platform_settings', JSON.stringify(settings));
      setIsSaving(false);
      addToast('Preferences saved successfully.', 'success');
    }, 600);
  };

  // Reset to Defaults
  const handleReset = () => {
    if (window.confirm('Reset all preferences to system defaults?')) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem('user_platform_settings', JSON.stringify(DEFAULT_SETTINGS));
      addToast('Settings reset to system defaults.', 'info');
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'ai', name: 'AI Configuration', icon: Cpu },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Eye },
    { id: 'pdf', name: 'PDF Exports', icon: FileDown },
    { id: 'security', name: 'Security', icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#FFFFFF] pb-12 transition-colors duration-200 font-sans">
      
      {/* Header Panel */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 animate-fadeIn">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/5 bg-[#171A21] text-[#9AA4B2]">
              <Sliders className="h-4 w-4 text-[#F5F5F5]" />
            </div>
            <div>
              <h1 className="text-xl font-sans font-bold uppercase tracking-wide tracking-[-0.01em]">Console Settings</h1>
              <p className="text-[10px] font-sans font-semibold text-[#9AA4B2] uppercase mt-0.5">
                Customize model nodes, outputs, preferences, and workspace security keys
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/5 bg-[#171A21] text-[10px] font-sans font-bold uppercase tracking-wider text-[#9AA4B2] hover:text-[#FFFFFF] transition-all duration-150 cursor-pointer shadow-sm"
            >
              Reset Defaults
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#F5F5F5] hover:bg-[#FFFFFF] text-[#0F1115] font-sans font-bold text-[10px] uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:hover:scale-100 shadow-sm"
            >
              {isSaving ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings Panel */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column Navigation List */}
          <aside className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1 pb-4 lg:pb-0 border-b lg:border-b-0 lg:border-r border-white/5 lg:pr-6 shrink-0 sticky top-4 select-none">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[10px] font-sans font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap lg:w-full text-left
                    ${active 
                      ? 'bg-[#1E232D] text-[#FFFFFF] border-l-2 border-[#F5F5F5] lg:translate-x-1.5' 
                      : 'text-[#9AA4B2] hover:text-[#FFFFFF] hover:bg-[#1E232D]/40'}`}
                >
                  <TabIcon className={`h-4 w-4 ${active ? 'text-[#FFFFFF]' : 'text-[#9AA4B2]'}`} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </aside>

          {/* Right Column Content Panel */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* 1. PROFILE SECTION */}
            {activeTab === 'profile' && (
              <SettingsSection 
                title="Profile Details" 
                description="Manage your institutional personal profile and access signatures."
              >
                <SettingsCard 
                  title="Personal Identity" 
                  description="Your platform identity details used for audit headers."
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={settings.profileName}
                        onChange={(e) => updateSetting('profileName', e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-white/5 bg-[#171A21] text-[#FFFFFF] text-xs font-sans focus:outline-none focus:border-[#F5F5F5]/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider mb-1">
                        Corporate Email
                      </label>
                      <input
                        type="email"
                        value={settings.profileEmail}
                        onChange={(e) => updateSetting('profileEmail', e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-white/5 bg-[#171A21] text-[#FFFFFF] text-xs font-sans focus:outline-none focus:border-[#F5F5F5]/30"
                      />
                    </div>
                  </div>
                </SettingsCard>

                <SettingsCard 
                  title="Workspace Authentication Key" 
                  description="A read/write live token used to query internal databases."
                  footer={
                    <>
                      <span className="text-[9px] font-sans font-medium text-[#9AA4B2] uppercase">
                        Access Tier: Institutional Live
                      </span>
                      <button
                        type="button"
                        onClick={() => addToast('Token rotated successfully. Please update downstream nodes.', 'info')}
                        className="px-2.5 py-1 border border-white/5 bg-[#171A21] hover:bg-[#1E232D] text-[#D1D5DB] hover:text-[#FFFFFF] rounded text-[8px] font-sans font-bold uppercase transition-colors cursor-pointer"
                      >
                        Rotate Key
                      </button>
                    </>
                  }
                >
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Key className="h-3.5 w-3.5 text-[#9AA4B2]/40" />
                    </span>
                    <input
                      type="password"
                      readOnly
                      value={settings.apiToken}
                      className="w-full pl-9 pr-3 py-2 rounded-md border border-white/5 bg-[#171A21] text-[#FFFFFF] text-xs font-mono tracking-widest select-all focus:outline-none cursor-default"
                    />
                  </div>
                </SettingsCard>
              </SettingsSection>
            )}

            {/* 2. AI CONFIGURATION SECTION */}
            {activeTab === 'ai' && (
              <SettingsSection 
                title="AI Consensus Model" 
                description="Fine-tune how agents operate, scrape data sources, and synthesize reports."
              >
                <SettingsCard 
                  title="Gemini Node Selection" 
                  description="Specify the core foundation model utilized by consensus graph engines."
                >
                  <div>
                    <label className="block text-[9px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider mb-1.5">
                      Target LLM Engine
                    </label>
                    <select
                      value={settings.geminiModel}
                      onChange={(e) => updateSetting('geminiModel', e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-white/5 bg-[#171A21] text-[#FFFFFF] text-xs font-sans focus:outline-none focus:border-[#F5F5F5]/30 cursor-pointer"
                    >
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash (Default High-Speed Node)</option>
                      <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Research & Reasoning Node)</option>
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash (Legacy Legacy Node)</option>
                      <option value="gemini-1.5-pro-latest">Gemini 1.5 Pro (Max Context Window Node)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[9px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider">
                          Generation Temperature
                        </label>
                        <span className="text-[10px] font-bold text-[#FFFFFF] font-mono">{settings.temperature}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={settings.temperature}
                        onChange={(e) => updateSetting('temperature', Number(e.target.value))}
                        className="w-full accent-[#FFFFFF] cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider mb-1">
                        Output Limit (Max Tokens)
                      </label>
                      <input
                        type="number"
                        min="256"
                        max="8192"
                        value={settings.maxTokens}
                        onChange={(e) => updateSetting('maxTokens', Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-md border border-white/5 bg-[#171A21] text-[#FFFFFF] text-xs font-sans focus:outline-none focus:border-[#F5F5F5]/30"
                      />
                    </div>
                  </div>
                </SettingsCard>

                <SettingsCard 
                  title="Scraping & Index Modules" 
                  description="Enable or disable real-time analytical pipeline sources."
                >
                  <div className="space-y-4 divide-y divide-white/5">
                    <Toggle
                      checked={settings.enableNewsScrape}
                      onChange={(val) => updateSetting('enableNewsScrape', val)}
                      label="Real-time News Agent Scraping"
                      description="Allows the Sentiment Agent to scan news API networks and scrape corporate reports."
                    />
                    <Toggle
                      checked={settings.enableYahooIndex}
                      onChange={(val) => updateSetting('enableYahooIndex', val)}
                      label="Yahoo Finance Index Synchronization"
                      description="Syncs real-time prices, historical balance sheets, and key multiples during analysis."
                    />
                  </div>
                </SettingsCard>
              </SettingsSection>
            )}

            {/* 3. NOTIFICATIONS SECTION */}
            {activeTab === 'notifications' && (
              <SettingsSection 
                title="System Notifications" 
                description="Manage alert preferences and system reports delivery channel nodes."
              >
                <SettingsCard 
                  title="Communication Routing" 
                  description="Configure alerts for critical consensus upgrades."
                >
                  <div className="space-y-4 divide-y divide-white/5">
                    <Toggle
                      checked={settings.emailAlerts}
                      onChange={(val) => updateSetting('emailAlerts', val)}
                      label="Email Summaries"
                      description="Receive weekly compiled analysis summaries to your inbox."
                    />
                    <Toggle
                      checked={settings.slackAlerts}
                      onChange={(val) => updateSetting('slackAlerts', val)}
                      label="Slack Webhook Integration"
                      description="Post stock changes directly to configured workspace channels."
                    />
                    <Toggle
                      checked={settings.pushAlerts}
                      onChange={(val) => updateSetting('pushAlerts', val)}
                      label="Browser Push Alerts"
                      description="Provide real-time desktop banner alerts when agent results compile."
                    />
                    <Toggle
                      checked={settings.consensusChanges}
                      onChange={(val) => updateSetting('consensusChanges', val)}
                      label="Consensus Deviation Alerts"
                      description="Alert immediately if a stock score changes by more than 15%."
                    />
                  </div>
                </SettingsCard>
              </SettingsSection>
            )}

            {/* 4. APPEARANCE SECTION */}
            {activeTab === 'appearance' && (
              <SettingsSection 
                title="Appearance & Interface" 
                description="Customize interface density, text scaling, and theme simulations."
              >
                <SettingsCard 
                  title="Theme & Colors" 
                  description="Locked to institutional Graphite Dark Theme, choose accent options."
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider mb-1.5">
                        Color Theme
                      </label>
                      <select
                        value={settings.themePreference}
                        onChange={(e) => updateSetting('themePreference', e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-white/5 bg-[#171A21] text-[#FFFFFF] text-xs font-sans focus:outline-none focus:border-[#F5F5F5]/30 cursor-pointer text-ellipsis"
                      >
                        <option value="graphite">Graphite Dark (Institutional Default)</option>
                        <option value="midnight">Midnight Blue Accent (Alternative Dark)</option>
                        <option value="charcoal">Pure Charcoal (High Contrast Dark)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider mb-1.5">
                        Text Size Scale
                      </label>
                      <select
                        value={settings.fontSize}
                        onChange={(e) => updateSetting('fontSize', e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-white/5 bg-[#171A21] text-[#FFFFFF] text-xs font-sans focus:outline-none focus:border-[#F5F5F5]/30 cursor-pointer"
                      >
                        <option value="small">Small (Dense Layout)</option>
                        <option value="medium">Medium (Standard Platform)</option>
                        <option value="large">Large (Relaxed Layout)</option>
                      </select>
                    </div>
                  </div>
                </SettingsCard>

                <SettingsCard 
                  title="Layout Preferences" 
                  description="Optimize visual panels for spreadsheet screens or widescreen layouts."
                >
                  <div className="space-y-4 divide-y divide-white/5">
                    <Toggle
                      checked={settings.compactGrid}
                      onChange={(val) => updateSetting('compactGrid', val)}
                      label="Compact Spreadsheet Grid"
                      description="Compacts tables in History and Watchlist pages to show more entries."
                    />
                    <Toggle
                      checked={settings.enableAnimations}
                      onChange={(val) => updateSetting('enableAnimations', val)}
                      label="Interface Micro-animations"
                      description="Render premium transitions, fade-ins, and layout expansion animations."
                    />
                  </div>
                </SettingsCard>
              </SettingsSection>
            )}

            {/* 5. PDF EXPORT PREFERENCES SECTION */}
            {activeTab === 'pdf' && (
              <SettingsSection 
                title="PDF Export Preferences" 
                description="Manage customized layouts exported to stakeholders or clients."
              >
                <SettingsCard 
                  title="PDF Components" 
                  description="Toggle which analysis blocks are written to the compiled reports."
                >
                  <div className="space-y-4 divide-y divide-white/5">
                    <Toggle
                      checked={settings.pdfIncludeSummary}
                      onChange={(val) => updateSetting('pdfIncludeSummary', val)}
                      label="Executive Synthesis Summary"
                      description="Include the AI Consensus paragraphs and recommendation charts."
                    />
                    <Toggle
                      checked={settings.pdfIncludeCharts}
                      onChange={(val) => updateSetting('pdfIncludeCharts', val)}
                      label="Qualitative & Score Breakdown Charts"
                      description="Include consensus, sentiment, risk, and financial charts."
                    />
                    <Toggle
                      checked={settings.pdfIncludeRisks}
                      onChange={(val) => updateSetting('pdfIncludeRisks', val)}
                      label="Detailed Risk & Moat Grids"
                      description="Write complete bullet-points regarding mitigations and vulnerabilities."
                    />
                    <Toggle
                      checked={settings.pdfIncludeMetadata}
                      onChange={(val) => updateSetting('pdfIncludeMetadata', val)}
                      label="Metadata & Key Ratios"
                      description="Include generator timestamp, version parameters, and PE/ROE details."
                    />
                  </div>
                </SettingsCard>
              </SettingsSection>
            )}

            {/* 6. SECURITY SECTION */}
            {activeTab === 'security' && (
              <SettingsSection 
                title="Workspace Security" 
                description="Audit session lifespans, toggle security protocols, and session terminations."
              >
                <SettingsCard 
                  title="Credential Settings" 
                  description="Protect platform settings with multi-factor authentication modules."
                >
                  <Toggle
                    checked={settings.mfaEnabled}
                    onChange={(val) => updateSetting('mfaEnabled', val)}
                    label="MFA Protocol Authentication"
                    description="Require a secure code from your authenticator app when editing api tokens."
                  />
                  
                  <div className="pt-2">
                    <label className="block text-[9px] font-sans font-bold text-[#9AA4B2] uppercase tracking-wider mb-1.5">
                      Interactive Session Timeout
                    </label>
                    <select
                      value={settings.sessionTimeout}
                      onChange={(e) => updateSetting('sessionTimeout', e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-white/5 bg-[#171A21] text-[#FFFFFF] text-xs font-sans focus:outline-none focus:border-[#F5F5F5]/30 cursor-pointer"
                    >
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="60">60 Minutes (Standard)</option>
                      <option value="240">4 Hours</option>
                    </select>
                  </div>
                </SettingsCard>

                <SettingsCard 
                  title="Active Workspace Sessions" 
                  description="Current browser tokens authenticated to this local environment."
                  footer={
                    <>
                      <span className="text-[9px] font-sans font-medium text-[#9AA4B2] uppercase">
                        Current Session IP: 127.0.0.1 (Localhost)
                      </span>
                      <button
                        type="button"
                        onClick={() => addToast('Successfully terminated other active sessions.', 'success')}
                        className="px-2.5 py-1 border border-[#EF4444]/30 bg-[#EF4444]/5 hover:bg-[#EF4444]/15 text-[#EF4444] rounded text-[8px] font-sans font-bold uppercase transition-colors cursor-pointer"
                      >
                        Terminate Sessions
                      </button>
                    </>
                  }
                >
                  <div className="border border-white/5 bg-[#171A21]/30 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-sans font-bold text-[#FFFFFF] uppercase">
                        Vite Browser Session
                      </span>
                      <span className="text-[8px] font-sans font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    </div>
                    <p className="text-[9px] text-[#9AA4B2]">
                      Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
                    </p>
                  </div>
                </SettingsCard>
              </SettingsSection>
            )}

          </main>

        </div>
      </div>
      
    </div>
  );
};

export default Settings;
