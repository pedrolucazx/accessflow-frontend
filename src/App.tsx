import { Route, BrowserRouter as Router, Routes } from 'react-router';
import { LoginPage } from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
