import type { DefaultRootState } from 'react-redux';
import type { Action, Reducer } from 'redux';

type Names = keyof DefaultRootState;
type State = DefaultRootState[Names];
type Types = `${Names}:mount` | `${Names}:create` | `${Names}:will:update` | `${Names}:update` | `${Names}:will:delete` | `${Names}:delete`;
interface MixedActions {
    type: Types;
    payload: State;
}

export declare const ReduxMixer: (rootname: Names, initialState: State) => Reducer<State, Action<MixedActions>>;