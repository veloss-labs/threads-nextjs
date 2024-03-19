/* eslint-disable @typescript-eslint/naming-convention */
import React, { useReducer, useMemo } from 'react';
import { createContext } from '~/libs/react/context';
import type { ConfirmModalProps } from './confirm-modal';

enum Action {
  INITIALIZE = 'INITIALIZE',
}

interface InitializeAction {
  type: Action.INITIALIZE;
}

export type ActionType = InitializeAction;

interface ModalContextState {}

interface ModalContext extends ModalContextState {
  initialize: () => void;
  dispatch: React.Dispatch<ActionType>;
}

const initialState: ModalContextState = {};

const [Provider, useModalContext] = createContext<ModalContext>({
  name: 'useModalContext',
  errorMessage: 'useModalContext: "context" is undefined.',
  defaultValue: initialState,
});

// eslint-disable-next-line @typescript-eslint/default-param-last
function reducer(state = initialState, action: ActionType) {
  switch (action.type) {
    case Action.INITIALIZE:
      return initialState;
    default:
      return state;
  }
}

interface Props extends ConfirmModalProps {
  children: React.ReactNode;
}

function ModalContextProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = () => {
    dispatch({ type: Action.INITIALIZE });
  };

  const actions = useMemo(
    () => ({
      ...state,
      initialize,
      dispatch,
    }),
    [state],
  );

  return <Provider value={actions}>{children}</Provider>;
}

export { ModalContextProvider, useModalContext };
