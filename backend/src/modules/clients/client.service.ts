import { Client } from './client.model';
import { assertOwnership } from '../../utils/ownershipCheck';

export const listClients = async (userId: string, search?: string) => {
  const query: any = { userId };
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  return await Client.find(query).sort({ name: 1 }).lean();
};

export const createClient = async (userId: string, data: any) => {
  // Check if client with email already exists for user
  const existingClient = await Client.findOne({ userId, email: data.email });
  if (existingClient) {
    throw Object.assign(new Error('A client with this email already exists'), { statusCode: 400, code: 'CLIENT_EXISTS' });
  }

  const client = new Client({
    ...data,
    userId,
  });

  await client.save();
  return client;
};

export const getClient = async (userId: string, clientId: string) => {
  return await assertOwnership(Client, clientId, userId);
};

export const updateClient = async (userId: string, clientId: string, data: any) => {
  const client = await assertOwnership(Client, clientId, userId);

  // Check email uniqueness if email is being updated
  if (data.email && data.email !== client.email) {
    const existingClient = await Client.findOne({ userId, email: data.email });
    if (existingClient) {
      throw Object.assign(new Error('A client with this email already exists'), { statusCode: 400, code: 'CLIENT_EXISTS' });
    }
  }

  Object.assign(client, data);
  await client.save();
  return client;
};

export const deleteClient = async (userId: string, clientId: string) => {
  const client = await assertOwnership(Client, clientId, userId);
  await client.deleteOne();
};
