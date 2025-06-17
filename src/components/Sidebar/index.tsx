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
import React, { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './styles.css';

interface navItem {
  to: string;
  label: string;
  adminOnly?: boolean;
  icon: React.ReactNode;
}

export function Sidebar() {
  const navigate = useNavigate();
  const { removeSession, isAdmin } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = useMemo<navItem[]>(
    () =>
      [
        { to: '/', label: 'Dashboard', icon: <HomeIcon /> },
        {
          to: '/usuarios',
          label: 'Usuários',
          icon: <UsersIcon />,
          adminOnly: true,
        },
        {
          to: '/perfis',
          label: 'Perfis',
          icon: <ProfileIcon />,
          adminOnly: true,
        },
        {
          to: '/configuracoes',
          label: 'Configurações',
          icon: <SettingsIcon />,
        },
      ].filter((item) => !item.adminOnly || isAdmin),
    [isAdmin]
  );

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
