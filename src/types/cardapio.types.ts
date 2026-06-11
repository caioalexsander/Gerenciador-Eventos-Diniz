export interface ItemCardapio {
  id: number;
  nome: string;
  categoria: string;
  preco?: number | string;
  descricao?: string;
  // Adicione outros campos que existirem na sua tabela cardapio
}