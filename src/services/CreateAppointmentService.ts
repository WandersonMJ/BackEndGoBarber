import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/appointment';
import AppointmentsRepository from '../repositories/appointmentsRepository';
import AppError from '../errors/AppError';

interface RequestDTO {
  date: Date;
  provider_id: string;
}

class CreateAppointmentService {
  public async execute({
    date,
    provider_id,
  }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const AppointmentDate = startOfHour(date);

    const findAppointmentsInsameDate = await appointmentsRepository.findByDate(
      AppointmentDate
    );

    if (findAppointmentsInsameDate) {
      throw new AppError('this appointment is already booked');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: AppointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
