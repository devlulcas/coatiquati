import { z } from 'zod';

export const presignedURLRequestSchema = z.object({
  fileType: z.string().min(1, { message: 'O tipo do arquivo deve ser uma string' }),
  fileSize: z.number().nonnegative({ message: 'O tamanho do arquivo deve ser um número' }),
  checksum: z.string().min(1, { message: 'O checksum do arquivo deve ser uma string' }),
  filename: z.string().min(1, { message: 'O nome do arquivo deve ser uma string' }),
});

export type PresignedURLRequest = z.infer<typeof presignedURLRequestSchema>;
