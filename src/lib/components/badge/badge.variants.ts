import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

export const badgeVariants = cva('text-white h-fit w-full p-2 rounded-md flex items-center gap-2 font-semibold', {
	variants: {
		variant: {
			default: 'bg-gray-500/75',
			error: 'bg-red-500/75',
			warning: 'bg-yellow-500/75',
			info: 'bg-blue-500/75',
			success: 'bg-green-500/75'
		},
		size: {
			default: 'text-sm',
			sm: 'text-xs',
			lg: 'text-lg'
		}
	},
	defaultVariants: {
		size: 'default',
		variant: 'default'
	}
});

export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

export type BadgeSize = VariantProps<typeof badgeVariants>['size'];
