
import React, { useState, useCallback } from 'react';
import Header from './Header';
import DomainList from './DomainList';
import StatsOverview from './StatsOverview';
import LogsViewer from './LogsViewer';
import SettingsPage from './SettingsPage';
import { RedirectLog, Domain, DomainStatus, Setting } from '../types';
import { checkDomainHealthWithGemini } from '../services/geminiService';

const initialDomains: Domain[] = [
  { id: 1, url: 'https://picsum.photos', status: DomainStatus.Healthy, last_checked: new Date().toISOString(), notes: 'Initial healthy domain.' },
  { id: 2, url: 'https://example-scam-site.net', status: DomainStatus.Flagged, last_checked: new Date().toISOString(), notes: 'This domain seems suspicious.' },
  { id: 3, url: 'https://this-is-down.com', status: DomainStatus.Down, last_checked: new Date().toISOString(), notes: 'HTTP check failed.' },
];

const initialLogs: RedirectLog[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  original_request: `/path/to/resource/${i}`,
  redirected_domain: `https://picsum.photos`,
  ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
  user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
}));

const initialSettings: Setting[] = [
    { id: 1, setting_key: 'google_safe_browsing_api_key', setting_value: '' },
    { id: 2, setting_key: 'cloudflare_api_key', setting_value: '' },
    { id: 3, setting_key: 'check_interval', setting_value: '60' },
];

type View = 'domains' | 'stats' | 'logs' | 'settings';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<View>('domains');
  const [domains, setDomains] = useState<Domain[]>(initialDomains);
  const [logs, setLogs] = useState<RedirectLog[]>(initialLogs);
  const [settings, setSettings] = useState<Setting[]>(initialSettings);
  const [isChecking, setIsChecking] = useState(false);

  const handleRunChecks = useCallback(async () => {
    setIsChecking(true);
    // Set all to 'checking' status visually
    setDomains(prev => prev.map(d => ({ ...d, status: DomainStatus.Checking })));
  
    // Simulate staggered checks
    const checkPromises = domains.map(domain => 
      new Promise<Domain>(resolve => {
        setTimeout(async () => {
          // Actual check logic
          // Simulate HTTP check
          const isHttpOk = domain.url !== 'https://this-is-down.com';
          if (!isHttpOk) {
            resolve({
              ...domain,
              status: DomainStatus.Down,
              last_checked: new Date().toISOString(),
              notes: 'Simulated HTTP check failed.'
            });
            return;
          }

          // Gemini AI Check
          const { status, notes } = await checkDomainHealthWithGemini(domain.url);
          resolve({
            ...domain,
            status,
            last_checked: new Date().toISOString(),
            notes
          });
        }, Math.random() * 2000); // Random delay
      })
    );
  
    const updatedDomains = await Promise.all(checkPromises);
    setDomains(updatedDomains);
    setIsChecking(false);
  }, [domains]);

  const renderView = () => {
    switch (activeView) {
      case 'domains':
        return <DomainList domains={domains} setDomains={setDomains} isChecking={isChecking} runChecks={handleRunChecks} />;
      case 'stats':
        return <StatsOverview domains={domains} logs={logs} />;
      case 'logs':
        return <LogsViewer logs={logs} />;
      case 'settings':
        return <SettingsPage settings={settings} setSettings={setSettings} />;
      default:
        return <DomainList domains={domains} setDomains={setDomains} isChecking={isChecking} runChecks={handleRunChecks} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <nav className="w-56 bg-gray-900/70 backdrop-blur-sm p-4 flex flex-col border-r border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-8">Domain Manager</h1>
        <ul>
          {['domains', 'stats', 'logs', 'settings'].map((view) => (
            <li key={view} className="mb-2">
              <button
                onClick={() => setActiveView(view as View)}
                className={`w-full text-left px-4 py-2 rounded-md transition-all duration-200 ${
                  activeView === view
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <button onClick={onLogout} className="w-full text-left px-4 py-2 rounded-md text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200">
            Logout
          </button>
        </div>
      </nav>
      <main className="flex-1 p-6 lg:p-8 bg-gray-900/80">
        <Header activeView={activeView} />
        <div className="mt-6">{renderView()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
