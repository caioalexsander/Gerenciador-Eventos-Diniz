import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useCalendario } from '../../hooks/useCalendario';
import { useNotificacoes } from '../../hooks/useNotificacoes';
import { EventoCalendario } from '../../types/calendario.types';
import { formatarDataVisualizar } from '../../utils/formatadores/dataVisualizar';
import { formatarHora } from '../../utils/formatadores/hora';

const CalendarioEventosScreen = () => {
  const {
    loading,
    selectedDate,
    setSelectedDate,
    getEventosByDate,
    getMarkedDates,
    getEventosFuturos,
  } = useCalendario();

  const { agendarAlarmeEvento } = useNotificacoes();

  const eventosDoDia = getEventosByDate(selectedDate);

  const agendarAlarmes = async () => {
    const eventosFuturos = getEventosFuturos();
    if (eventosFuturos.length === 0) {
      Alert.alert('Aviso', 'Não há eventos futuros.');
      return;
    }

    try {
      for (const evento of eventosFuturos) {
        await agendarAlarmeEvento(evento);
      }
      Alert.alert('Sucesso', `${eventosFuturos.length} alarmes agendados!`);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao agendar alarmes.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={getMarkedDates()}
        theme={{
          todayTextColor: '#3b82f6',
          selectedDayBackgroundColor: '#3b82f6',
        }}
      />

      {selectedDate && (
        <ScrollView style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
            Eventos em {formatarDataVisualizar(selectedDate)} {/* Ajustado */}
          </Text>

          {eventosDoDia.length > 0 ? (
            eventosDoDia.map((evento: EventoCalendario) => (
              <TouchableOpacity
                key={evento.id}
                style={{
                  backgroundColor: 'white',
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 12,
                  elevation: 3,
                }}
                onPress={() =>
                  Alert.alert(
                    'Detalhes',
                    `${evento.tipo_evento}\n${evento.nome_contratante}\n${evento.hora_inicio}\n${evento.hora_fim}`
                  )
                }
              >
                <Text style={{ fontWeight: '600', fontSize: 16 }}>{evento.tipo_evento}</Text>
                <Text style={{ color: '#374151' }}>{evento.nome_contratante}</Text>
                <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                  {evento.hora_inicio} - {evento.hora_fim}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 40 }}>
              Nenhum evento nesta data.
            </Text>
          )}
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={agendarAlarmes}
        style={{
          backgroundColor: '#f59e0b',
          margin: 16,
          padding: 16,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Agendar Alarmes (2 dias antes)
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CalendarioEventosScreen;