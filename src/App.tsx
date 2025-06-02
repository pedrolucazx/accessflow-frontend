import { Route, BrowserRouter as Router, Routes } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { LoginPage } from './pages/Login';
import { SearchProfiles } from './pages/SearchProfiles';
import { SearchUsers } from './pages/SearchUsers';
import { SignUp } from './pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<SignUp />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/usuarios" element={<SearchUsers />} />
          <Route path="/perfis" element={<SearchProfiles />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
