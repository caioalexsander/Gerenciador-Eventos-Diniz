export const formatarMoeda = (valor: number | null | undefined): string => {
  if (valor == null || isNaN(valor)) return 'R$ 0,00';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};