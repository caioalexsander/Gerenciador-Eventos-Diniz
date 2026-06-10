export const formatarCPF = (value: string): string => {
  // Remove tudo que não for número
  const onlyNumbers = value.replace(/\D/g, '');

  if (onlyNumbers.length <= 3) return onlyNumbers;
  if (onlyNumbers.length <= 6) return `${onlyNumbers.slice(0, 3)}.${onlyNumbers.slice(3)}`;
  if (onlyNumbers.length <= 9) {
    return `${onlyNumbers.slice(0, 3)}.${onlyNumbers.slice(3, 6)}.${onlyNumbers.slice(6)}`;
  }
  return `${onlyNumbers.slice(0, 3)}.${onlyNumbers.slice(3, 6)}.${onlyNumbers.slice(6, 9)}-${onlyNumbers.slice(9, 11)}`;
};

export const limparCPF = (value: string): string => {
  return value.replace(/\D/g, '');
};