import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ROUTES } from './config/routes';
import { Home } from './pages/Home';
import { LoginPage } from './pages/Login';
import { SearchProfiles } from './pages/SearchProfiles';
import { SearchUsers } from './pages/SearchUsers';
import { Settings } from './pages/Settings';
import { SignUp } from './pages/Signup';

function App() {
  return (
    <Routes>
      <Route path={ROUTES.NOT_PROTECTED.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.NOT_PROTECTED.REGISTER} element={<SignUp />} />
      <Route element={<Layout />}>
        <Route path={ROUTES.PROTECTED.HOME} element={<Home />} />
        <Route path={ROUTES.PROTECTED.USERS} element={<SearchUsers />} />
        <Route path={ROUTES.PROTECTED.PROFILES} element={<SearchProfiles />} />
        <Route path={ROUTES.PROTECTED.SETTINGS} element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
