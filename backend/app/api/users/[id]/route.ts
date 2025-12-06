import { getUserByIdHandler, updateUserHandler, deleteUserHandler } from '@/modules/users/users.controller';

export const dynamic = 'force-dynamic';

export const GET = getUserByIdHandler;
export const PUT = updateUserHandler;
export const DELETE = deleteUserHandler;

