export const HTTP_METHODS = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
  PATCH: 'patch',
} as const;

export const STATUS_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UN_AUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGE = {
  [STATUS_CODE.BAD_REQUEST]: {
    EMAIL_EXISTS: '이미 존재하는 이메일입니다.',
    INVALID_DATA: '잘못된 데이터입니다.',
    INVALID_PASSWORD: '비밀번호가 잘못되었습니다.',
    NO_USER: '사용자를 찾을 수 없습니다.',
  },

  [STATUS_CODE.UN_AUTHORIZED]: '로그인을 먼저 진행해주세요.',
  [STATUS_CODE.FORBIDDEN]: '권한이 없습니다.',
  [STATUS_CODE.NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다.',
  [STATUS_CODE.SERVER_ERROR]:
    '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
} as const;
