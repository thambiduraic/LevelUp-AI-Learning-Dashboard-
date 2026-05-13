'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Palette, Bell, Shield, Database, ExternalLink, User as UserIcon, Save, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import type { User } from '@/types';
import { toast } from 'sonner';
import { useTheme } from '@/components/theme-provider';


const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div className="glass-card p-6 overflow-hidden relative">
    <div className="absolute top-0 left-0 w-1 h-full bg-brand-blue/20" />
    <h2 className="font-bold text-text-primary flex items-center gap-2 mb-5">
      <Icon className="w-5 h-5 text-brand-blue" />
      {title}
    </h2>
    {children}
  </div>
);

const ToggleRow = ({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (val: boolean) => void }) => (
  <div className="flex items-center justify-between py-3 border-b border-surface-border last:border-0 group hover:bg-white/5 px-2 -mx-2 rounded-lg transition-colors">
    <div>
      <p className="text-text-primary text-sm font-medium">{label}</p>
      <p className="text-text-muted text-xs mt-0.5">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer" 
      />
      <div className="w-11 h-6 bg-surface-border peer-focus:ring-2 peer-focus:ring-brand-blue/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-brand-blue after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
    </label>
  </div>
);

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [settings, setSettings] = useState({
    dailyReminders: true,
    streakAlerts: true,
    levelCelebrations: true,
    aiMentorTips: false,
    analyticsSharing: true,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.get<User>('/users/profile');
        setUser(data);
        setName(data.name);
        setEmail(data.email);
        if (data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
          if (data.settings.theme) setTheme(data.settings.theme);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [setTheme]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Parallel update for profile and settings
      await Promise.all([
        api.patch('/users/profile', { name }),
        api.patch('/users/settings', { 
          settings: { ...settings, theme } 
        }),
      ]);
      toast.success('Settings saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Settings className="w-6 h-6 text-text-secondary" /> Settings
          </h1>
          <p className="text-text-secondary mt-1">Customize your LevelUp experience</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2 shadow-lg shadow-brand-blue/20 px-6"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <Section icon={UserIcon} title="Profile Settings">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="input-field opacity-60 cursor-not-allowed"
              placeholder="email@example.com"
            />
            <p className="text-[10px] text-text-muted mt-1">Email cannot be changed (managed by Supabase)</p>
          </div>
        </div>
      </Section>

      <Section icon={Bell} title="Notifications">
        <ToggleRow 
          label="Daily Quest Reminders" 
          description="Get notified to complete your daily quests" 
          checked={settings.dailyReminders}
          onChange={(val) => updateSetting('dailyReminders', val)}
        />
        <ToggleRow 
          label="Streak Alerts" 
          description="Alert when your streak is about to break" 
          checked={settings.streakAlerts}
          onChange={(val) => updateSetting('streakAlerts', val)}
        />
        <ToggleRow 
          label="Level Up Celebrations" 
          description="Notification when you level up" 
          checked={settings.levelCelebrations}
          onChange={(val) => updateSetting('levelCelebrations', val)}
        />
        <ToggleRow 
          label="AI Mentor Tips" 
          description="Weekly AI-generated learning tips" 
          checked={settings.aiMentorTips}
          onChange={(val) => updateSetting('aiMentorTips', val)}
        />
      </Section>

      <Section icon={Palette} title="Appearance">
        <div className="py-3">
          <p className="text-text-primary text-sm font-medium mb-3">Theme</p>
          <div className="grid grid-cols-2 gap-3">
            {['dark', 'midnight'].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t as 'dark' | 'midnight')}

                className={`p-4 rounded-xl border text-sm font-medium transition-all relative ${theme === t ? 'border-brand-blue/40 bg-brand-blue/10 text-brand-blue' : 'border-surface-border text-text-muted hover:border-surface-border/80'}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {theme === t && (
                  <CheckCircle2 className="w-4 h-4 absolute top-2 right-2 text-brand-blue" />
                )}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section icon={Shield} title="Privacy & Security">
        <ToggleRow 
          label="Analytics Sharing" 
          description="Help improve LevelUp by sharing usage data" 
          checked={settings.analyticsSharing}
          onChange={(val) => updateSetting('analyticsSharing', val)}
        />
        <div className="pt-3">
          <button className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5 font-medium">
            Delete Account
          </button>
        </div>
      </Section>

      <Section icon={Database} title="System Status">
        <div className="space-y-3">
          {[
            { label: 'Supabase Auth', desc: 'Authentication provider', status: 'Connected', color: 'text-emerald-400' },
            { label: 'Neon PostgreSQL', desc: 'Database', status: 'Connected', color: 'text-emerald-400' },
            { label: 'OpenAI API', desc: 'AI Mentor engine', status: 'Ready', color: 'text-emerald-400' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-surface-card/50 border border-surface-border">
              <div>
                <p className="text-text-primary text-sm font-medium">{item.label}</p>
                <p className="text-text-muted text-xs">{item.desc}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-medium ${item.color}`}>{item.status}</span>
                <ExternalLink className="w-3 h-3 text-text-muted" />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </motion.div>
  );
}

