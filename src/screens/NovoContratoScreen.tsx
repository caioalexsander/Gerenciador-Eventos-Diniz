import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { supabase } from '../services/supabase';
import api from '../services/api';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export default function NovoContratoScreen({ navigation, route }: any) {

  const [isEditing, setIsEditing] = useState(false);           // ← ADICIONADO
  const [contratoId, setContratoId] = useState<number | null>(null); // ← ADICIONADO
  
  const [form, setForm] = useState({
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
    cardapio_selecionado: [] as string[],
    observacoes: '',
  });

  // Opções
  const [loading, setLoading] = useState(false);  
  const [tiposEvento, setTiposEvento] = useState<string[]>([]);
  const [clausulasBase, setClausulasBase] = useState<Record<string, string>>({});
  const [loadingClausulas, setLoadingClausulas] = useState(true);

  // ==================== CARREGAR DADOS PARA EDIÇÃO ==================== 
    useEffect(() => {
      const contratoParaEditar = route.params?.contratoParaEditar;
  
      if (contratoParaEditar) {
        setIsEditing(true);
        setContratoId(contratoParaEditar.id);
  
        setForm({
          nome_contratante: contratoParaEditar.nome_contratante || '',
          cpf_contratante: contratoParaEditar.cpf_contratante || '',
          residencia_contratante: contratoParaEditar.residencia_contratante || '',
          data_evento: contratoParaEditar.data_evento || '',
          hora_inicio: contratoParaEditar.hora_inicio || '',
          hora_fim: contratoParaEditar.hora_fim || '',
          duracao: contratoParaEditar.duracao || '',
          local_evento: contratoParaEditar.local_evento || '',
          tipo_evento: contratoParaEditar.tipo_evento || '',
          num_convidados: contratoParaEditar.num_convidados || '',
          preco_por_convidado: contratoParaEditar.preco_por_convidado || '',
          preco_total: contratoParaEditar.preco_total?.toString() || '',
          clausula_pagamento: contratoParaEditar.clausula_pagamento || '',
          clausula_texto: contratoParaEditar.clausula_texto || '',
          assinatura: contratoParaEditar.assinatura || 'Digital',
          cardapio_selecionado: contratoParaEditar.cardapio_selecionado || [],
          observacoes: contratoParaEditar.observacoes || '',
        });
  
        setCardapioSelecionado(contratoParaEditar.cardapio_selecionado || []);
      }
    }, [route.params]);

  // ==================== CARREGAR CLÁUSULAS E TIPOS DE EVENTO ====================
    useEffect(() => {
      const carregarDados = async () => {
        try {
          const { data, error } = await supabase
            .from('modelo_contrato')
            .select('titulo, texto_completo, tipo_de_clausula')
            .or('tipo_de_clausula.eq.C_P,tipo_de_clausula.eq.C_T')   // Busca os dois tipos
            .order('titulo', { ascending: true });

          if (error) {
            console.error('Erro ao carregar dados:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados.');
            return;
          }

          // Separar Cláusulas de Pagamento (C_P)
          const clausulasMap: Record<string, string> = {};
          const tiposEventoList: string[] = [];

          data?.forEach(item => {
            if (item.tipo_de_clausula === 'C_P' && item.titulo && item.texto_completo) {
              clausulasMap[item.titulo] = item.texto_completo;
            }
            if (item.tipo_de_clausula === 'C_T' && item.titulo) {
              tiposEventoList.push(item.titulo);
            }
          });

          setClausulasBase(clausulasMap);
          setTiposEvento(tiposEventoList);

          // Seleciona automaticamente a primeira cláusula de pagamento
          if (!isEditing) {
            if (Object.keys(clausulasMap).length > 0) {
              const primeiraClausula = Object.keys(clausulasMap)[0];
              setForm(prev => ({
                ...prev,
                clausula_pagamento: primeiraClausula,
                clausula_texto: gerarClausula(clausulasMap[primeiraClausula])
              }));
            }

            // Seleciona automaticamente o primeiro tipo de evento
            if (tiposEventoList.length > 0) {
              setForm(prev => ({
                ...prev,
                tipo_evento: tiposEventoList[0]
              }));
            }
          }

        } catch (e) {
          console.error(e);
        } finally {
          setLoadingClausulas(false);
        }
      };

      carregarDados();
    }, [isEditing]);

  const gerarClausula = (texto: string) => {
    return texto.replace('{{preco_total}}', form.preco_total || '0,00');
  };

  const assinaturas = ['Manual', 'Digital'];

  const [itensCardapio, setItensCardapio] = useState<any[]>([]);
  const [cardapioSelecionado, setCardapioSelecionado] = useState<string[]>([]);

  // Carregar cardápio do banco
  useEffect(() => {
  const carregarCardapio = async () => {
  const { data, error } = await supabase.from('cardapio').select('*').order('nome');
      if (!error) setItensCardapio(data || []);
    };
    carregarCardapio();
  }, []);

  const toggleItem = (nome: string) => {
    if (cardapioSelecionado.includes(nome)) {
      setCardapioSelecionado(cardapioSelecionado.filter(item => item !== nome));
    } else {
      setCardapioSelecionado([...cardapioSelecionado, nome]);
    }
  };

  // ==================== SALVAR / ATUALIZAR CONTRATO ====================
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
        
              let contratoSalvo;
        
              if (isEditing && contratoId) {
                // ← MODIFICAÇÃO: Atualização de contrato existente
                const { data, error: supabaseError } = await supabase
                  .from('contratos')
                  .update(dadosContrato)
                  .eq('id', contratoId)
                  .select()
                  .single();
        
                if (supabaseError) throw supabaseError;
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

        // Gerar novo PDF
        const response = await api.post('/gerar-pdf', { 
            ...form, 
            id: contratoSalvo.id ,
            cardapio_selecionado: cardapioSelecionado,
          });
        
        if (response.data.success) {
          const pdfUrl = response.data.pdfUrl;
          
          // ← MODIFICAÇÃO: Atualiza o link do PDF no banco
          await supabase
            .from('contratos')
            .update({ pdf_url: pdfUrl })
            .eq('id', contratoSalvo.id);

          Alert.alert(
            isEditing ? '✅ Contrato Atualizado com Sucesso!' : '✅ Contrato Gerado com Sucesso!',
            `Contrato gerado com sucesso!\n\nURL: ${pdfUrl.substring(0, 60)}...`,
            [
              { text: 'Ver PDF', onPress: () => abrirPDF(pdfUrl) },
              { text: '📤 Compartilhar PDF', onPress: () => compartilharPDF(pdfUrl) },
              { text: 'Fechar', style: 'cancel' }
            ]
          );
        }

      } catch (error: any) {
        console.error(error);
        Alert.alert('Erro', 'Ocorreu um erro ao gerar o PDF.');
      } finally {
        setLoading(false);
      }
    };

  const abrirPDF = (pdfUrl: string) => {
      if (pdfUrl) {
        navigation.navigate('VisualizarPDF', { pdfUrl, contrato: form });
      } else {
        Alert.alert('Aviso', 'Este contrato ainda não possui PDF gerado.');
      }
  };

  const compartilharPDF = async (url: string) => {
    try {
      const fileUri = await downloadPDF(url);
      
      if (fileUri && await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Link do PDF', url);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Link do PDF', url);
    }
  };

  const downloadPDF = async (url: string): Promise<string | null> => {
    try {
      const fileName = `contrato-${Date.now()}.pdf`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      const download = await FileSystem.downloadAsync(url, fileUri);
      return download.uri;
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      return null;
    }
  };

  //FormatarData
  const formatarData = (texto: string) => {
    // remove tudo que não for número
    let numeros = texto.replace(/\D/g, '');

    // limita a 8 dígitos
    numeros = numeros.slice(0, 8);

    // adiciona as barras automaticamente
    if (numeros.length > 4) {
      numeros = numeros.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
    } else if (numeros.length > 2) {
      numeros = numeros.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    }

    setForm({ ...form, data_evento: numeros });

    // valida quando completar
    if (numeros.length === 10) {
      const regexData = /^\d{2}\/\d{2}\/\d{4}$/;

      if (!regexData.test(numeros)) {
        Alert.alert('Data inválida', 'Digite a data no formato DD/MM/AAAA');
        return;
      }

      const [dia, mes, ano] = numeros.split('/').map(Number);

      const data = new Date(ano, mes - 1, dia);

      const dataValida =
        data.getFullYear() === ano &&
        data.getMonth() === mes - 1 &&
        data.getDate() === dia;

      if (!dataValida) {
        Alert.alert('Data inválida', 'A data digitada não existe');
      }
    }
  };

  //Formataçao hora
  const formatarHoraInicio = (texto: string) => {
    // remove tudo que não for número
    let numeros = texto.replace(/\D/g, '');

    // limita a 4 dígitos
    numeros = numeros.slice(0, 4);

    // adiciona :
    if (numeros.length >= 3) {
      numeros = numeros.replace(/(\d{2})(\d{1,2})/, '$1:$2');
    }

    setForm({ ...form, hora_inicio: numeros });

    // valida quando completar
    if (numeros.length === 5) {
      const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;

      if (!regexHora.test(numeros)) {
        Alert.alert('Hora inválida', 'Digite uma hora válida no formato HH:MM');
      }
    }

    // se digitou menos que 4 números e saiu incompleto
    if (numeros.length > 0 && numeros.length < 5) {
      const somenteNumeros = numeros.replace(':', '');

      if (somenteNumeros.length < 4) {
        // opcional: não alerta enquanto digita
      }
    }
  };

  //Formataçao hora
  const formatarHoraFim = (texto: string) => {
    // remove tudo que não for número
    let numeros = texto.replace(/\D/g, '');

    // limita a 4 dígitos
    numeros = numeros.slice(0, 4);

    // adiciona :
    if (numeros.length >= 3) {
      numeros = numeros.replace(/(\d{2})(\d{1,2})/, '$1:$2');
    }

    setForm({ ...form, hora_fim: numeros });

    // valida quando completar
    if (numeros.length === 5) {
      const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;

      if (!regexHora.test(numeros)) {
        Alert.alert('Hora inválida', 'Digite uma hora válida no formato HH:MM');
      }
    }

    // se digitou menos que 4 números e saiu incompleto
    if (numeros.length > 0 && numeros.length < 5) {
      const somenteNumeros = numeros.replace(':', '');

      if (somenteNumeros.length < 4) {
        // opcional: não alerta enquanto digita
      }
    }
  };

  //trabanho caixa ediçao clausula
  const [alturaClausula, setAlturaClausula] = useState(100);
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{isEditing ? 'Editar Contrato' : 'Novo Contrato'} </Text>

      <TextInput style={styles.input} placeholder="Nome da Contratante" value={form.nome_contratante} onChangeText={(t) => setForm({...form, nome_contratante: t})} />
      <TextInput style={styles.input} placeholder="CPF da Contratante" value={form.cpf_contratante} onChangeText={(t) => setForm({...form, cpf_contratante: t})} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Residência da Contratante" value={form.residencia_contratante} onChangeText={(t) => setForm({...form, residencia_contratante: t})} />
      
      <TextInput style={styles.input} placeholder="Data do Evento (DD/MM/AAAA)" value={form.data_evento} onChangeText={formatarData} keyboardType="numeric" maxLength={10} />

      <TextInput style={styles.input} placeholder="Hora Início (HH:MM)" value={form.hora_inicio} onChangeText={formatarHoraInicio} keyboardType="numeric" maxLength={5} onBlur={() => { if (form.hora_inicio.length !== 5) { Alert.alert('Hora inválida', 'Digite a hora completa no formato HH:MM'); }}} />
      <TextInput style={styles.input} placeholder="Hora Fim (HH:MM)" value={form.hora_fim} onChangeText={formatarHoraFim} keyboardType="numeric" maxLength={5} onBlur={() => { if (form.hora_fim.length !== 5) { Alert.alert('Hora inválida', 'Digite a hora completa no formato HH:MM'); }}} />

      <TextInput style={styles.input} placeholder="Duração" value={form.duracao} onChangeText={(t) => setForm({...form, duracao: t})} keyboardType="numeric" />

      <TextInput style={styles.input} placeholder="Local do Evento" value={form.local_evento} onChangeText={(t) => setForm({...form, local_evento: t})} />

      <TextInput style={styles.input} placeholder="Número de Convidados" value={form.num_convidados} onChangeText={(t) => setForm({...form, num_convidados: t})} keyboardType="numeric" />

      <TextInput style={styles.input} placeholder="Preço por Convidado (R$)" value={form.preco_por_convidado} onChangeText={(t) => setForm({...form, preco_por_convidado: t})} keyboardType="numeric" />

      <TextInput style={styles.input} placeholder="Preço Total" value={form.preco_total} onChangeText={(t) => setForm({...form, preco_total: t})} />

      <Text style={styles.label}>Cláusula de Pagamento</Text>

      <Picker
          selectedValue={form.clausula_pagamento}
          enabled={!loadingClausulas}
          onValueChange={(nomeSelecionado) => {
            const textoBase = clausulasBase[nomeSelecionado] || '';
            const novoTexto = gerarClausula(textoBase);

            setForm({
              ...form,
              clausula_pagamento: nomeSelecionado,
              clausula_texto: novoTexto
            });

            const linhas = Math.ceil(novoTexto.length / 35);
            setAlturaClausula(Math.max(100, linhas * 24));
          }}
        >
          {Object.keys(clausulasBase).map(nome => (
            <Picker.Item key={nome} label={nome} value={nome} />
          ))}
        </Picker>

        <TextInput
          style={[
            styles.input,
            {
              minHeight: 100,
              height: alturaClausula,
              textAlignVertical: 'top'
            }
          ]}
          multiline
          placeholder="Texto da cláusula (pode editar)"
          value={form.clausula_texto}
          onChangeText={(t) => setForm({ ...form, clausula_texto: t })}
          onContentSizeChange={(e) => {
            setAlturaClausula(e.nativeEvent.contentSize.height);
          }}
        />

      <Text style={styles.label}>Tipo de Assinatura</Text>
      <Picker selectedValue={form.assinatura} onValueChange={(v) => setForm({...form, assinatura: v})}>
        {assinaturas.map(a => <Picker.Item key={a} label={a} value={a} />)}
      </Picker>   
      
      <Text style={styles.label}>Tipo de Evento</Text>
      <Picker 
        selectedValue={form.tipo_evento}
        enabled={!loadingClausulas}
        onValueChange={(v) => setForm({...form, tipo_evento: v})}
      >
        {tiposEvento.map(t => (
          <Picker.Item key={t} label={t} value={t} />
        ))}
      </Picker>

      <Text style={styles.label}>Cardápio (Selecione os itens)</Text>
      {itensCardapio.length === 0 ? (
        <Text>Carregando cardápio... ou nenhum item cadastrado.</Text>
      ) : (
        itensCardapio.map(item => (
          <View key={item.id} style={styles.checkboxContainer}>
            <Switch
              value={cardapioSelecionado.includes(item.nome)}
              onValueChange={() => toggleItem(item.nome)}
              trackColor={{ false: "#ccc", true: "#4CAF50" }}
            />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.checkboxLabel}>{item.nome}</Text>
              {item.preco && <Text style={{ fontSize: 13, color: '#28A745' }}>R$ {item.preco}</Text>}
              {item.descricao && <Text style={{ fontSize: 12, color: '#666' }}>{item.descricao}</Text>}
            </View>
          </View>
        ))
      )}

      <Button 
        title={loading 
          ? (isEditing ? "Atualizando e Gerando Novo PDF..." : "Salvando e Gerando PDF...") 
          : (isEditing ? "💾 Atualizar Contrato e Gerar Novo PDF" : "💾 Salvar Contrato e Gerar PDF")
        } 
        onPress={salvarContrato} 
        disabled={loading} 
      />

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 12, borderRadius: 8, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  checkboxLabel: { marginLeft: 8, fontSize: 16 }
});