import React from "react";

interface ButtonI {
  onClick: () => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function Button({ onClick, style, children }: ButtonI) {
  return (
    <button className="button" style={{ ...style }} onClick={onClick}>
      {children}
    </button>
  );
}
