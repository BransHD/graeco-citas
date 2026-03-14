export type Genero = 'masculino' | 'femenino' | 'otro';
export type TipoSangre = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type EstadoPaciente = 'activo' | 'inactivo';

export interface Paciente {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: string;
  genero: Genero;
  email: string;
  telefono: string;
  telefonoEmergencia?: string;
  contactoEmergencia?: string;
  direccion: string;
  ciudad: string;
  tipoSangre: TipoSangre;
  alergias?: string;
  enfermedadesBase?: string;
  seguroMedico?: string;
  numeroSeguro?: string;
  estado: EstadoPaciente;
  fechaRegistro: string;
  observaciones?: string;
}

export function nombreCompletoPaciente(paciente: Paciente): string {
  return `${paciente.nombres} ${paciente.apellidos}`;
}

export function inicialesPaciente(paciente: Paciente): string {
  return `${paciente.nombres.charAt(0)}${paciente.apellidos.charAt(0)}`.toUpperCase();
}

export function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}
