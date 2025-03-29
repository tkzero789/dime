export const convertToLocalDate = (date: string): Date => {
  const [year, month, day] = date.split("-").map((item) => Number(item));
  return new Date(year, month - 1, day);
};
