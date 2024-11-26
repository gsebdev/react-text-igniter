import React, { useState } from "react";
import "../../styles/ui-component.css";
import Tooltip from "./ToolTip";

const AppButton = ({ type = "primary", children, onClick, disabled = false }) => {
  const className = `button button-${type}`;
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  }

  return (
    <button className={className} onClick={handleClick} disabled={disabled}>
      {children}
    </button>
  );
};

const IconButton = ({ children, onClick, id, toolTip, isActive }) => {
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  }

  return (
    <Tooltip text={toolTip}>
      <style>
        {`
          .toolbarBtnDiv.active {
            background-color: #ddd; /* Highlighted background color */
            border: 1px solid #333; /* Highlighted border */
          }
        `}
      </style>
      <div
        className={`toolbarBtnDiv ${isActive ? "active" : ""}`}
      >
        <button className="toolbarBtn" onClick={handleClick} id={id}>
          {children}
        </button>
      </div>
    </Tooltip>
  );
};

const LinkButton = ({ text, url, onEdit, onDelete }) => {
  const [hover, setHover] = useState(false);

  const handleClickLinkBtn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleClickEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit();
  };

  const handleClickDel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      className="link-button-container"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: "inline-block", position: "relative" }}
    >
      <button className="link-button" onClick={handleClickLinkBtn}>
        {text}
      </button>
    
      {hover && (
        <div
          className="link-options"
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            minWidth: "80px",
            background: "white",
            border: "1px solid #ccc",
            padding: "4px",
          }}
        >
          <button className="toolbarBtn" onClick={onEdit} id="linkEditBtn">
            Edit
          </button>
          <button className="toolbarBtn" onClick={onDelete} id="linkDelBtn">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export { AppButton, IconButton, LinkButton };
