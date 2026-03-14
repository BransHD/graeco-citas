import { Injectable, signal } from '@angular/core';
import { Paciente } from '../models/paciente.modelo';

@Injectable({ providedIn: 'root' })
export class PacienteServicio {
  private _pacientes = signal<Paciente[]>([
    { id: 1, nombres: 'Luis Eduardo', apellidos: 'Vargas Suárez', cedula: '1720000001', fechaNacimiento: '1985-04-12', genero: 'masculino', email: 'lvargas@gmail.com', telefono: '0991111111', telefonoEmergencia: '0992222222', contactoEmergencia: 'Rosa Suárez', direccion: 'Av. Amazonas N24-123', ciudad: 'Quito', tipoSangre: 'O+', alergias: 'Penicilina', enfermedadesBase: 'Hipertensión arterial', seguroMedico: 'IESS', numeroSeguro: 'IESS-2345678', estado: 'activo', fechaRegistro: '2022-01-15' },
    { id: 2, nombres: 'Gabriela', apellidos: 'Morales Andrade', cedula: '1720000002', fechaNacimiento: '1992-08-25', genero: 'femenino', email: 'gmorales@hotmail.com', telefono: '0993333333', contactoEmergencia: 'Pedro Morales', telefonoEmergencia: '0994444444', direccion: 'Calle Juan León Mera N12-45', ciudad: 'Quito', tipoSangre: 'A+', alergias: 'Ninguna', estado: 'activo', fechaRegistro: '2022-03-20' },
    { id: 3, nombres: 'Marco Antonio', apellidos: 'Flores Cabrera', cedula: '1720000003', fechaNacimiento: '1975-11-08', genero: 'masculino', email: 'mflores@yahoo.com', telefono: '0995555555', direccion: 'Av. 6 de Diciembre N45-67', ciudad: 'Quito', tipoSangre: 'B+', enfermedadesBase: 'Diabetes tipo 2, Hipertensión', seguroMedico: 'Seguros Equinoccial', numeroSeguro: 'EQ-789012', estado: 'activo', fechaRegistro: '2021-11-10' },
    { id: 4, nombres: 'Valentina', apellidos: 'Espinoza Rivas', cedula: '1720000004', fechaNacimiento: '1998-02-14', genero: 'femenino', email: 'vespinoza@gmail.com', telefono: '0996666666', direccion: 'Los Pinos Oe3-45', ciudad: 'Quito', tipoSangre: 'AB+', estado: 'activo', fechaRegistro: '2023-05-08' },
  ]);

  readonly pacientes = this._pacientes.asReadonly();

  obtenerTodos(): Paciente[] {
    return this._pacientes();
  }

  obtenerPorId(id: number): Paciente | undefined {
    return this._pacientes().find(p => p.id === id);
  }

  obtenerActivos(): Paciente[] {
    return this._pacientes().filter(p => p.estado === 'activo');
  }

  buscar(termino: string): Paciente[] {
    const t = termino.toLowerCase();
    return this._pacientes().filter(p =>
      p.nombres.toLowerCase().includes(t) ||
      p.apellidos.toLowerCase().includes(t) ||
      p.cedula.includes(t)
    );
  }

  agregar(paciente: Omit<Paciente, 'id'>): Paciente {
    const nuevo: Paciente = { ...paciente, id: Date.now() };
    this._pacientes.update(lista => [...lista, nuevo]);
    return nuevo;
  }

  actualizar(id: number, cambios: Partial<Paciente>): void {
    this._pacientes.update(lista =>
      lista.map(p => p.id === id ? { ...p, ...cambios } : p)
    );
  }

  eliminar(id: number): void {
    this._pacientes.update(lista => lista.filter(p => p.id !== id));
  }
}
