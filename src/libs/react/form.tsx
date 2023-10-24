'use client';
// @ts-ignore - experimental
import { experimental_useFormState } from 'react-dom';
// @ts-ignore - experimental
import { experimental_useFormStatus, type FormStatus } from 'react-dom';

function useFormState<State, Payload>(
  action: (state: State, payload: Payload) => Promise<State>,
  initialState: State,
  permalink?: string,
): [state: State, dispatch: (payload: Payload) => void] {
  return experimental_useFormState(action, initialState, permalink);
}

function useFormStatus(): FormStatus {
  return experimental_useFormStatus();
}

export { useFormState, useFormStatus };
