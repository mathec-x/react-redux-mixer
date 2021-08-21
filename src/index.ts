import update from 'immutability-helper';
import type { MixedReducer, State } from 'redux';

type PayloadType = {
    [x: string]: any;
    updating?: Boolean;
    deleting?: Boolean
}

type Obj = { [x: string]: PayloadType[] | PayloadType }

declare module 'redux' {
    export interface DefaultRootState extends Obj { }
    export type Names = keyof DefaultRootState;
    export type State = DefaultRootState[Names];
    export type Types = `${Names}:mount`
        | `${Names}:create`
        | `${Names}:will:update`
        | `${Names}:update`
        | `${Names}:will:delete`
        | `${Names}:delete`
    export interface MixedActions {
        type: Types
        payload: PayloadType
    }
    export type MixedReducer<S = State, A = MixedActions> = (state: S, action: A) => S;
    export interface DefaultRootState {
        user: {
            id: Number
        }
    }
}

// extend<object>('$mergeOrUnset', (
//     objectIterator,
//     original: object) => {

//     const copy = { ...original };

//     for (const key in objectIterator) {
//         if (objectIterator[key]) {
//             copy[key] = objectIterator[key];
//         } else {
//             delete copy[key];
//         }
//     }
//     return copy;
// });

export const ReduxMixer = (
    rootname: String,
    initialState: State) => {

    const reducer: MixedReducer = (state = initialState, action) => {

        const name = rootname || action.type.substring(0, action.type.indexOf(':'));

        switch (action.type) {
            case `${name}:mount`:
                return update(state, {
                    $set: action.payload,
                });

            case `${name}:create`:
                return update(state, {
                    $unshift: [action.payload],
                });

            case `${name}:will:update`:
                return update(state, {
                    [state.findIndex((s: PayloadType) => s.uuid === action.payload.uuid)]: {
                        $merge: {
                            updating: action.payload.updating,
                        },
                    },
                });

            case `${name}:update`:
                return update(state, {
                    [state.findIndex((s: PayloadType) => s.uuid === action.payload.uuid)]: {
                        $set: action.payload,
                    },
                });

            case `${name}:will:delete`:
                return update(state, {
                    [state.findIndex((s: PayloadType) => s.uuid === action.payload.uuid)]: {
                        $merge: {
                            deleting: action.payload.deleting,
                        },
                    },
                });

            case `${name}:delete`:
                return update(state, (x: PayloadType[]) =>  x.filter((s) => s.uuid !== action.payload.uuid));

            default: return state;
        }
    };

    return reducer;
};