import { useMemo, useReducer } from 'react';
import { createContext } from '~/libs/react/context';

enum Action {
  FORCED_UPDATE = 'FORCED_UPDATE',
  CHANGE_DATA_KEY = 'CHANGE_DATA_KEY',
}

type ForcedUpdateAction = {
  type: Action.FORCED_UPDATE;
};

type ChangeDataKeyAction = {
  type: Action.CHANGE_DATA_KEY;
  payload: {
    dataKey: symbol;
  };
};

type AppAction = ForcedUpdateAction | ChangeDataKeyAction;

interface AppState {
  renderObject: Record<string, any>;
  dataKey: symbol;
}

interface AppContext extends AppState {
  forcedUpdate: () => void;
  changeDataKey: (dataKey: symbol) => void;
  dispatch: React.Dispatch<AppAction>;
}

const initialState: AppState = {
  renderObject: {},
  dataKey: Symbol(),
};

const [Provider, useAppContext] = createContext<AppContext>({
  name: 'useAppContext',
  errorMessage: 'useAppContext: `context` is undefined.',
  defaultValue: initialState,
});

interface Props {
  children: React.ReactNode;
}

function reducer(state = initialState, action: AppAction) {
  switch (action.type) {
    case Action.FORCED_UPDATE:
      return {
        ...state,
        renderObject: {},
      };
    case Action.CHANGE_DATA_KEY:
      return {
        ...state,
        dataKey: action.payload.dataKey,
      };
    default:
      return state;
  }
}

function AppProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const forcedUpdate = () => {
    dispatch({ type: Action.FORCED_UPDATE });
  };

  const changeDataKey = (dataKey: symbol) => {
    dispatch({ type: Action.CHANGE_DATA_KEY, payload: { dataKey } });
  };

  const actions = useMemo(
    () => ({
      ...state,
      forcedUpdate,
      changeDataKey,
      dispatch,
    }),
    [state],
  );

  return <Provider value={actions}>{children}</Provider>;
}

export { AppProvider, useAppContext };
