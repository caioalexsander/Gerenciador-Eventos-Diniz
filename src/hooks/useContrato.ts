import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../services/supabase';
import api from '../services/api';
import { FormContrato, ContratoParaEditar } from '../types/contrato.types';
import { compartilharPDF } from '../components/pdf/compartilharPDF';

export const useContrato = (route: any, navigation: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [contratoId, setContratoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingClausulas, setLoadingClausulas] = useState(true);

  const [form, setForm] = useState<FormContrato>({
    nome_contratante: '',
    cpf_contratante: '',
    residencia_contratante: '',
    data_evento: '',
    hora_inicio: '',
    hora_fim: '',
    duracao: '',
    local_evento: '',
    tipo_evento: '',
    num_convidados: '',
    preco_por_convidado: '',
    preco_total: '',
    clausula_pagamento: 'Opção 1',
    clausula_texto: '',
    assinatura: 'Digital',
    cardapio_selecionado: [],
    observacoes: '',
  });

  const [tiposEvento, setTiposEvento] = useState<string[]>([]);
  const [clausulasBase, setClausulasBase] = useState<Record<string, string>>({});
  const [itensCardapio, setItensCardapio] = useState<any[]>([]);
  const [cardapioSelecionado, setCardapioSelecionado] = useState<string[]>([]);

  // ==================== CARREGAR PARA EDIÇÃO ====================
  useEffect(() => {
    const contratoParaEditar = route.params?.contratoParaEditar as ContratoParaEditar | undefined;

    if (contratoParaEditar) {
      setIsEditing(true);
      setContratoId(contratoParaEditar.id);

      setForm({
        nome_contratante: contratoParaEditar.nome_contratante || '',
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
      });

      setCardapioSelecionado(Array.isArray(contratoParaEditar.cardapio_selecionado) 
        ? contratoParaEditar.cardapio_selecionado 
        : []);
    }
  }, [route.params]);

  // ==================== CARREGAR CLÁUSULAS E TIPOS ====================
  useEffect(() => {
    const carregarDados = async () => {
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
          if (item.tipo_de_clausula === 'C_P') clausulasMap[item.titulo] = item.texto_completo;
          if (item.tipo_de_clausula === 'C_T') tiposEventoList.push(item.titulo);
        });

        setClausulasBase(clausulasMap);
        setTiposEvento(tiposEventoList);

        // Preenchimento automático para novo contrato
        if (!isEditing && Object.keys(clausulasMap).length > 0) {
          const primeira = Object.keys(clausulasMap)[0];
          setForm(prev => ({
            ...prev,
            clausula_pagamento: primeira,
            clausula_texto: clausulasMap[primeira].replace('{{preco_total}}', prev.preco_total || '0,00')
          }));
        }
        if (!isEditing && tiposEventoList.length > 0) {
          setForm(prev => ({ ...prev, tipo_evento: tiposEventoList[0] }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingClausulas(false);
      }
    };

    carregarDados();
  }, [isEditing]);

  // ==================== CARREGAR CARDÁPIO ====================
  useEffect(() => {
    const carregarCardapio = async () => {
      const { data } = await supabase.from('cardapio').select('*').order('nome');
      setItensCardapio(data || []);
    };
    carregarCardapio();
  }, []);

  const toggleItem = (nome: string) => {
    setCardapioSelecionado(prev =>
      prev.includes(nome) ? prev.filter(item => item !== nome) : [...prev, nome]
    );
  };

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
      const dadosContrato = {
        ...form,
        preco_total: parseFloat(form.preco_total) || 0,
        cardapio_selecionado: cardapioSelecionado,
        status: 'pendente'
      };

      let contratoSalvo: any;

      if (isEditing && contratoId) {
        console.log("🔄 Atualizando contrato ID:", contratoId); // Debug

        const { data, error: supabaseError } = await supabase
          .from('contratos')
          .update(dadosContrato)
          .eq('id', contratoId)
          .select()
          .single();

        if (supabaseError) {
          console.error("Erro Supabase Update:", supabaseError);
          throw new Error(supabaseError.message);
        }

        contratoSalvo = data;
      } else {
        // Criação de novo contrato
        const { data, error: supabaseError } = await supabase
          .from('contratos')
          .insert(dadosContrato)
          .select()
          .single();

        if (supabaseError) throw supabaseError;
        contratoSalvo = data;
      }

      // Gerar PDF
      const response = await api.post('/gerar-pdf', { 
        ...form, 
        id: contratoSalvo.id,
        cardapio_selecionado: cardapioSelecionado,
      });

      if (response.data.success) {
        const pdfUrl = response.data.pdfUrl;

        // Atualiza o link do PDF
        await supabase
          .from('contratos')
          .update({ pdf_url: pdfUrl })
          .eq('id', contratoSalvo.id);

        Alert.alert(
          isEditing ? '✅ Contrato Atualizado com Sucesso!' : '✅ Contrato Gerado com Sucesso!',
          `PDF gerado com sucesso!`,
          [
            { text: 'Ver PDF', onPress: () => abrirPDF(pdfUrl) },
            { text: '📤 Compartilhar PDF', onPress: () => compartilharPDF(pdfUrl) },
            { text: 'Fechar', style: 'cancel' }
          ]
        );
      }

    } catch (error: any) {
      console.error("Erro ao salvar contrato:", error);
      Alert.alert('Erro', error.message || 'Ocorreu um erro ao salvar o contrato.');
    } finally {
      setLoading(false);
    }
  };

  const abrirPDF = (pdfUrl: string) => {
    if (pdfUrl) {
      navigation.navigate('VisualizarPDF', { 
        pdfUrl, 
        contrato: { 
          ...form, 
          id: contratoId 
        } 
      });
    } else {
      Alert.alert('Aviso', 'Este contrato ainda não possui PDF gerado.');
    }
  };
  
  return {
    form,
    setForm,
    isEditing,
    contratoId,
    loading,
    loadingClausulas,
    tiposEvento,
    clausulasBase,
    itensCardapio,
    cardapioSelecionado,
    setCardapioSelecionado,
    toggleItem,
    salvarContrato,
  };
};