export type EstadoMedico = 'activo' | 'inactivo' | 'vacaciones' | 'licencia';

export interface Medico {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  especialidad: string;
  email: string;
  telefono: string;
  consultorio: string;
  registroMedico: string;
  universidad: string;
  anoGraduacion: number;
  foto?: string;
  estado: EstadoMedico;
  fechaIngreso: string;
}

export function nombreCompletoMedico(medico: Medico): string {
  return `Dr. ${medico.nombres} ${medico.apellidos}`;
}

export function inicialesMedico(medico: Medico): string {
  return `${medico.nombres.charAt(0)}${medico.apellidos.charAt(0)}`.toUpperCase();
}
