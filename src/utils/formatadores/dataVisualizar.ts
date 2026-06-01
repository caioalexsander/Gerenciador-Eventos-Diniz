export const formatarDataVisualizar = (data: string | Date | null | undefined): string => {
  if (!data) return '—';

  try {
    const dataObj = typeof data === 'string' ? new Date(data) : data;

    if (isNaN(dataObj.getTime())) return 'Data inválida';

    return dataObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return 'Data inválida';
  }
};