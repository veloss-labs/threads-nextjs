import React, { useMemo, useReducer } from 'react';

import { createContext } from '~/libs/react/context';

enum Action {
  INITIALIZE = 'INITIALIZE',
  FORCE_UPDATE = 'FORCE_UPDATE',
}

interface InitializeAction {
  type: Action.INITIALIZE;
}

interface ForceUpdateAction {
  type: Action.FORCE_UPDATE;
}

export type ActionType = InitializeAction | ForceUpdateAction;

interface RenderContextState {
  symbol: symbol;
}

interface RenderContext extends RenderContextState {
  initialize: () => void;
  forceUpdate: () => void;
  dispatch: React.Dispatch<ActionType>;
}

const initialState: RenderContextState = {
  symbol: Symbol('RenderContext'),
};

const [Provider, useRenderContext] = createContext<RenderContext>({
  name: 'useRenderContext',
  errorMessage: 'useRenderContext: "context" is undefined.',
  defaultValue: initialState,
});

function reducer(state = initialState, action: ActionType) {
  switch (action.type) {
    case Action.INITIALIZE:
      return initialState;
    case Action.FORCE_UPDATE:
      return {
        ...state,
        symbol: Symbol('RenderContext'),
      };
    default:
      return state;
  }
}

interface Props {
  children: React.ReactNode;
}

function RenderContextProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = () => {
    dispatch({ type: Action.INITIALIZE });
  };

  const forceUpdate = () => {
    dispatch({ type: Action.FORCE_UPDATE });
  };

  const actions = useMemo(
    () => ({
      ...state,
      initialize,
      forceUpdate,
      dispatch,
    }),
    [state],
  );

  return <Provider value={actions}>{children}</Provider>;
}

export { RenderContextProvider, useRenderContext };
