import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { getGame } from "../store/gameSlice";
import Button from "../components/Button";

export default function Game() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const game = useSelector((state: RootState) => state.game);

  const handleStart = () => {};
  const handleLeave = () => {};

  React.useEffect(() => {
    dispatch(getGame(id || ""));
  }, [id]);

  return (
    <div className="game">
      <ul className="game__users">
        {game.data?.users.map((user) => (
          <li className="game__user">{user.username}</li>
        ))}
      </ul>
      <Button onClick={handleStart}>Start</Button>
      <Button onClick={handleLeave}>Leave</Button>
    </div>
  );
}
