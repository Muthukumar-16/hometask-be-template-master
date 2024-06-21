import React, { useState } from 'react';
import { getBestClients } from '../services/api';

const BestClients = () => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [limit, setLimit] = useState(2);
  const [clients, setClients] = useState([]);

  const fetchBestClients = async () => {
    const result = await getBestClients(start, end, limit);
    setClients(result);
  };

  return (
    <div>
      <h2>Best Clients</h2>
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
      <input
        type="number"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        placeholder="Limit"
      />
      <button onClick={fetchBestClients}>Get Best Clients</button>
      <ul>
        {clients.map(client => (
          <li key={client.clientId}>
            {client.clientName} - {client.paid}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BestClients;
