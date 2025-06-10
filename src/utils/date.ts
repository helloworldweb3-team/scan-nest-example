export const getPreviousDate = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() - 1); // 直接修改日期
  return date;
};