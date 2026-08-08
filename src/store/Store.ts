import { makeStore } from "./MakeStore.ts";
import { makeInitialState } from "./State.ts";

export const { useStore, dispatch } = makeStore(makeInitialState());
