import React, { useState } from 'react';
import axios from 'axios';

const Deposit = () => {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');

  const handleDeposit = async () => {
    try {
      await axios.post(`/balances/deposit/${userId}`, { amount: parseFloat(amount) });
      alert('Deposit successful');
    } catch (error) {
      console.error('Error depositing money:', error);
      alert('Error depositing money');
    }
  };

  return (
    <div>
      <h2>Deposit</h2>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleDeposit}>Deposit</button>
    </div>
  );
};

export default Deposit;
