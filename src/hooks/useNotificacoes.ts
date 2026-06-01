import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { SchedulableTriggerInputTypes } from 'expo-notifications'; // Import necessário

export const useNotificacoes = () => {

  const agendarAlarmeEvento = async (evento: any) => {
    const dataEvento = new Date(evento.data_evento + 'T' + evento.hora_inicio);

    // Alarme 2 dias antes às 09:00
    const doisDiasAntes = new Date(dataEvento);
    doisDiasAntes.setDate(doisDiasAntes.getDate() - 2);
    doisDiasAntes.setHours(9, 0, 0, 0);

    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: `📅 Lembrete: ${evento.tipo_evento}`,
          body: `${evento.nome_contratante}\n${evento.hora_inicio} - ${evento.hora_fim}`,
          data: { eventoId: evento.id, tipo: 'lembrete_evento' },
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DATE,
          date: doisDiasAntes,
        },
      });

      console.log(`Alarme agendado com ID: ${identifier}`);
      return identifier;
    } catch (error) {
      console.error('Erro ao agendar alarme:', error);
    }
  };

  return { agendarAlarmeEvento };
};