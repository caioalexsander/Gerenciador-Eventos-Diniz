export const formatarCNPJ = (value: string): string => {
  const onlyNumbers = value.replace(/\D/g, '');

  if (onlyNumbers.length <= 2) return onlyNumbers;
  if (onlyNumbers.length <= 5) return `${onlyNumbers.slice(0, 2)}.${onlyNumbers.slice(2)}`;
  if (onlyNumbers.length <= 8) {
    return `${onlyNumbers.slice(0, 2)}.${onlyNumbers.slice(2, 5)}.${onlyNumbers.slice(5)}`;
  }
  if (onlyNumbers.length <= 12) {
    return `${onlyNumbers.slice(0, 2)}.${onlyNumbers.slice(2, 5)}.${onlyNumbers.slice(5, 8)}/${onlyNumbers.slice(8)}`;
  }
  return `${onlyNumbers.slice(0, 2)}.${onlyNumbers.slice(2, 5)}.${onlyNumbers.slice(5, 8)}/${onlyNumbers.slice(8, 12)}-${onlyNumbers.slice(12, 14)}`;
};

export const limparCNPJ = (value: string): string => {
  return value.replace(/\D/g, '');
};