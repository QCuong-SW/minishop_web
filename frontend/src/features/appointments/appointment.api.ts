import { apiFetch } from "@/lib/api-client";
import { StorageService } from "@/lib/storage";
import { Appointment, ServiceType } from "@/types";

export const getAppointmentsApi = async (): Promise<Appointment[]> => {
  return apiFetch<Appointment[]>(
    "/appointments",
    {},
    () => {
      const currentUser = StorageService.getCurrentUser();
      return StorageService.getAppointments(currentUser?.id || 2);
    }
  );
};

export const createAppointmentApi = async (payload: {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  appointment_date: string;
  appointment_time: string;
  service_type: ServiceType;
  product_name?: string;
  note?: string;
}): Promise<Appointment> => {
  return apiFetch<Appointment>(
    "/appointments",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    () => {
      const currentUser = StorageService.getCurrentUser();
      return StorageService.createAppointment({
        user_id: currentUser?.id || 2,
        user_name: payload.customer_name,
        user_phone: payload.customer_phone,
        appointment_date: payload.appointment_date,
        appointment_time: payload.appointment_time,
        service_type: payload.service_type,
        guest_count: 2,
        note: payload.note,
      });
    }
  );
};
