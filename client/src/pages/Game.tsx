import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { getGame } from "../store/gameSlice";

export default function Game() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const game = useSelector((state: RootState) => state.game);

  React.useEffect(() => {
    dispatch(getGame(id || ""));
  }, [id]);

  return <div className="game"></div>;
}
