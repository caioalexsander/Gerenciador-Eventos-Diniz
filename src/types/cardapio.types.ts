export interface ItemCardapio {
  id: number;
  nome: string;
  categoria: string;
  descricao?: string;
  preco?: number;
  quantidade?: number;
  // Adicione outros campos que existirem na sua tabela cardapio
}