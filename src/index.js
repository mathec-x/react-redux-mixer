import update from 'immutability-helper';

update.extend('$mergeOrUnset', (objectIterator, original) => {
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

if (!Array.prototype.update) {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Array.prototype, 'update', {
    value(object) {
      return update(this, object);
    },
  });
}

if (!Object.prototype.update) {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Object.prototype, 'update', {
    value(object) {
      return update(this, object);
    },
  });
}

export const ReduxMixer = (rootname, initialState, defineYourFkKey = "uuid") => {
  const reducer = (state = initialState, action) => {
    const name = rootname || action.type.substring(0, action.type.indexOf(':'));

    switch (action.type) {
      case `${name}:mount`:
        return state.update({
          $set: action.payload,
        });

      case `${name}:create`:
        return state.update({
          $unshift: [action.payload],
        });

      case `${name}:will:update`:
        return state.update({
          [state.findIndex((s) => s[defineYourFkKey] === action.payload[defineYourFkKey])]: {
            $mergeOrUnset: {
              updating: action.payload.updating,
            },
          },
        });

      case `${name}:update`:
        return state.update({
          [state.findIndex((s) => s[defineYourFkKey] === action.payload[defineYourFkKey])]: {
            $set: action.payload,
          },
        });

      case `${name}:will:delete`:
        return state.update({
          [state.findIndex((s) => s[defineYourFkKey] === action.payload[defineYourFkKey])]: {
            $mergeOrUnset: {
              delete: action.payload.delete,
            },
          },
        });

      case `${name}:delete`:
        return state.update((x) => x.filter((s) => s[defineYourFkKey] !== action.payload[defineYourFkKey]));

      default: return state;
    }
  };

  return reducer;
};
