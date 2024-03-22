import React, { useEffect, useReducer, useRef } from "react";
import { xhrMock } from "./xhrMock";

export enum FetchStatus {
  "unknown" = "unknown",
  "loading" = "loading",
  "fulfilled" = "fulfilled",
  "error" = "error",
}

interface State<T> {
  status: FetchStatus;
  data?: T;
  error?: {
    data: Record<string, unknown>;
    status: number;
  };
}

// discriminated union type
type Action<T> =
  | { type: FetchStatus.unknown }
  | { type: FetchStatus.loading }
  | { type: FetchStatus.fulfilled; payload: T }
  | {
      type: FetchStatus.error;
      payload: {
        data: Record<string, unknown>;
        status: number;
      };
    };

// Keep state logic separated
const fetchReducer = <T,>(state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case FetchStatus.unknown:
      return { ...state, status: FetchStatus.unknown };
    case FetchStatus.loading:
      return { ...state, status: FetchStatus.loading };
    case FetchStatus.fulfilled:
      return { ...state, data: action.payload, status: FetchStatus.fulfilled };
    case FetchStatus.error:
      return { ...state, error: action.payload, status: FetchStatus.error };
    default:
      return state;
  }
};

export function useFetch<T>() {
  // Used to prevent state update if the component is unmounted
  const controller = useRef(new AbortController());

  const initialState: State<T> = {
    status: FetchStatus.unknown,
    error: undefined,
    data: undefined,
  };

  const [state, dispatch] = useReducer(fetchReducer<T>, initialState);

  const fetchData = async (url: string) => {
    controller.current.abort();

    controller.current = new AbortController();
    const { signal } = controller.current;

    dispatch({ type: FetchStatus.loading });

    try {
      const response = await xhrMock<T>(url, signal);
      dispatch({ type: FetchStatus.fulfilled, payload: response.data });
    } catch (error) {
      dispatch({
        type: FetchStatus.error,
        payload: { data: error.response.data, status: error.response.status },
      });
    }
  };
  useEffect(() => {
    // Use the cleanup function for avoiding a possibly...
    // ...state update after the component was unmounted

    return () => {
      console.log("aborting!!!!");
      dispatch({ type: FetchStatus.unknown });
      controller.current.abort("request canceled");
    };
  }, []);

  return { state, fetchData };
}
