import React, { useState } from 'react';
import axios from 'axios';

const PayJob = () => {
  const [jobId, setJobId] = useState('');

  const handlePayJob = async () => {
    try {
      await axios.post(`/jobs/${jobId}/pay`);
      alert('Payment successful');
    } catch (error) {
      console.error('Error paying for job:', error);
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Pay Job</h2>
      <input
        type="text"
        placeholder="Job ID"
        value={jobId}
        onChange={(e) => setJobId(e.target.value)}
      />
      <button onClick={handlePayJob}>Pay</button>
    </div>
  );
};

export default PayJob;
