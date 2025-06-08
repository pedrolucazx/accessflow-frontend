import {
  CloseIcon,
  HomeIcon,
  LogoutIcon,
  MenuIcon,
  ProfileIcon,
  SettingsIcon,
  UsersIcon,
} from '@/assets/icons';
import { ROUTES } from '@/config/routes';
import { useSession } from '@/hooks/useSession';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './styles.css';

export function Sidebar() {
  const { removeSession } = useSession();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <HomeIcon /> },
    { to: '/usuarios', label: 'Usuários', icon: <UsersIcon /> },
    { to: '/perfis', label: 'Perfis', icon: <ProfileIcon /> },
    { to: '/configuracoes', label: 'Configurações', icon: <SettingsIcon /> },
  ];

  const logout = () => {
    removeSession();
    navigate(ROUTES.NOT_PROTECTED.LOGIN, { replace: true });
  };

  return (
    <>
      {!isOpen && (
        <button
          className="sidebar__toggle sidebar__toggle--open"
          onClick={() => setIsOpen(true)}
        >
          <MenuIcon />
        </button>
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {isOpen && (
          <button
            className="sidebar__toggle sidebar__toggle--close"
            onClick={() => setIsOpen(false)}
          >
            <CloseIcon />
          </button>
        )}

        <div className="sidebar__brand">
          <h1 className="sidebar__title">AccessFlow</h1>
        </div>

        <nav className="sidebar__nav" aria-label="Menu lateral">
          <ul className="nav__list">
            {navItems.map(({ to, label, icon }) => (
              <li className="nav__item" key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `nav__link${isActive ? ' active' : ''}`
                  }
                >
                  <span className="nav__icon" aria-hidden="true">
                    {icon}
                  </span>
                  <span className="nav__text">{label}</span>
                </NavLink>
              </li>
            ))}

            <li className="nav__item">
              <button
                type="button"
                className="nav__link nav__link--logout"
                onClick={logout}
              >
                <span className="nav__icon" aria-hidden="true">
                  <LogoutIcon />
                </span>
                <span className="nav__text">Sair</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
