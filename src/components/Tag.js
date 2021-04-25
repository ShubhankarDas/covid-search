import React, { useState } from "react";
import "./Tag.scss";

export default function Tag({
  name,
  tagState,
  onTagClick = null,
  disableToggle = false,
}) {
  const [enabled, setEnabled] = useState(tagState);

  const onClick = () => {
    if (!disableToggle) setEnabled(!enabled);
    if (onTagClick) onTagClick(name);
  };

  return (
    <div
      className={`tag ${enabled ? "enabled" : ""}`}
      type="button"
      onClick={onClick}
    >
      {name}
    </div>
  );
}
