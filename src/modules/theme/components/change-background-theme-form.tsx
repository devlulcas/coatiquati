'use client';

import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { useTransition } from 'react';
import { setBackgroundMutation } from '../actions/change-background-mutation';
import { BackgroundConfig, VALID_BACKGROUNDS, type Background } from '../constants/theme-keys';

export function ChangeBackgroundThemeForm({ initialBackground }: { initialBackground: Background }) {
  const [_, startTransition] = useTransition();

  return (
    <RadioGroup
      defaultValue={initialBackground}
      name="background"
      className="flex flex-row gap-2"
      onValueChange={(background: Background) => {
        if (typeof window !== 'undefined') {
          blobThemeChange(background);
          themeLoaderAndTransition();
        }

        startTransition(async () => {
          await setBackgroundMutation(background);
        });
      }}
    >
      {VALID_BACKGROUNDS.map(background => (
        <div key={background} className="flex items-center space-x-2">
          <RadioGroupItem value={background} id={background} />
          <Label htmlFor={background}>{BackgroundConfig[background].label} </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

// O blob é um arquivo JS carregado com todas as firulas possíveis! Ele não é limpo com a renderização do React, então é necessário remover ele manualmente.
function blobThemeChange(background: Background) {
  if (
    'ADD_ANIMATED_BLOB_BACKGROUND' in window &&
    typeof window.ADD_ANIMATED_BLOB_BACKGROUND === 'function' &&
    typeof window !== 'undefined' &&
    'REMOVE_ANIMATED_BLOB_BACKGROUND' in window &&
    typeof window.REMOVE_ANIMATED_BLOB_BACKGROUND === 'function'
  ) {
    if (background === 'blob') {
      window.ADD_ANIMATED_BLOB_BACKGROUND();
    } else {
      window.REMOVE_ANIMATED_BLOB_BACKGROUND();
    }
  }
}

// O loader é um elemento HTML que é adicionado ao DOM e removido após 500ms. Ele é uma forma de dar feedback visual para o usuário e esconder a transição de troca de tema.
function themeLoaderAndTransition() {
  const loader = window.document.createElement('div');
  loader.className =
    'fixed inset-0 z-[9999] flex justify-center backdrop-blur-3xl items-center bg-black bg-opacity-80 text-white';
  loader.textContent = 'Carregando...';
  loader.id = 'giant-theme-loader';
  window.document.body.appendChild(loader);

  setTimeout(() => {
    loader.remove();
  }, 500);
}
