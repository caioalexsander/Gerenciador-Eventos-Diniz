export const formatarHora = (
  texto: string, 
  campo: 'hora_inicio' | 'hora_fim', 
  setForm: React.Dispatch<React.SetStateAction<any>>
) => {
  let numeros = texto.replace(/\D/g, '').slice(0, 4);

  if (numeros.length >= 3) {
    numeros = numeros.replace(/(\d{2})(\d{1,2})/, '$1:$2');
  }

  setForm((prev: any) => ({ ...prev, [campo]: numeros }));
};