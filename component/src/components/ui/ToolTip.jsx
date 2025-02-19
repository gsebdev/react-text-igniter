import React from 'react';
import '../../styles/ui-component.css';

const Tooltip = ({ text, children }) => {
  return text ? (
    <div className="sg-text__tooltip-container">
      <div className="sg-text__tooltip">{text}</div>
      {children}
    </div>
  ) : (
    <></>
  );
};

export default Tooltip;
