// Todo: Usar Satori + RESVG para gerar OpenGraph images dinamicamente

export type OpenGraphImage = {
	url: string;
	width: number;
	height: number;
	title: string;
	subtitle: string;
	extra: string;
};

export const getOpenGraphImage = (image: OpenGraphImage) => {
	return JSON.stringify(image);
};
