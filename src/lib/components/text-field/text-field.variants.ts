import { cva } from 'class-variance-authority';

export const inputVariants = cva('w-full p-2 rounded-md border-b border-white/50 outline-none focus:border-white/80', {
	variants: {
		variant: {
			default: 'text-white bg-white/10',
			opaque: 'text-black/90 bg-white'
		},
		default: {
			variant: 'default'
		}
	}
});

export const inputLabelVariants = cva('font-bold text-md flex gap-1', {
	variants: {
		variant: {
			default: 'text-white',
			opaque: 'text-black/90'
		},
		default: {
			variant: 'default'
		}
	}
});
