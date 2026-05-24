import { supabase } from './supabase';
import api from './api';
import { FormContrato, ContratoParaEditar } from '../types/contrato.types';

export class ContratosService {

  // ==================== CRIAR NOVO CONTRATO ====================
  static async criarContrato(form: FormContrato) {
    try {
      const dadosContrato = {
        nome_contratante: form.nome_contratante.trim(),
        cpf_contratante: form.cpf_contratante,
        residencia_contratante: form.residencia_contratante.trim(),
        data_evento: form.data_evento,
        hora_inicio: form.hora_inicio,
        hora_fim: form.hora_fim,
        duracao: form.duracao,
        local_evento: form.local_evento.trim(),
        tipo_evento: form.tipo_evento,
        num_convidados: parseInt(form.num_convidados) || 0,
        preco_por_convidado: parseFloat(String(form.preco_por_convidado).replace(',', '.')) || 0,
        preco_total: parseFloat(String(form.preco_total).replace(',', '.')) || 0,
        clausula_pagamento: form.clausula_pagamento,
        clausula_texto: form.clausula_texto,
        assinatura: form.assinatura,
        cardapio_selecionado: form.cardapio_selecionado || [],   // ← Usa o que vem do form
        observacoes: form.observacoes?.trim() || '',
        status: 'pendente',
      };

      const { data, error } = await supabase
        .from('contratos')
        .insert(dadosContrato)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erro ao criar contrato:', error);
      throw new Error(error.message || 'Não foi possível criar o contrato');
    }
  }

  // ==================== ATUALIZAR CONTRATO ====================
  static async atualizarContrato(id: number, form: FormContrato) {
    try {
      const dadosContrato = {
        nome_contratante: form.nome_contratante.trim(),
        cpf_contratante: form.cpf_contratante,
        residencia_contratante: form.residencia_contratante.trim(),
        data_evento: form.data_evento,
        hora_inicio: form.hora_inicio,
        hora_fim: form.hora_fim,
        duracao: form.duracao,
        local_evento: form.local_evento.trim(),
        tipo_evento: form.tipo_evento,
        num_convidados: parseInt(form.num_convidados) || 0,
        preco_por_convidado: parseFloat(String(form.preco_por_convidado).replace(',', '.')) || 0,
        preco_total: parseFloat(String(form.preco_total).replace(',', '.')) || 0,
        clausula_pagamento: form.clausula_pagamento,
        clausula_texto: form.clausula_texto,
        assinatura: form.assinatura,
        cardapio_selecionado: form.cardapio_selecionado || [],   // ← Usa o que vem do form
        observacoes: form.observacoes?.trim() || '',
      };

      const { data, error } = await supabase
        .from('contratos')
        .update(dadosContrato)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar contrato:', error);
      throw new Error(error.message || 'Não foi possível atualizar o contrato');
    }
  }

  // ==================== LISTAR TODOS OS CONTRATOS ====================
  static async listarContratos() {
    try {
      const { data, error } = await supabase
        .from('contratos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Erro ao listar contratos:', error);
      throw error;
    }
  }

  // ==================== BUSCAR CONTRATO POR ID ====================
  static async buscarPorId(id: number) {
    try {
      const { data, error } = await supabase
        .from('contratos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Erro ao buscar contrato por ID:', error);
      throw error;
    }
  }

  // ==================== DELETAR CONTRATO ====================
  static async deletarinfodb(id: number) {
    try {
      const { error } = await supabase
        .from('contratos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Erro ao deletar contrato:', error);
      throw error;
    }
  }

  // ==================== GERAR PDF ====================
  static async gerarPDF(contrato: any) {
    try {
      const response = await api.post('/gerar-pdf', {   // ← Aqui está o endpoint correto!
        ...contrato,
        cardapio_selecionado: contrato.cardapio_selecionado || [],
      });

      return response.data?.pdfUrl || response.data?.url;
    } catch (error: any) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  }
  
  // ==================== ATUALIZAR STATUS ====================
  static async atualizarStatus(id: number, status: string) {
    try {
      const { error } = await supabase
        .from('contratos')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  }
}

export default ContratosService;