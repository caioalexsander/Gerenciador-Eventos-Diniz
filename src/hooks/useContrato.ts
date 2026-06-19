import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../services/supabase';
import api from '../services/api';
import { FormContrato, ContratoParaEditar } from '../types/contrato.types';
import ContratosService from '../services/contratos.service';
import { compartilharPDF } from '../components/pdf/compartilharPDF';
import CardapioSelector from '../components/forms/contrato/CardapioSelector';
import {StorageService} from '../services/storage.service';
import { limparCPF } from '../utils/formatadores/cpf';
import { limparCNPJ } from '../utils/formatadores/cnpj';
import { ItemCardapio } from '../types/cardapio.types';
import { DraftContrato } from '../utils/contrato/draftContrato';

export const useContrato = (route: any, navigation: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [contratoId, setContratoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftData, setDraftData] = useState<any>(null);
  
  const formInicial: FormContrato = {
  nome_contratante: '',
  tipo_documento_contratante: 'cpf',
  cpf_contratante: '',
  residencia_contratante: '',
  data_evento: '',
  hora_inicio: '',
  hora_fim: '',
  duracao: '',
  local_evento: '',
  tipo_evento: 'Aniversário',
  num_convidados: '',
  preco_por_convidado: '',
  preco_total: '',
  clausula_pagamento: '',
  clausula_texto: '',
  assinatura: 'Digital',
  cardapio_selecionado: [],
  observacoes: '',
  quantidade_garcom: '',
  preco_excedente_convidado: '',
  idade_maxima_criança: '',

  };

  const [tiposEvento, setTiposEvento] = useState<string[]>([]);
  const [clausulasBase, setClausulasBase] = useState<Record<string, string>>({});
  const [itensCardapio, setItensCardapio] = useState<any[]>([]);
  const [cardapioSelecionado, setCardapioSelecionado] = useState<ItemCardapio[]>([]);
  const [form, setForm] = useState<FormContrato>(formInicial);

  // ==================== CARREGAR PARA EDIÇÃO ====================
  useEffect(() => {
    const contratoParaEditar = route.params?.contratoParaEditar as ContratoParaEditar | undefined;

    if (contratoParaEditar) {
      setIsEditing(true);
      setContratoId(contratoParaEditar.id);
      const documentoLimpo = form.tipo_documento_contratante === 'cnpj'
      ? limparCNPJ(form.cpf_contratante)
      : limparCPF(form.cpf_contratante);

      setForm({
        nome_contratante: contratoParaEditar.nome_contratante || '',
        tipo_documento_contratante: (contratoParaEditar.tipo_documento_contratante as 'cpf' | 'cnpj') || 'cpf',  // ← Adicionar
        cpf_contratante: contratoParaEditar.cpf_contratante?.toString() || '',
        residencia_contratante: contratoParaEditar.residencia_contratante || '',
        data_evento: contratoParaEditar.data_evento || '',
        hora_inicio: contratoParaEditar.hora_inicio || '',
        hora_fim: contratoParaEditar.hora_fim || '',
        duracao: contratoParaEditar.duracao || '',
        local_evento: contratoParaEditar.local_evento || '',
        tipo_evento: contratoParaEditar.tipo_evento || '',
        num_convidados: contratoParaEditar.num_convidados?.toString() || '',
        preco_por_convidado: contratoParaEditar.preco_por_convidado?.toString() || '',
        preco_total: contratoParaEditar.preco_total?.toString() || '',
        clausula_pagamento: contratoParaEditar.clausula_pagamento || '',
        clausula_texto: contratoParaEditar.clausula_texto || '',
        assinatura: contratoParaEditar.assinatura || 'Digital',
        cardapio_selecionado: Array.isArray(contratoParaEditar.cardapio_selecionado) 
          ? contratoParaEditar.cardapio_selecionado 
          : [],
        observacoes: contratoParaEditar.observacoes || '',
        quantidade_garcom: contratoParaEditar.quantidade_garcom || '',
        preco_excedente_convidado: contratoParaEditar.preco_excedente_convidado || '',
        idade_maxima_criança: contratoParaEditar.idade_maxima_criança || '',
      });

      setCardapioSelecionado(
        Array.isArray(contratoParaEditar.cardapio_selecionado) 
          ? contratoParaEditar.cardapio_selecionado 
          : []
      );
    }
  }, [route.params]);
  
  // ==================== CARREGAR CLÁUSULAS E TIPOS (só uma vez) ====================
  useEffect(() => {
    const carregarDadosBase = async () => {
      try {
        const { data, error } = await supabase
          .from('modelo_contrato')
          .select('titulo, texto_completo, tipo_de_clausula')
          .or('tipo_de_clausula.eq.C_P,tipo_de_clausula.eq.C_T')
          .order('titulo', { ascending: true });

        if (error) throw error;

        const clausulasMap: Record<string, string> = {};
        const tiposEventoList: string[] = [];

        data?.forEach(item => {
          if (item.tipo_de_clausula === 'C_P') {
            clausulasMap[item.titulo] = item.texto_completo;
          }
          if (item.tipo_de_clausula === 'C_T') {
            tiposEventoList.push(item.titulo);
          }
        });

        setClausulasBase(clausulasMap);
        setTiposEvento(tiposEventoList);

      } catch (e) {
        console.error('Erro ao carregar cláusulas e tipos:', e);
      }
    };

    carregarDadosBase();
  }, []); // ← Sem dependência de isEditing

  // ==================== CARREGAR CARDÁPIO ====================
  useEffect(() => {
    const carregarCardapio = async () => {
      const { data } = await supabase.from('cardapio').select('*').order('nome');
      setItensCardapio(data || []);
    };
    carregarCardapio();
  }, []);

  // ==================== CARREGAR DRAFT AO INICIAR ====================
  useEffect(() => {
    const carregarDraft = async () => {
      // Se estiver editando um contrato existente, não usa draft
      if (route.params?.contratoParaEditar) return;

      const draft = await DraftContrato.carregarDraft();
      if (draft) {
        setDraftData(draft);
        setShowDraftModal(true);
      }
    };

    carregarDraft();
  }, [route.params]);

  useEffect(() => {
    if (!isEditing && Object.values(form).some(v => v !== '' || (Array.isArray(v) && v.length > 0))) {
      DraftContrato.salvarDraft(form, cardapioSelecionado);
    }
  }, [form, cardapioSelecionado, isEditing]);

  // Função para continuar com draft
  const continuarComDraft = () => {
    if (draftData) {
      setForm(draftData.form);
      setCardapioSelecionado(draftData.cardapioSelecionado || []);
    }
    setShowDraftModal(false);
    setDraftData(null);
  };
  
  // Função para começar do zero
  const iniciarDoZero = async () => {
    await DraftContrato.limparDraft();
    setForm(form);
    setCardapioSelecionado([]);
    setShowDraftModal(false);
    setDraftData(null);
  };

  const toggleItem = (item: ItemCardapio) => {
    setCardapioSelecionado(prev =>
      prev.some(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item]
    );
  };

  // ==================== SALVAR CONTRATO ====================
  const salvarContrato = async () => {
    if (
      !form.nome_contratante ||
      !form.cpf_contratante ||
      !form.data_evento ||
      !form.local_evento ||
      !form.num_convidados ||
      !form.preco_por_convidado ||
      !form.preco_total
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);

    try {
      // ✅ CORREÇÃO: Mesclar cardapioSelecionado no form antes de salvar
      const dadosContrato = {
        ...form,
        cardapio_selecionado: cardapioSelecionado,
        status: 'pendente'
      };

      let resultado;
      let contratoSalvo: any;
    
      // ==================== EDIÇÃO: DELETAR PDF ANTIGO ====================
      if (isEditing && contratoId && route.params?.contratoParaEditar?.pdf_url) {
        const pdfUrlAntigo = route.params.contratoParaEditar.pdf_url;
        
        try {
          await StorageService.deletarPDF(pdfUrlAntigo);
        } catch (e) {
          console.warn('Não foi possível deletar o PDF antigo (pode não existir):', e);
        }
      }

      if (isEditing && contratoId) {
        resultado = await ContratosService.atualizarContrato(contratoId, dadosContrato);
        contratoSalvo = resultado;
        Alert.alert('Sucesso', 'Contrato atualizado com sucesso!');
      } else {
        resultado = await ContratosService.criarContrato(dadosContrato);
        contratoSalvo = resultado;
        Alert.alert('Sucesso', 'Contrato criado com sucesso!');
      }

      // ==================== GERAR PDF ====================
      const response = await api.post('/gerar-pdf', {
        ...form,
        id: contratoSalvo.id,
        cardapio_selecionado: cardapioSelecionado,
      });

      if (response.data?.success && response.data?.pdfUrl) {
        const pdfUrl = response.data.pdfUrl;

        await supabase
          .from('contratos')
          .update({ pdf_url: pdfUrl })
          .eq('id', contratoSalvo.id);

        Alert.alert(
          '✅ Sucesso!',
          isEditing ? 'Contrato atualizado e PDF gerado!' : 'Contrato criado e PDF gerado!',
          [
            { text: 'Ver PDF', onPress: () => navigation.navigate('VisualizarPDF', { pdfUrl }) },
            { text: 'Compartilhar', onPress: () => compartilharPDF(pdfUrl) },
            { text: 'OK', style: 'cancel' }
          ]
        );
      }

    } catch (error: any) {
      console.error("Erro ao salvar contrato:", error);
      Alert.alert('Erro', error.message || 'Não foi possível salvar o contrato.');
    } finally {
      setLoading(false);
    }
  };

  return {
    showDraftModal,
    continuarComDraft,
    iniciarDoZero,
    form,
    setForm,
    isEditing,
    contratoId,
    loading,
    tiposEvento,
    clausulasBase,
    itensCardapio,
    cardapioSelecionado,
    toggleItem,
    salvarContrato,
  };
};