import app from './app';
import { connectDB, disconnectDB } from './config/db';
import { env } from './config/env';
import logger from './config/logger';

import net from 'net';

/**
 * Dynamically resolves an open port starting from desiredPort.
 * If desiredPort is in use (EADDRINUSE), it automatically increments to find the next available port.
 */
export const getAvailablePort = (desiredPort: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const tester = net.createServer();
    tester.unref();

    tester.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        logger.warn(`Port ${desiredPort} is already in use. Checking next port ${desiredPort + 1}...`);
        resolve(getAvailablePort(desiredPort + 1));
      } else {
        reject(err);
      }
    });

    tester.listen(desiredPort, () => {
      const { port } = tester.address() as net.AddressInfo;
      tester.close(() => resolve(port));
    });
  });
};

const startServer = async () => {
  try {
    await connectDB();

    const configuredPort = parseInt(process.env.PORT || env.PORT || '5001', 10);
    const activePort = await getAvailablePort(configuredPort);

    const server = app.listen(activePort, () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode on dynamic port ${activePort}`);
      if (activePort !== configuredPort) {
        logger.warn(`⚠️ Configured port ${configuredPort} was in use. Dynamically bound to available port ${activePort}`);
      }
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down server...');
      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
