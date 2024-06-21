import React, { useState } from 'react';
import axios from 'axios';

const UnpaidJobs = () => {
  const [unpaidJobs, setUnpaidJobs] = useState([]);
  const [profileId, setProfileId] = useState('');

  const fetchUnpaidJobs = async () => {
    if (!profileId) {
      alert('Please enter a valid User ID');
      return;
    }

    try {
      const response = await axios.get('/jobs/unpaid', {
        headers: {
          'profile_id': profileId,
        },
      });
      setUnpaidJobs(response.data);
    } catch (error) {
      console.error('Error fetching unpaid jobs:', error);
    }
  };

  return (
    <div>
      <h2>Unpaid Jobs</h2>
      <input
        type="text"
        placeholder="Profile ID"
        value={profileId}
        onChange={(e) => setProfileId(e.target.value)}
      />
      <button onClick={fetchUnpaidJobs}>Fetch Unpaid Jobs</button>
      <ul>
        {unpaidJobs.map((job) => (
          <li key={job.id}>
            {job.ContractId} - {job.description} - Price: {job.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UnpaidJobs;
