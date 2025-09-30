
import React, { useState } from 'react';
import { Setting } from '../types';

interface SettingsPageProps {
  settings: Setting[];
  setSettings: React.Dispatch<React.SetStateAction<Setting[]>>;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, setSettings }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleInputChange = (id: number, value: string) => {
    setLocalSettings(
      localSettings.map(setting =>
        setting.id === id ? { ...setting, setting_value: value } : setting
      )
    );
  };

  const handleSave = () => {
    setSettings(localSettings);
    // Here you would typically make an API call to save the settings.
    alert('Settings saved!');
  };
  
  const getSettingValue = (key: string) => localSettings.find(s => s.setting_key === key)?.setting_value || '';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-md p-6 space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-white">API Keys</h3>
          <p className="text-gray-400 mt-1">Manage credentials for third-party services.</p>
        </div>

        <div className="space-y-4">
          <SettingInput
            label="Google Safe Browsing API Key"
            description="Used to check domains against Google's list of unsafe web resources."
            value={getSettingValue('google_safe_browsing_api_key')}
            onChange={(e) => handleInputChange(1, e.target.value)}
          />
          <SettingInput
            label="Cloudflare API Key"
            description="Used to automatically manage DNS records for flagged domains (optional)."
            value={getSettingValue('cloudflare_api_key')}
            onChange={(e) => handleInputChange(2, e.target.value)}
            type="password"
          />
        </div>

        <div className="border-t border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-white">System Configuration</h3>
            <p className="text-gray-400 mt-1">Adjust core application settings.</p>
        </div>

        <div className="space-y-4">
            <label className="block">
                <span className="text-gray-300">Check Interval (minutes)</span>
                <p className="text-sm text-gray-500 mb-2">How often the domain health checker should run.</p>
                <input
                    type="number"
                    min="1"
                    value={getSettingValue('check_interval')}
                    onChange={(e) => handleInputChange(3, e.target.value)}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </label>
        </div>


        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

interface SettingInputProps {
    label: string;
    description: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

const SettingInput: React.FC<SettingInputProps> = ({ label, description, value, onChange, type = 'text' }) => (
    <label className="block">
        <span className="text-gray-300">{label}</span>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
    </label>
);


export default SettingsPage;
