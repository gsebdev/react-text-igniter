import React, { useState } from 'react';
import '../../styles/ui-component.css';
import Tooltip from './ToolTip';

const IconDropDown = ({ items, onChange, icon, id, openRight, toolTip }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleItemClick = (value, e) => {
    e.preventDefault();
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className={`sg-text__icon-dropdown ${openRight ? 'open-right' : ''}`}>
      <Tooltip text={toolTip}>
        <button
          className="sg-text__dropbtn"
          id={id}
          onMouseDown={handleButtonClick}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {icon}
        </button>
      </Tooltip>
      {isOpen && (
        <div className="sg-text__icon-dropdown-content">
          {items.map((item, index) => (
            <div
              key={index}
              className="sg-text__dropdown-item"
              onMouseDown={(e) => handleItemClick(item.value, e)}
            >
              {item.icon && <span className="sg-text__dropdown-icon">{item.icon}</span>}
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { IconDropDown };
