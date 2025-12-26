
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useConfig } from '../utils/ConfigContext';

const TopNav = ({ toggleSideNav }) => {
  const { owner, conf, lang } = useConfig();
  const { lang: urlLang } = useParams();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use lang from URL param before mount, then context lang after mount
  const effectiveLang = isMounted || !urlLang ? lang : lang[urlLang] ? { ...lang, [urlLang]: lang[urlLang] } : lang;

  return (
    <nav className="navigation top-nav">
      <div className="navigation-shell">
        <div className="navigation-container">
          <div className="brand-header">
            <div className="side-nav-toggle-btn-container">
              <button className="side-nav-toggle-btn" onClick={toggleSideNav}>
                <i className="fa fa-bars"></i>
              </button>
            </div>
            <div className="brand-header-text">
              <Link to="/">{owner.brand}</Link>
            </div>
          </div>

          <div className="navigation-menu">
            <ul className="nav-menu">
              {/* Simplified top menu, mostly using side nav now as per Jekyll config */}
              {conf.main.side_and_top_nav_buttons.map(btn => (
                <li key={btn.key} className="nav-item">
                  <Link to={btn.key === 'home' ? '/' : `/${btn.key}`}>\
                    <i className={btn.icon}></i> {(effectiveLang[btn.key] || lang[btn.key]).button_name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
