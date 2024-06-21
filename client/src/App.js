import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BestClients from './components/BestClients';
import BestProfession from './components/BestProfession';
import Contracts from './components/Contracts';
import Deposit from './components/Deposit';
import PayJob from './components/PayJob';
import UnpaidJobs from './components/UnpaidJobs';
import ContractById from './components/ContractById';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/best-clients">Best Clients</Link></li>
            <li><Link to="/best-profession">Best Profession</Link></li>
            <li><Link to="/contracts">Contracts</Link></li>
            <li><Link to="/deposit">Deposit</Link></li>
            <li><Link to="/pay-job">Pay Job</Link></li>
            <li><Link to="/unpaid-jobs">Unpaid Jobs</Link></li>
            <li><Link to="/contract-by-id">Contract By ID</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/best-clients" element={<BestClients />} />
          <Route path="/best-profession" element={<BestProfession />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/pay-job" element={<PayJob />} />
          <Route path="/unpaid-jobs" element={<UnpaidJobs />} />
          <Route path="/contract-by-id" element={<ContractById />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
