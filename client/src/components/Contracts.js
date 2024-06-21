import React, { useState } from 'react';
import axios from 'axios';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [profileId, setProfileId] = useState('');

  const fetchContracts = async () => {
    try {
      const response = await axios.get('/contracts', {
        headers: {
          'profile_id': profileId,
        },
      });
      setContracts(response.data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  return (
    <div>
      <h2>Fetch Contracts</h2>
      <input
        type="text"
        placeholder="Profile ID"
        value={profileId}
        onChange={(e) => setProfileId(e.target.value)}
      />
      <button onClick={fetchContracts}>Fetch Contracts</button>
      
      <ul>
        {contracts.map((contract) => (
          <li key={contract.id}>
            {contract.terms} - Status: {contract.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contracts;
