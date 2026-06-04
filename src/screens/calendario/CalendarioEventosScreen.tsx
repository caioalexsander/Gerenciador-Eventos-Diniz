import React from 'react';
import { View, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { useCalendario } from '../../hooks/useCalendario';
import { EventoCalendario } from '../../types/calendario.types';
import { formatarDataExibicao } from '../../utils/formatadores/display';
import { formatarHoraExibicao } from '../../utils/formatadores/display';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const CalendarioEventosScreen = () => {
  const navigation = useNavigation<any>();
  const {
    selectedDate,
    setSelectedDate,
    getEventosByDate,
    getMarkedDates,
  } = useCalendario();

  const eventosDoDia = getEventosByDate(selectedDate);

  const handleDayPress = (dateString: string) => {
  const eventos = getEventosByDate(dateString);
  
  if (eventos.length > 0) {
    navigation.navigate('ListaEventosDiaScreen', {
      date: dateString,
      eventos: eventos,
    });
  } else {
    // Opcional: mostrar feedback
    Alert.alert('Sem eventos', `Nenhum evento marcado para ${formatarDataExibicao(dateString)}`);
    setSelectedDate(dateString);
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Calendário estilo Agenda */}
      <CalendarList
        pastScrollRange={12}
        futureScrollRange={12}
        scrollEnabled
        showScrollIndicator={false}
        horizontal={true}
        pagingEnabled={true}
        calendarWidth={width}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={getMarkedDates()}
        dayComponent={({ date, state }: any) => {
          const eventos = getEventosByDate(date?.dateString || '');
          const isSelected = selectedDate === date?.dateString;
          const isToday = state === 'today';

          return (
            <TouchableOpacity
              onPress={() => setSelectedDate(date?.dateString || '')}
              style={{
                //flex: 1,
                minHeight: 100,
                padding: 6,
                borderRightWidth: 0.5,
                borderBottomWidth: 0.5,
                borderColor: '#e5e7eb',
                backgroundColor: 'white',
              }}
            >
              {/* Número do dia */}
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isSelected ? '#1e40af' : isToday ? '#bfdbfe' : 'transparent',
                }}
              >
                <Text
                  style={{
                    color: isSelected ? '#fff' : isToday ? '#1e40af' : '#111827',
                    fontWeight: '600',
                    fontSize: 16,
                  }}
                >
                  {date?.day}
                </Text>
              </View>

              {/* Mini cards de eventos */}
              <View style={{ marginTop: 6 }}>
                {eventos.slice(0, 2).map((evento: EventoCalendario) => (
                  <View
                    key={evento.id}
                    style={{
                      backgroundColor: '#dbeafe',
                      borderRadius: 4,
                      paddingHorizontal: 6,
                      paddingVertical: 3,
                      marginBottom: 3,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 11.5,
                        color: '#1e40af',
                        fontWeight: '500',
                      }}
                    >
                      {evento.tipo_evento}
                    </Text>
                  </View>
                ))}
                {eventos.length > 2 && (
                  <Text style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
                    +{eventos.length - 2} mais
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        theme={{
          backgroundColor: '#fff',
          calendarBackground: '#fff',
          textMonthFontSize: 32,
          textMonthFontWeight: '700',
          monthTextColor: '#111827',
          textDayHeaderFontSize: 15,
          textSectionTitleColor: '#6b7280',
          todayTextColor: '#1e40af',
        }}
      />
    </View>
  );
};

export default CalendarioEventosScreen;