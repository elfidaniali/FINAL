
import React, { useState } from 'react';
import { Domain, DomainStatus } from '../types';
import { StatusIndicator, CheckIcon, TrashIcon, EditIcon, PlusIcon, SaveIcon, CancelIcon } from './icons/Icons';

interface DomainListProps {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  isChecking: boolean;
  runChecks: () => void;
}

const DomainRow: React.FC<{ domain: Domain; onSave: (domain: Domain) => void; onDelete: (id: number) => void; }> = ({ domain, onSave, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedDomain, setEditedDomain] = useState(domain);

    const handleSave = () => {
        onSave(editedDomain);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedDomain(domain);
        setIsEditing(false);
    };

    return (
        <tr className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
            <td className="px-4 py-3">
              {isEditing ? (
                  <input type="text" value={editedDomain.url} onChange={e => setEditedDomain({...editedDomain, url: e.target.value})} className="bg-gray-700 border border-gray-600 rounded px-2 py-1 w-full" />
              ) : (
                  <span className="font-mono">{domain.url}</span>
              )}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center space-x-2">
                  <StatusIndicator status={domain.status} />
                  <span className="capitalize">{domain.status}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-gray-400">{new Date(domain.last_checked).toLocaleString()}</td>
            <td className="px-4 py-3 text-gray-400 max-w-sm truncate">
            {isEditing ? (
                  <input type="text" value={editedDomain.notes} onChange={e => setEditedDomain({...editedDomain, notes: e.target.value})} className="bg-gray-700 border border-gray-600 rounded px-2 py-1 w-full" />
              ) : (
                  domain.notes
              )}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center space-x-2">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className="text-green-400 hover:text-green-300"><SaveIcon /></button>
                        <button onClick={handleCancel} className="text-gray-400 hover:text-gray-300"><CancelIcon /></button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)} className="text-blue-400 hover:text-blue-300"><EditIcon /></button>
                        <button onClick={() => onDelete(domain.id)} className="text-red-400 hover:text-red-300"><TrashIcon /></button>
                    </>
                )}
              </div>
            </td>
        </tr>
    );
};


const DomainList: React.FC<DomainListProps> = ({ domains, setDomains, isChecking, runChecks }) => {
  const [newDomainUrl, setNewDomainUrl] = useState('');

  const handleAddDomain = () => {
    if (newDomainUrl.trim() === '') return;
    const newDomain: Domain = {
      id: Math.max(0, ...domains.map(d => d.id)) + 1,
      url: newDomainUrl,
      status: DomainStatus.Healthy,
      last_checked: new Date().toISOString(),
      notes: 'Newly added domain, pending first check.',
    };
    setDomains([...domains, newDomain]);
    setNewDomainUrl('');
  };

  const handleUpdateDomain = (updatedDomain: Domain) => {
    setDomains(domains.map(d => d.id === updatedDomain.id ? updatedDomain : d));
  };
  
  const handleDeleteDomain = (id: number) => {
    setDomains(domains.filter(domain => domain.id !== id));
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newDomainUrl}
            onChange={(e) => setNewDomainUrl(e.target.value)}
            placeholder="https://new-domain.com"
            className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddDomain}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center space-x-2 transition-colors"
          >
            <PlusIcon />
            <span>Add Domain</span>
          </button>
        </div>
        <button
            onClick={runChecks}
            disabled={isChecking}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md flex items-center space-x-2 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
            {isChecking ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
                <CheckIcon />
            )}
            <span>{isChecking ? 'Checking...' : 'Run Checks Now'}</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
            <tr>
              <th scope="col" className="px-4 py-3">Domain URL</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Last Checked</th>
              <th scope="col" className="px-4 py-3">Notes</th>
              <th scope="col" className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {domains.map(domain => (
              <DomainRow key={domain.id} domain={domain} onSave={handleUpdateDomain} onDelete={handleDeleteDomain} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DomainList;
