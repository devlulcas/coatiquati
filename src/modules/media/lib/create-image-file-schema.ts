import { z } from 'zod';

const ACCEPTED_IMAGE_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml'];

const DEFAULT_OPTIONS = {
  min: 1,
  max: 1,
  maxSize: 5 * 1024 * 1024,
  acceptedFileTypes: ACCEPTED_IMAGE_FILE_TYPES,
};

type CreateImageFileSchemaOptions = {
  min?: number;
  max?: number;
  maxSize?: number;
  acceptedFileTypes?: string[];
};

/**
 * Cria um schema de validação de arquivo de imagem
 * @param options Opções de validação de arquivo de imagem
 * @returns ZodSchema<FileList>
 */
export const createImageFileSchema = (options: CreateImageFileSchemaOptions = DEFAULT_OPTIONS) => {
  const listFormat = new Intl.ListFormat('pt-BR', {
    style: 'long',
    type: 'disjunction',
  });

  const acceptedFileTypesString = listFormat.format(options.acceptedFileTypes ?? DEFAULT_OPTIONS.acceptedFileTypes);

  const min = options.min ?? DEFAULT_OPTIONS.min;
  const max = options.max ?? DEFAULT_OPTIONS.max;
  const maxSize = options.maxSize ?? DEFAULT_OPTIONS.maxSize;

  const isInAcceptedFileTypes = (fileList: File[] | null) => {
    if (fileList === null) return false;
    return Array.from(fileList).every(file => ACCEPTED_IMAGE_FILE_TYPES.includes(file.type));
  };

  const isInAcceptedSize = (fileList: File[] | null) => {
    if (fileList === null) return false;
    return Array.from(fileList).every(file => file.size <= maxSize);
  };

  const isInAcceptedQuantity = (fileList: File[] | null) => {
    if (!fileList) return null;
    const length = fileList.length ?? 0;
    return length > min && length <= max ? fileList : fileList.slice(0, max);
  };

  return z
    .custom<File[]>()
    .transform(isInAcceptedQuantity)
    .refine(isInAcceptedFileTypes, {
      message: `O tipo de arquivo deve ser ${acceptedFileTypesString}`,
    })
    .refine(isInAcceptedSize, {
      message: `O tamanho máximo do arquivo é de ${maxSize / 1024 / 1024}MB`,
    });
};
