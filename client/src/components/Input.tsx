import React from "react";

interface InputI {
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  onChange: (arg: string | number) => void;
  id: string;
  labelStyles?: React.CSSProperties;
  inputStyles?: React.CSSProperties;
}

export default function Input({
  label,
  type = "text",
  onChange,
  id,
  labelStyles,
  inputStyles,
}: InputI) {
  return (
    <div className="input">
      {label && (
        <label htmlFor={id} className="input__label" style={{ ...labelStyles }}>
          {label}
        </label>
      )}
      <input
        style={{ ...inputStyles }}
        id={id}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="input__input"
      />
    </div>
  );
}
