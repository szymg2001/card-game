import React from "react";
import Button from "../components/Button";

export default function Homepage() {
  const [showCodebox, setShowCodebox] = React.useState(false);
  const handleCreate = () => {};

  const handleJoin = () => {};

  const handleSettings = () => {};

  const handleLogout = () => {};

  return (
    <div className="homepage">
      <div className="homepage__menu">
        <Button onClick={handleCreate}>Create game</Button>
        <Button onClick={handleJoin}>Join game</Button>
        <Button onClick={handleSettings}>Settings</Button>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
}
