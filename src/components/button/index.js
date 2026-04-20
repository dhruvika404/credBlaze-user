import React from 'react';
import styles from './button.module.scss';
import classNames from 'classnames';

export default function Button({ text, disabled, type = 'submit', onClick, lightbutton, iconwithText, icon, danger }) {
  return (
    <div className={classNames(styles.button, lightbutton ? styles.lightbutton : "", iconwithText ? styles.iconwithText : "", danger ? styles.danger : "")}>
      <button type={type} aria-label={text} disabled={disabled} onClick={onClick}>
        {
          icon && (
            <img src={icon} alt={icon} />
          )
        }
        {text}
      </button>
    </div>
  );
}
