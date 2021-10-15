import update, { extend } from 'immutability-helper';

extend('$mergeOrUnset', (objectIterator, original) => {
  const copy = { ...original };
  // eslint-disable-next-line no-restricted-syntax
  for (const key in objectIterator) {
    if (objectIterator[key]) {
      copy[key] = true;
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
  update: (state, action, FKey) => update(state, {
    [state.findIndex((s) => s[FKey] === action.payload[FKey])]: {
      $set: action.payload,
    },
  }),
  merge: (state, action, FKey) => state instanceof Array ? {
    [state.findIndex((s) => s[FKey] === action.payload[FKey])]: {
      [prop]: action.payload
    }} : { 
    $merge: action.payload 
  },
  delete: (state, action, FKey) => update(state, (x) => x
    .filter((s) => s[FKey] !== action.payload[FKey])),
  'will:update': (state, action, FKey) => update(state, {
    [state.findIndex((s) => s[FKey] === action.payload[FKey])]: {
      $mergeOrUnset: {
        updating: action.payload.updating,
      },
    },
  }),
  'will:delete': (state, action, FKey) => update(state, {
    [state.findIndex((s) => s[FKey] === action.payload[FKey])]: {
      $mergeOrUnset: {
        deleting: action.payload.deleting,
      },
    },
  }),
};

export function setActions(newActions) {
  defaultActions = newActions;
}

export function extendActions(newActions) {
  defaultActions = { ...defaultActions, ...newActions };
}

export function ReduxMixer(rootname, initialState, options = { }) {
  if(!options.key) options.key = 'uuid';

  const array = Object.keys(defaultActions);
  const events = {};
  for (let index = 0; index < array.length; index++) {
    const nsp = array[index];
    const actionname = [rootname, nsp].join(':');
    events[actionname] = defaultActions[nsp];
  }
  if(options.log){
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
