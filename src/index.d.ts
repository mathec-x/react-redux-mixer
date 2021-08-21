import type { CustomCommands, Spec } from 'immutability-helper';
import type { DefaultRootState } from 'react-redux';
import type { Action, Reducer } from 'redux';

type Names = keyof DefaultRootState;
type State = DefaultRootState[Names];
type Types = `${Names}:mount` | `${Names}:create` | `${Names}:will:update` | `${Names}:update` | `${Names}:will:delete` | `${Names}:delete`;
interface MixedActions {
    type: Types;
    payload: State;
}

declare global {
    interface Object {
        update: <E = Object, C extends CustomCommands<object> = never>(object: E, $spec: Spec<E, C>) => E
    }
    interface Array<T> {
        update: <E = T, C extends CustomCommands<object> = never>(object: E, $spec: Spec<E, C>) => E
    }
}

type ReduxMixerType = (rootname: Names, initialState: State, defineYourFkKey?: String | "uuid" | "id") => Reducer<State, Action<MixedActions>>;
export declare const ReduxMixer: ReduxMixerType;