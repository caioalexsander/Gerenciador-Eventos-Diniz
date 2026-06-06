export interface EventoCalendario {
  id: string;
  data_evento: string; // formato YYYY-MM-DD
  hora_inicio: string;
  hora_fim: string;
  tipo_evento: string;
  nome_contratante: string;
  pdf_url?: string | null;
  // outros campos que quiser
}