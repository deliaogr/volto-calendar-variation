export const GET_RAW_CONTENT = 'GET_RAW_CONTENT';
export const UPDATE_CONTENT = 'UPDATE_CONTENT';

export function getRawContent(url, headers = {}) {
  return {
    type: GET_RAW_CONTENT,
    request: {
      op: 'get',
      path: url,
      headers,
    },
    url,
  };
}

export function updateContent(url, headers = {}, data) {
  return {
    type: UPDATE_CONTENT,
    request: {
      op: 'patch',
      path: url,
      headers,
      data,
    },
    url,
  };
}
