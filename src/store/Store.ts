import { makeStore } from "./MakeStore";
import { makeInitialState } from "./State";

export const { useSelector, dispatch } = makeStore(makeInitialState());
