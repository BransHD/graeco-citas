import { Medico } from './medico.modelo';

export type DiaSemana = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';

export const DIAS_SEMANA: { valor: DiaSemana; etiqueta: string }[] = [
  { valor: 'lunes', etiqueta: 'Lunes' },
  { valor: 'martes', etiqueta: 'Martes' },
  { valor: 'miercoles', etiqueta: 'Miércoles' },
  { valor: 'jueves', etiqueta: 'Jueves' },
  { valor: 'viernes', etiqueta: 'Viernes' },
  { valor: 'sabado', etiqueta: 'Sábado' },
  { valor: 'domingo', etiqueta: 'Domingo' },
];

export interface Horario {
  id: number;
  medicoId: number;
  medico?: Medico;
  consultorio: string;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
  intervaloMinutos: number;
  cupoMaximo: number;
  estado: 'activo' | 'inactivo';
}
