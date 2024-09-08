export const convertStringToNumber = (str: string): number =>
  Number.isNaN(Number(str)) ? 0 : Number(str);
