import type { MixedReducer, State, Names } from 'react-redux';
declare type PayloadType = {
    [x: string]: any;
    updating?: Boolean;
    deleting?: Boolean;
};
declare type Obj = {
    [x: string]: PayloadType[] | PayloadType;
};
declare module 'react-redux' {
    interface DefaultRootState extends Obj {
    }
    type Names = keyof DefaultRootState;
    type State = DefaultRootState[Names];
    type Types = `${Names}:mount` | `${Names}:create` | `${Names}:will:update` | `${Names}:update` | `${Names}:will:delete` | `${Names}:delete`;
    interface MixedActions {
        type: Types;
        payload: PayloadType;
    }
    type MixedReducer<S = State, A = MixedActions> = (state: S, action: A) => S;
}
export declare const ReduxMixer: (rootname: Names, initialState: State) => MixedReducer<State, import("react-redux").MixedActions>;
export {};
