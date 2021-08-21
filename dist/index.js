"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReduxMixer = void 0;
const immutability_helper_1 = __importDefault(require("immutability-helper"));
const ReduxMixer = (rootname, initialState) => {
    const reducer = (state = initialState, action) => {
        const name = rootname || action.type.substring(0, action.type.indexOf(':'));
        switch (action.type) {
            case `${name}:mount`:
                return immutability_helper_1.default(state, {
                    $set: action.payload,
                });
            case `${name}:create`:
                return immutability_helper_1.default(state, {
                    $unshift: [action.payload],
                });
            case `${name}:will:update`:
                return immutability_helper_1.default(state, {
                    [state.findIndex((s) => s.uuid === action.payload.uuid)]: {
                        $merge: {
                            updating: action.payload.updating,
                        },
                    },
                });
            case `${name}:update`:
                return immutability_helper_1.default(state, {
                    [state.findIndex((s) => s.uuid === action.payload.uuid)]: {
                        $set: action.payload,
                    },
                });
            case `${name}:will:delete`:
                return immutability_helper_1.default(state, {
                    [state.findIndex((s) => s.uuid === action.payload.uuid)]: {
                        $merge: {
                            deleting: action.payload.deleting,
                        },
                    },
                });
            case `${name}:delete`:
                return immutability_helper_1.default(state, (x) => x.filter((s) => s.uuid !== action.payload.uuid));
            default: return state;
        }
    };
    return reducer;
};
exports.ReduxMixer = ReduxMixer;
//# sourceMappingURL=index.js.map