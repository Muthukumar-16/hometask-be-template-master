import React, { useState } from 'react';
import axios from 'axios';

const ContractById = () => {
  const [contractId, setContractId] = useState('');
  const [profileId, setProfileId] = useState('');
  const [contract, setContract] = useState(null);
  const [error, setError] = useState('');

  const handleFetchContract = async () => {
    try {
      const response = await axios.get(`/contracts/${contractId}`, {
        headers: {
          'profile_id': profileId,
        },
      });
      setContract(response.data);
      setError('');
    } catch (err) {
      setError('Contract not found or access denied');
      setContract(null);
    }
  };

  return (
    <div>
      <h2>Fetch Contract by ID</h2>
      <input
        type="text"
        placeholder="Profile ID"
        value={profileId}
        onChange={(e) => setProfileId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Contract ID"
        value={contractId}
        onChange={(e) => setContractId(e.target.value)}
      />
      <button onClick={handleFetchContract}>Fetch Contract</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {contract && (
        <div>
          <h3>Contract Details</h3>
          <p>Terms: {contract.terms}</p>
          <p>Status: {contract.status}</p>
          <p>Client ID: {contract.ClientId}</p>
          <p>Contractor ID: {contract.ContractorId}</p>
        </div>
      )}
    </div>
  );
};

export default ContractById;
