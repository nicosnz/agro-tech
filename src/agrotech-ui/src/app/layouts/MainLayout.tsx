import { useState } from "react";
import { Outlet, NavLink } from "react-router";
import styles from "./MainLayout.module.css";
import {
  Beef,
  Scale,
  Wheat,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const navItems: { to: string; label: string; icon: React.ReactNode }[] = [
  { to: "/ganado",        label: "Ganado",        icon: <Beef size={18} /> },
  { to: "/pesajes",       label: "Pesajes",        icon: <Scale size={18} /> },
  { to: "/alimentacion",      label: "Alimentación",   icon: <Wheat size={18} /> },
];

export const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.layout}>
      <aside
        className={`${styles.sidebar} ${collapsed ? styles["sidebar--collapsed"] : styles["sidebar--expanded"]}`}
      >
        <div className={styles["sidebar__header"]}>
          {!collapsed && (
            <div className={styles["sidebar__logo"]}>
              <div className={styles["sidebar__logo-icon"]}>
                <Beef size={22} color="#fff" />
              </div>
              <div>
                <p className={styles["sidebar__logo-name"]}>AgroTech</p>
                <p className={styles["sidebar__logo-subtitle"]}>Gestión Ganadera</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className={`${styles["sidebar__logo-icon"]} ${styles["sidebar__logo-icon--sm"]}`}>
              <Beef size={18} color="#fff" />
            </div>
          )}
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} className={styles["sidebar__toggle"]}>
              <X size={16} />
            </button>
          )}
        </div>

        {collapsed && (
          <button onClick={() => setCollapsed(false)} className={styles["sidebar__expand-btn"]}>
            <Menu size={18} />
          </button>
        )}

        <nav className={styles["sidebar__nav"]}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                [
                  styles["sidebar__nav-item"],
                  isActive  ? styles["sidebar__nav-item--active"]   : "",
                  collapsed ? styles["sidebar__nav-item--collapsed"] : "",
                ].join(" ")
              }
            >
              <span className={styles["sidebar__nav-icon"]}>{item.icon}</span>
              {!collapsed && (
                <>
                  <span className={styles["sidebar__nav-label"]}>{item.label}</span>
                  <ChevronRight size={14} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {!collapsed && (
          <div className={styles["sidebar__footer"]}>
            <div className={styles["sidebar__user"]}>
              <div className={styles["sidebar__user-avatar"]}>JR</div>
              <div>
                <p className={styles["sidebar__user-name"]}>Juan Ramírez</p>
                <p className={styles["sidebar__user-role"]}>Administrador</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className={styles["layout__content"]}>
        <Outlet />
      </main>

      <nav className={styles["bottom-nav"]}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [styles["bottom-nav__item"], isActive ? styles["bottom-nav__item--active"] : ""].join(" ")
            }
          >
            <span className={styles["bottom-nav__icon"]}>{item.icon}</span>
            <span className={styles["bottom-nav__label"]}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
