import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProblemDetail from './pages/ProblemDetail';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/problem/:id" element={<ProblemDetail />} />
      </Routes>
    </div>
  );
}

export default App;