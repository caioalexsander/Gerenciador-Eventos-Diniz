// src/utils/formatadores/display.ts

/**
 * Formata data para exibição (YYYY-MM-DD → DD/MM/YYYY)
 */
export const formatarDataExibicao = (data: string | null | undefined): string => {
  if (!data) return '—';

  try {
    let date: Date;

    if (data.includes('T')) {
      // Já tem hora → usa normal
      date = new Date(data);
    } else {
      // YYYY-MM-DD → força data local (evita shift de timezone)
      const [ano, mes, dia] = data.split('-').map(Number);
      date = new Date(ano, mes - 1, dia); // mês é 0-indexado
    }

    if (isNaN(date.getTime())) return data;

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return data;
  }
};

/**
 * Formata hora para exibição (HHmm ou HH:MM → HH:MM)
 */
export const formatarHoraExibicao = (hora: string | null | undefined): string => {
  if (!hora) return '—';

  // Remove tudo que não for número
  const apenasNumeros = hora.replace(/\D/g, '');

  if (apenasNumeros.length === 4) {
    return `${apenasNumeros.slice(0, 2)}:${apenasNumeros.slice(2, 4)}`;
  }

  if (apenasNumeros.length === 3) {
    return `${apenasNumeros.slice(0, 2)}:${apenasNumeros.slice(2)}0`;
  }

  return hora;
};