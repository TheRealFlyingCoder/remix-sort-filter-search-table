import { OrderStatus, Prisma } from '@prisma/client';
import { getItemTableParams } from '~/utils/itemTable';
import { ordersPaginationSchema, OrderData } from '~/utils/pagination/orders';


export const getPaginatedOrders = async (request: Request) => {
	const tableParams = getItemTableParams(request, ordersPaginationSchema);

	let result: OrderData = {
		orders: [],
		tableParams,
		total: 0,
	};

	//Search only grabs one order for me so thats why this is here
	if (tableParams.search) {
		const order = await prismaRead?.order.findUnique({
			where: {
				id: parseInt(tableParams.search),
			},
		});

		if (!!order) {
			result = {
				...result,
				orders: [order],
				total: 1,
			};
		}
	} else {
		const filter: Prisma.OrderFindManyArgs = {
			where: {},
			skip: tableParams.items * (tableParams.page - 1),
			take: tableParams.items,
		};

		if (tableParams.age) {
			filter.where = {
				...filter.where,
				createdAt: {
					gte: new Date(
						[6, 12].includes(tableParams.age) //6 and 12 are months so hardcoded this bit, otherwise it's days
							? new Date().setMonth(-tableParams.age)
							: new Date().setHours(-tableParams.age * 24),
					),
				},
			};
		}

		if (tableParams.filter) {
			filter.where = {
				...filter.where,
				status: tableParams.filter,
			};
		}

		if (tableParams.sort) {
			switch (tableParams.sort) {
				case 'order':
					filter.orderBy = {
						id: tableParams.direction,
					};
					break;
				case 'total':
					filter.orderBy = {
						totalCost: tableParams.direction,
					};
					break;
				case 'placed on':
					filter.orderBy = {
						createdAt: tableParams.direction,
					};
					break;
				case 'status':
					filter.orderBy = {
						status: tableParams.direction,
					};
			}
		}

		const getCount = async () => {
			const res = await prismaRead?.order.count({
				where: filter.where,
			});
			return res || 0;
		};

		const getOrders = async () => {
			const res = await prismaRead?.order.findMany(filter);
			return res || [];
		};

		const res = await Promise.all([getCount(), getOrders()]);

		result.total = res[0];
		result.orders = res[1];
	}

	return result;
};
