import type { DefaultRootState } from 'react-redux';
import type { Action, Reducer } from 'redux';

type Names = keyof DefaultRootState;
type State = Partial<DefaultRootState[Names]>;
type Types = `${Names}:mount` 
        | `${Names}:create` 
        | `${Names}:will:update` 
        | `${Names}:update` 
        | `${Names}:merge` 
        | `${Names}:will:delete` 
        | `${Names}:delete`;
interface MixedActions {
    type: Types;
    payload: State;
}

type ReduxMixerType = (rootname: Names, initialState: State, options?: {
    key?: string
    log?: boolean
}) => Reducer<State, Action<MixedActions>>;
export declare const ReduxMixer: ReduxMixerType;