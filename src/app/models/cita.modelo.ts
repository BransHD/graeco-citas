import { Medico } from './medico.modelo';
import { Paciente } from './paciente.modelo';

export type EstadoCita =
  | 'programada'
  | 'confirmada'
  | 'en_curso'
  | 'completada'
  | 'cancelada'
  | 'no_asistio';

export type TipoCita = 'primera_vez' | 'control' | 'urgencia' | 'procedimiento';

export interface Cita {
  id: number;
  pacienteId: number;
  paciente?: Paciente;
  medicoId: number;
  medico?: Medico;
  consultorio?: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  notas?: string;
  diagnostico?: string;
  tipo: TipoCita;
  estado: EstadoCita;
  fechaCreacion: string;
  creadoPor?: string;
}

export const ETIQUETAS_ESTADO_CITA: Record<EstadoCita, string> = {
  programada: 'Programada',
  confirmada: 'Confirmada',
  en_curso: 'En Curso',
  completada: 'Completada',
  cancelada: 'Cancelada',
  no_asistio: 'No Asistió',
};

export const ETIQUETAS_TIPO_CITA: Record<TipoCita, string> = {
  primera_vez: 'Primera Vez',
  control: 'Control',
  urgencia: 'Urgencia',
  procedimiento: 'Procedimiento',
};
