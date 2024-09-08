import React from "react";
import Input from "../Input";
import Button from "../Button";

export default function Codebox() {
  const [show, setShow] = React.useState(false);
  const [code, setCode] = React.useState("");

  const handleJoin = () => {};

  return (
    <div className="codebox">
      <form className="codebox__form">
        <Input
          label="Lobby code:"
          id="code__input"
          onChange={(value) => setCode(value.toString())}
        />
        <Button onClick={handleJoin}>Join</Button>
      </form>
    </div>
  );
}
