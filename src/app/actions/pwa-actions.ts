"use server";

import webpush, { PushSubscription } from "web-push";

// Configurar VAPID keys
webpush.setVapidDetails(
  "mailto:tu-email@medilink.com", // Cambiar por tu email
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// En producción, deberías usar una base de datos
// Aquí solo es un ejemplo con almacenamiento en memoria
const subscriptions = new Map<string, PushSubscription>();

export async function subscribeUser(sub: PushSubscription, userId?: string) {
  try {
    const key = userId || "default";
    subscriptions.set(key, sub);

    // TODO: Guardar en base de datos
    // await db.pushSubscription.create({
    //   data: {
    //     userId: userId,
    //     endpoint: sub.endpoint,
    //     keys: JSON.stringify(sub.keys),
    //   }
    // })

    return { success: true, message: "Suscripción registrada correctamente" };
  } catch (error) {
    console.error("Error al suscribir usuario:", error);
    return { success: false, error: "Error al registrar suscripción" };
  }
}

export async function unsubscribeUser(userId?: string) {
  try {
    const key = userId || "default";
    subscriptions.delete(key);

    // TODO: Eliminar de base de datos
    // await db.pushSubscription.delete({
    //   where: { userId: userId }
    // })

    return { success: true, message: "Suscripción eliminada correctamente" };
  } catch (error) {
    console.error("Error al desuscribir usuario:", error);
    return { success: false, error: "Error al eliminar suscripción" };
  }
}

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  url?: string;
  tag?: string;
  requireInteraction?: boolean;
  userId?: string;
}

export async function sendNotification(payload: NotificationPayload) {
  try {
    const { userId, ...notificationData } = payload;
    const key = userId || "default";
    const subscription = subscriptions.get(key);

    if (!subscription) {
      return { success: false, error: "No hay suscripción disponible" };
    }

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: notificationData.title,
        body: notificationData.body,
        icon: notificationData.icon || "/android-chrome-192x192.png",
        url: notificationData.url || "/",
        tag: notificationData.tag || "medilink-notification",
        requireInteraction: notificationData.requireInteraction || false,
      })
    );

    return { success: true, message: "Notificación enviada correctamente" };
  } catch (error) {
    console.error("Error al enviar notificación push:", error);
    return { success: false, error: "Error al enviar notificación" };
  }
}

// Función para enviar notificaciones masivas
export async function sendBulkNotifications(
  userIds: string[],
  payload: Omit<NotificationPayload, "userId">
) {
  const results = await Promise.allSettled(
    userIds.map((userId) => sendNotification({ ...payload, userId }))
  );

  const successful = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return {
    success: true,
    message: `Enviadas ${successful} notificaciones, ${failed} fallidas`,
    details: { successful, failed, total: userIds.length },
  };
}

// Función para notificar sobre citas próximas
export async function notifyUpcomingAppointment(
  userId: string,
  appointmentDetails: {
    doctorName: string;
    date: string;
    time: string;
    specialty: string;
  }
) {
  return await sendNotification({
    userId,
    title: "📅 Recordatorio de Cita",
    body: `Tienes una cita con ${appointmentDetails.doctorName} (${appointmentDetails.specialty}) el ${appointmentDetails.date} a las ${appointmentDetails.time}`,
    url: "/user",
    tag: "appointment-reminder",
    requireInteraction: true,
  });
}

// Función para notificar alertas de salud
export async function notifyHealthAlert(
  userId: string,
  alertDetails: {
    type: string;
    message: string;
    priority: "low" | "medium" | "high";
  }
) {
  return await sendNotification({
    userId,
    title: `⚠️ Alerta de Salud - ${alertDetails.type}`,
    body: alertDetails.message,
    url: "/user",
    tag: "health-alert",
    requireInteraction: alertDetails.priority === "high",
  });
}
