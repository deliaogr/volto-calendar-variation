export const GET_RAW_CONTENT = 'GET_RAW_CONTENT';
export const UPDATE_CONTENT = 'UPDATE_CONTENT';

export function rawDataReducer(state = {}, action = {}) {
  let { result, url } = action;

  switch (action.type) {
    case `${GET_RAW_CONTENT}_PENDING`:
      return {
        ...state,
        [url]: {
          ...state[url],
          loading: true,
          loaded: false,
          error: undefined,
        },
      };
    case `${GET_RAW_CONTENT}_SUCCESS`:
      return {
        ...state,
        [url]: {
          ...state[url],
          loading: false,
          loaded: true,
          error: undefined,
          data: result,
        },
      };
    case `${GET_RAW_CONTENT}_FAIL`:
      return {
        ...state,
        [url]: {
          ...state[url],
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    default:
      break;
  }
  return state;
}

export function updateContentReducer(state = {}, action = {}) {
  let { url } = action;

  switch (action.type) {
    case `${UPDATE_CONTENT}_PENDING`:
      return {
        ...state,
        [url]: {
          ...state[url],
          loading: true,
          loaded: false,
          error: undefined,
        },
      };
    case `${UPDATE_CONTENT}_SUCCESS`:
      return {
        ...state,
        [url]: {
          ...state[url],
          loading: false,
          loaded: true,
          error: undefined,
        },
      };
    case `${UPDATE_CONTENT}_FAIL`:
      return {
        ...state,
        [url]: {
          ...state[url],
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    default:
      break;
  }
  return state;
}
