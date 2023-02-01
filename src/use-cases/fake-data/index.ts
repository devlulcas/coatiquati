export function createBreadcrumbPreview(id: number): Breadcrumb {
	return {
		id,
		title: `Breadcrumb ${id}`,
		slug: `breadcrumb-${id}`,
		description: `This is a description for breadcrumb ${id}`,
		availableContent: ['text', 'image', 'video', 'code', 'quote', 'link']
	};
}

export function createTrailPreview(id: number) {
	return {
		id,
		title: `Trail ${id}`,
		description: `Trail ${id} description`,
		image: {
			src: 'https://images.unsplash.com/photo-1446707052533-0e1d48e08aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
			alt: `Trail ${id} image`,
			blurDataURL:
				'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAgICAgJCAkKCgkNDgwODRMREBARExwUFhQWFBwrGx8bGx8bKyYuJSMlLiZENS8vNUROQj5CTl9VVV93cXecnNEBCAgICAkICQoKCQ0ODA4NExEQEBETHBQWFBYUHCsbHxsbHxsrJi4lIyUuJkQ1Ly81RE5CPkJOX1VVX3dxd5yc0f/CABEIAAcACgMBIgACEQEDEQH/xAApAAEBAQAAAAAAAAAAAAAAAAAAAgYBAQEAAAAAAAAAAAAAAAAAAAME/9oADAMBAAIQAxAAAACMURL/AP/EAB4QAAICAQUBAAAAAAAAAAAAAAIDAQUAERMUIULS/9oACAEBAAE/AKu+sm0rzNyt2fUhj7e/JzZ5bI1MuokPnP/EABgRAQEAAwAAAAAAAAAAAAAAAAERACEy/9oACAECAQE/AOIi7rn/xAAYEQACAwAAAAAAAAAAAAAAAAAAAREhYf/aAAgBAwEBPwBXOH//2Q==',
			width: 250,
			height: 250
		},
		slug: `trail-${id}`,
		author: `Author ${id}`,
		breadcrumbs: 5
	};
}
