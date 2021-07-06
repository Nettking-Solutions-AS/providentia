import React, {
  createContext,
  useContext,
  Dispatch,
  ReactNode,
  useReducer,
} from "react";
import { GlobalState, DispatchObject } from "../../lib/Types";
import Reducer from "./Reducer";

// A wrapper component which holds a global context (eg. global variables)

/*
 * There are two ways to interact with the global state:
 * To use these methods, you need to import the globalState hook in the component:
 * import { useGlobalState } from "../StateManagement/GlobalStateProvider";
 *
 * Then you can access the variable containing the actual state, as well as a method to update the state:
 * const { state, dispatch } = useGlobalState();
 *
 * state - contains the global state, as defined in lib/Types.d.ts
 * Usage: console.log(state.currentUser) --> {id: ..., name: ...}
 *
 * dispatch - a method to update the state. It takes two parameters,
 * type and payload
 * - type is the action you want to perform, eg. SET_CURRENT_USER (Defined in Reducer.tsx)
 * - payload is the thing you want to set, eg. { id: ..., name:... } (a user object)
 * Usage: dispatch({ type: "SET_CURRENT_USER", payload: { id: ..., name: ...}})
 *
 * */
const GlobalStateContext = createContext({
  state: {} as GlobalState,
  dispatch: {} as Dispatch<DispatchObject>,
});

export const emptyState: GlobalState = {
  currentUser: undefined,
  items: [],
};

// The actual wrapper component which makes it possible to access the global context
const GlobalStateProvider = ({
  children,
  initialState = emptyState,
}: {
  children: ReactNode;
  // eslint-disable-next-line react/require-default-props
  initialState?: GlobalState;
}) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// The hook which enables access to the global state
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateContext");
  }
  return context;
};

export default GlobalStateProvider;
