// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import ProfileBuilder from './pages/ProfileBuilder';
import Results from './pages/Results';
import GrantDetails from './pages/GrantDetails';
import ReadinessDashboard from './pages/ReadinessDashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/profile" element={<ProfileBuilder />} />
          <Route path="/results" element={<Results />} />
          <Route path="/grants/:id" element={<GrantDetails />} />
          <Route path="/readiness" element={<ReadinessDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
