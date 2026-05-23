export interface FormContrato {
  nome_contratante: string;
  cpf_contratante: string;
  residencia_contratante: string;
  data_evento: string;
  hora_inicio: string;
  hora_fim: string;
  duracao: string;
  local_evento: string;
  tipo_evento: string;
  num_convidados: string;
  preco_por_convidado: string;
  preco_total: string;
  clausula_pagamento: string;
  clausula_texto: string;
  assinatura: string;
  cardapio_selecionado: string[];
  observacoes: string;
}

export interface ContratoParaEditar extends FormContrato {
  id: number;
  pdf_url?: string;
  status?: string;
  created_at?: string;
}