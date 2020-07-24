import React from 'react';
import PropTypes from 'prop-types';
import { ReactLogo } from 'components';
import Styles from './header.scss';

const Header = ({
  title,
  framework,
}) => (
  <header className={Styles.container}>
    <div className={Styles.wrapper}>
      <div className={Styles.title}>
        <ReactLogo />
        <h1>
          <span>{framework}</span>
          <span>{title}</span>
        </h1>
      </div>
    </div>
  </header>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  framework: PropTypes.string.isRequired,
};

export default Header;
