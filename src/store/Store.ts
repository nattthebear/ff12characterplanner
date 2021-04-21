import { makeStore } from "./MakeStore";
import { makeInitialState } from "./State";

export const { useStore, dispatch } = makeStore(makeInitialState());
