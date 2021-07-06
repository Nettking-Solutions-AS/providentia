import { DispatchObject, GlobalState } from "../../lib/Types";

// Finds out type of dispatch has been called, and performs the appropriate
// operation with the payload (data)
const Reducer = (state: GlobalState, action: DispatchObject) => {
  switch (action.type) {
    case "SET_STATE":
      return { ...action.payload };
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload };
    default:
      return state;
  }
};

export default Reducer;
