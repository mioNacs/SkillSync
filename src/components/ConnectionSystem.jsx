import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import ConnectionButton from './connection/ConnectionButton';
import RequestsList from './connection/RequestsList';
import ConnectionsList from './connection/ConnectionsList';

export { ConnectionButton };

const ConnectionSystem = () => {
  const [activeTab, setActiveTab] = useState('requests');

  return (
    <div>
      <Toaster position="top-right" />
      
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('requests')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'connections'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Connections
          </button>
        </nav>
      </div>
      
      {activeTab === 'requests' ? <RequestsList /> : <ConnectionsList />}
    </div>
  );
};

export default ConnectionSystem;
