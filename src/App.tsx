import { Route, BrowserRouter as Router, Routes } from 'react-router';
import { LoginPage } from './pages/Login';
import { SignUp } from './pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
