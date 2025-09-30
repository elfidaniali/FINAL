
import React from 'react';

interface HeaderProps {
  activeView: string;
}

const viewTitles: { [key: string]: string } = {
  domains: 'Domain Management',
  stats: 'Statistics & Overview',
  logs: 'Redirect Logs',
  settings: 'API & System Settings',
};

const Header: React.FC<HeaderProps> = ({ activeView }) => {
  return (
    <header className="pb-4 border-b border-gray-700">
      <h2 className="text-3xl font-bold text-white">
        {viewTitles[activeView] || 'Dashboard'}
      </h2>
    </header>
  );
};

export default Header;
