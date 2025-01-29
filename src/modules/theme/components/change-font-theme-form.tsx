'use client'

import { cn } from "@/shared/utils/cn";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { CaseLowerIcon, PuzzleIcon } from "lucide-react";
import { useTransition } from "react";
import { setFontMutation } from "../actions/change-font-mutation";
import type { Font } from "../constants/theme-keys";

export function ChangeFontThemeForm({ initialFont }: { initialFont: Font }) {
  const [isPending, startTransition] = useTransition();
  const isCommon = initialFont === "common";
  return (
    <div className="flex items-center space-x-2">
      <SwitchPrimitives.Root
        id="font"
        name="font"
        defaultChecked={isCommon}
        onCheckedChange={(checked) => {
          const font = checked ? "common" : "dyslexic";
          startTransition(async () => {
            await setFontMutation(font);
          });
        }}
        className={cn(
          "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full bg-input border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            "pointer-events-none flex items-center justify-center p-1 h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          )}
        >
          <span className={cn("p-1", isPending && "animate-spin")}>
            {isCommon ? <CaseLowerIcon fill="currentFont" size={14} /> : <PuzzleIcon fill="currentFont" size={14} />}
          </span>
        </SwitchPrimitives.Thumb>
      </SwitchPrimitives.Root>

      <label htmlFor="font" className="sr-only">
        {isPending ? "Mudando" : "Mudar"} para {isCommon ? "fonte dislexia" : "fonte comum"}
      </label>
    </div>
  )
}
