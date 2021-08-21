import type { MixedReducer, State } from 'redux';
declare type PayloadType = {
    [x: string]: any;
    updating?: Boolean;
    deleting?: Boolean;
};
declare type Obj = {
    [x: string]: PayloadType[] | PayloadType;
};
declare module 'redux' {
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
    interface DefaultRootState {
        user: {
            id: Number;
        };
    }
}
export declare const ReduxMixer: (rootname: String, initialState: State) => MixedReducer<State, import("redux").MixedActions>;
export {};
