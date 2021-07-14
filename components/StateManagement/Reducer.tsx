import { DispatchObject, GlobalState } from "../../lib/Types";

// Finds out type of dispatch has been called, and performs the appropriate
// operation with the payload (data)
const Reducer = (state: GlobalState, action: DispatchObject) => {
  switch (action.type) {
    case "SET_STATE":
      return { ...action.payload };
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload };
    case "SET_ITEMS":
      return { ...state, items: action.payload };
    case "ADD_ITEM":
      return {
        ...state,
        items: [
          ...(state.items?.filter((item) => item.id !== action.payload.id) ??
            []),
          action.payload,
        ],
      };
    case "TOGGLE_MISSING":
      return {
        ...state,
        items: state.items?.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                status: item.status === "missing" ? "found" : "missing",
              }
            : item
        ),
      };
    default:
      return state;
  }
};

export default Reducer;
