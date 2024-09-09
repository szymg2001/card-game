import React from "react";
import Input from "../Input";
import Button from "../Button";
import getHeaders from "../../headers";
import { useNavigate } from "react-router-dom";

export default function Codebox({
  setShow,
}: {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");

  const handleJoin = async () => {
    if (code.length !== 6) return setError("Lobby code must have 6 letters.");
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}game/join`,
      {
        method: "POST",
        credentials: "include",
        headers: getHeaders(),
        body: JSON.stringify({ code }),
      }
    );

    if (!response.ok) return; //set error

    const data = await response.json();
    navigate(`/game/${data.gameId}`);
    setShow(false);
  };

  return (
    <div className="codebox">
      <Button onClick={() => setShow(false)}>#Close Icon#</Button>
      <form className="codebox__form">
        <Input
          label="Lobby code:"
          id="code__input"
          onChange={(value) => setCode(value.toString())}
        />
        <Button onClick={handleJoin}>Join</Button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
