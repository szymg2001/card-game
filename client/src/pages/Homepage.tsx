import React from "react";
import Button from "../components/Button";
import getHeaders from "../headers";
import { useNavigate } from "react-router-dom";
import Codebox from "../components/Homepage/Codebox";

export default function Homepage() {
  const navigate = useNavigate();
  const [showCode, setShowCode] = React.useState(false);

  const handleCreate = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}game/create`,
      { method: "POST", headers: getHeaders(), credentials: "include" }
    );

    if (!response.ok) return; //error

    const data = await response.json();
    navigate(`/game/${data.gameId}`);
  };

  const handleSettings = () => {};

  const handleLogout = () => {};

  return (
    <div className="homepage">
      <div className="homepage__menu">
        <Button onClick={handleCreate}>Create game</Button>
        <Button onClick={() => setShowCode(true)}>Join game</Button>
        <Button onClick={handleSettings}>Settings</Button>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      {showCode && <Codebox setShow={setShowCode} />}
    </div>
  );
}
