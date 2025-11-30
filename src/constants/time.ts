export type BaseTime = (time: { base: 'ms' | 's' }) => number;

export const MILLISECOND = 1;
export const SECOND: BaseTime = (time) =>
  time.base === 'ms' ? 1000 * MILLISECOND : 1;
export const MINUTE: BaseTime = (time) => 60 * SECOND(time);
export const HOUR: BaseTime = (time) => 60 * MINUTE(time);
export const DAY: BaseTime = (time) => 24 * HOUR(time);
export const WEEK: BaseTime = (time) => 7 * DAY(time);
export const MONTH: BaseTime = (time) => 30 * DAY(time);

export const TokenExpiredTime = 1 * HOUR({ base: 'ms' });
