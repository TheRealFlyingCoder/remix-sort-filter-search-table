import { Order, OrderStatus } from "@prisma/client";
import { z } from "zod";
import { itemTableSchema } from "../itemTable";

export interface OrderData {
	orders: Order[];
	tableParams: OrderTableParams;
	total: number;
}

export type OrderHeader = 'order' | 'total' | 'status' | 'placed on';
export const OrderFilters: OrderStatus[] = ['created', 'picked', 'printed', 'shipped', 'cancelled'];
export const OrderHeaders: OrderHeader[] = ['order', 'total', 'status', 'placed on'];
export const OrderAges = [
	{
		value: 1,
		label: 'Last day',
	},
	{
		value: 7,
		label: 'Last 7 days',
	},
	{
		value: 30,
		label: 'Last 30 days',
	},
	{
		value: 6,
		label: 'Last 6 months',
	},
	{
		value: 12,
		label: 'Last 12 months',
	},
];

export const ordersPaginationSchema = itemTableSchema.merge(
	z.object({
		search: z
			.string()
			.optional()
			.refine(data => !data || !isNaN(parseInt(data)), 'Must search by number'),
		filter: z.enum(['created', 'picked', 'printed', 'shipped', 'cancelled']).optional(), //Zod types suck here so I can't use the arrays OrderFilters / OrderHeaders
		sort: z.enum(['order', 'total', 'status', 'placed on']).optional(),
	}),
);

export type OrderTableParams = z.infer<typeof ordersPaginationSchema>;