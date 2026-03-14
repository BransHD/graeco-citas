import { Injectable, signal, computed } from '@angular/core';
import { Cita, EstadoCita } from '../models/cita.modelo';

@Injectable({ providedIn: 'root' })
export class CitaServicio {
  private _citas = signal<Cita[]>([
    { id: 1, pacienteId: 1, medicoId: 1, consultorio: '101', fecha: '2026-03-04', horaInicio: '08:00', horaFin: '08:30', motivo: 'Control de presión arterial', notas: 'Paciente con historial de hipertensión', tipo: 'control', estado: 'confirmada', fechaCreacion: '2026-02-28' },
    { id: 2, pacienteId: 2, medicoId: 2, consultorio: '102', fecha: '2026-03-04', horaInicio: '09:00', horaFin: '09:45', motivo: 'Dolor en el pecho, dificultad para respirar', tipo: 'primera_vez', estado: 'programada', fechaCreacion: '2026-03-01' },
    { id: 3, pacienteId: 4, medicoId: 3, consultorio: '103', fecha: '2026-03-05', horaInicio: '08:00', horaFin: '08:30', motivo: 'Control prenatal - segundo trimestre', tipo: 'control', estado: 'programada', fechaCreacion: '2026-03-01' },
    { id: 4, pacienteId: 3, medicoId: 2, consultorio: '102', fecha: '2026-03-06', horaInicio: '09:00', horaFin: '09:45', motivo: 'Seguimiento de arritmia cardíaca', notas: 'Traer resultados de Holter', tipo: 'control', estado: 'confirmada', fechaCreacion: '2026-03-01' },
  ]);

  readonly citas = this._citas.asReadonly();

  readonly resumen = computed(() => {
    const todas = this._citas();
    return {
      total: todas.length,
      programadas: todas.filter(c => c.estado === 'programada').length,
      confirmadas: todas.filter(c => c.estado === 'confirmada').length,
      completadas: todas.filter(c => c.estado === 'completada').length,
      canceladas: todas.filter(c => c.estado === 'cancelada').length,
      noAsistio: todas.filter(c => c.estado === 'no_asistio').length,
      hoy: todas.filter(c => c.fecha === new Date().toISOString().split('T')[0]).length,
    };
  });

  obtenerTodas(): Cita[] {
    return this._citas();
  }

  obtenerPorId(id: number): Cita | undefined {
    return this._citas().find(c => c.id === id);
  }

  obtenerPorFecha(fecha: string): Cita[] {
    return this._citas().filter(c => c.fecha === fecha);
  }

  obtenerPorMedico(medicoId: number): Cita[] {
    return this._citas().filter(c => c.medicoId === medicoId);
  }

  obtenerPorPaciente(pacienteId: number): Cita[] {
    return this._citas().filter(c => c.pacienteId === pacienteId);
  }

  agregar(cita: Omit<Cita, 'id' | 'fechaCreacion'>): Cita {
    const nueva: Cita = {
      ...cita,
      id: Date.now(),
      fechaCreacion: new Date().toISOString().split('T')[0],
    };
    this._citas.update(lista => [...lista, nueva]);
    return nueva;
  }

  actualizar(id: number, cambios: Partial<Cita>): void {
    this._citas.update(lista =>
      lista.map(c => c.id === id ? { ...c, ...cambios } : c)
    );
  }

  cambiarEstado(id: number, estado: EstadoCita): void {
    this.actualizar(id, { estado });
  }

  eliminar(id: number): void {
    this._citas.update(lista => lista.filter(c => c.id !== id));
  }
}
