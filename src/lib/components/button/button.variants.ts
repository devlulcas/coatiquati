import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
	'inline-flex gap-2 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
	{
		variants: {
			variant: {
				default: 'bg-purple-600 text-white hover:bg-purple-600/90 ring-purple-600',
				destructive: 'bg-red-500 text-white hover:bg-red-500/90 ring-red-500',
				outline: 'border border-input hover:bg-fuchsia-500 hover:text-white ring-fuchsia-500',
				secondary: 'bg-fuchsia-500 text-white hover:bg-fuchsia-500/80 ring-fuchsia-500',
				ghost: 'hover:bg-fuchsia-500 hover:text-white ring-fuchsia-500',
				link: 'underline-offset-4 hover:underline text-purple-600 hover:text-purple-600/90 ring-purple-600'
			},
			size: {
				default: 'h-10 py-2 px-4',
				sm: 'h-9 px-3 rounded-md',
				lg: 'h-11 px-8 rounded-md',
				icon: 'h-10 w-10 rounded-md'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
);

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];

export type ButtonSize = VariantProps<typeof buttonVariants>['size'];
