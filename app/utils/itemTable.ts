import { z } from 'zod';

//ZOD gives you nice types to work with
export const itemTableSchema = z.object({
	page: z.number().min(1),
	items: z.number().min(1),
	search: z.string().optional(),
	age: z.number().min(0).optional(),
	direction: z.enum(['asc', 'desc']).optional(),
	//Override these two with an enum of possible keys
	filter: z.string().optional(),
	sort: z.string().optional(),
});

export type ItemTableParams = z.infer<typeof itemTableSchema>;

export const getItemTableParams = <ZodSchema>(request: Request, schema: z.Schema<ZodSchema>) => {
	const query = new URL(request.url).searchParams;
	const age = query.get('age');

	const params = Object.fromEntries(
		Object.entries({
			page: parseInt(query.get('page') || '1'),
			items: parseInt(query.get('items') || '10'),
			search: query.get('search'),
			age: !!age ? parseInt(age) : null,
			filter: query.get('filter'),
			sort: query.get('sort'),
			direction: query.get('direction'),
		}).filter(([, v]) => v != null),
	);

	return schema.parse(params);
};

export const defaultTableParams: Record<string, any> = {
	page: 1,
	items: 10,
};

export const getNewTableUrl = (baseUrl: string, oldParams: ItemTableParams, newKey: keyof ItemTableParams, newValue?: string) => {
	let params = new URLSearchParams();
	//Set params from the last query that have a non-default value
	Object.entries(oldParams).map(([key, value]) => {
		const isDefault = defaultTableParams[key] === value
		if (!!value && !isDefault) {
			params.set(key, typeof value !== 'string' ? JSON.stringify(value) : value);
		}
	});

	if (!newValue) {
		//Passing an empty value means we want to clear the key
		params.delete(newKey);
	} else {
		switch (newKey) {
			case 'sort':
				if (!oldParams.sort || oldParams.sort !== newValue) {
					params.set(newKey, newValue);
					params.set('direction', 'desc');
				} else if (oldParams.direction === 'desc') {
					params.set(newKey, newValue);
					params.set('direction', 'asc');
				} else {
					//Third consecutive click resets the sort
					params.delete('direction');
					params.delete('sort');
				}
				break;
			case 'search':
				//Searching resets the table
				params = new URLSearchParams();
				params.set(newKey, newValue);
				params.set('page', '1');
				break;
			case 'age':
			case 'filter':
				//Age and filter push you back to page 1
				params.set(newKey, newValue);
				params.set('page', '1');
			default:
				params.set(newKey, newValue);
		}
	}

	return `${baseUrl}?${params.toString()}`;
};
