import update, { extend } from 'immutability-helper';

extend('$mergeOrUnset', (objectIterator, original) => {
  const copy = { ...original };
  // eslint-disable-next-line no-restricted-syntax
  for (const key in objectIterator) {
    if (objectIterator[key]) {
      copy[key] = objectIterator[key];
    } else {
      delete copy[key];
    }
  }
  return copy;
});

let defaultActions = {
  mount: (state, action) => update(state, {
    $set: action.payload,
  }),
  create: (state, action) => update(state, {
    $unshift: [action.payload],
  }),
  update: (state, action, FKey) => {
    const actix = state.findIndex((s) => s[FKey] === action.payload[FKey]);
    if (actix !== -1)
      return update(state, {
        [actix]: {
          $set: action.payload,
        },
      })
    return state;
  },
  merge: (state, action, FKey) => {
    const actix = state.findIndex((s) => s[FKey] === action.payload[FKey]);
    if (actix !== -1) {
      return update(state, {
        [actix]: {
          $set: {
            ...state[actix],
            ...action.payload
          }
        }
      })
    }
    return state;
  },
  delete: (state, action, FKey) => update(state, (x) => x
    .filter((s) => s[FKey] !== action.payload[FKey])),
  'will:update': (state, action, FKey) => {
    const actix = state.findIndex((s) => s[FKey] === action.payload[FKey]);
    if (actix !== -1)
      return update(state, {
        [actix]: {
          $mergeOrUnset: {
            updating: action.payload.updating,
          },
        },
      });
    return state
  },
  'will:delete': (state, action, FKey) => {
    const actix = state.findIndex((s) => s[FKey] === action.payload[FKey]);
    if (actix !== -1)
      return update(state, {
        [actix]: {
          $mergeOrUnset: {
            deleting: action.payload.deleting,
          },
        },
      });
    return state
  },
};

export function setActions(newActions) {
  defaultActions = newActions;
}

export function extendActions(newActions) {
  defaultActions = { ...defaultActions, ...newActions };
}

export function ReduxMixer(rootname, initialState, options = {}) {
  if (!options.key) options.key = 'uuid';

  const array = Object.keys(defaultActions);
  const events = {};
  for (let index = 0; index < array.length; index++) {
    const nsp = array[index];
    const actionname = [rootname, nsp].join(':');
    events[actionname] = defaultActions[nsp];
  }
  if (options.log) {
    console.log(events);
  }
  function reducer(state = initialState, action) {
    if (events[action.type]) {
      return events[action.type](state, action, options.key);
    }

    return state;
  }
  return reducer;
}
