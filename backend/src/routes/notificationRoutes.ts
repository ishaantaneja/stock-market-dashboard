import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getNotificationsHandler, markAsReadHandler } from '../controllers/notificationController';

// Augment the fastify-jwt module's types to include our specific user payload.
// This is the correct way to handle type conflicts with plugins.
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
    };
  }
}

// Augment the FastifyInstance type to include the authenticate method.
// This is the correct way to handle type conflicts with plugins.
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

/**
 * This file registers all notification-related routes with the Fastify server.
 * It is a key part of our routing layer, connecting HTTP endpoints to controller functions.
 * @param fastify The Fastify server instance.
 * @param options The plugin options.
 */
export async function notificationRoutes(fastify: FastifyInstance, options: any) {
  // GET /notifications
  fastify.get('/', { preHandler: [fastify.authenticate] }, getNotificationsHandler);

  // PUT /notifications/:id/read
  fastify.put('/:id/read', { preHandler: [fastify.authenticate] }, markAsReadHandler);
}
