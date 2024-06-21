import React, { useState } from 'react';
import { getBestProfession } from '../services/api';

const BestProfession = () => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [profession, setProfession] = useState(null);

  const fetchBestProfession = async () => {
    const result = await getBestProfession(start, end);
    console.log(result);
    debugger
    setProfession(result);
  };
debugger
console.log(profession);
  return (
    <div>
      <h2>Best Profession</h2>
      <input
        type="date"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        placeholder="Start Date"
      />
      <input
        type="date"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        placeholder="End Date"
      />
      <button onClick={fetchBestProfession}>Best Profession</button>
      {profession && (
        <div>
          <p>Profession: {profession.bestPaidProfession}</p>
          <p>Total Earned: {profession.totalEarned}</p>
        </div>
      )}
    </div>
  );
};

export default BestProfession;
