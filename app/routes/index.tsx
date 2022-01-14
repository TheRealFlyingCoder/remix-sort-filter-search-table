import { ArrowRightIcon } from "@heroicons/react/outline";
import { LoaderFunction, json, useLoaderData, Link } from "remix";
import SortSearchFilterTable from "~/components/SortSearchFilterTable";
import { getPaginatedOrders } from "~/server/orders";
import { OrderData, OrderAges, OrderHeaders, OrderFilters } from "~/utils/pagination/orders";
import { Order } from '@prisma/client';

export const loader: LoaderFunction = async ({ request, params }) => {
	const data = await getPaginatedOrders(request);

	return json(data);
};

export default function ViewOrders() {
	const { orders, tableParams, total } = useLoaderData<OrderData>();

    const ItemRow = (order: Order) => {
        return (
            <Link
                to={'/'}
                key={order.id}
                className="relative group hover:bg-gray-50 grid grid-cols-4 items-center font-semi"
            >
                <div className="py-2 px-4">{order.id}</div>
                <div className="py-2 px-4">
                    {new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(order.totalCost)}
                </div>
                <div className="py-2 px-4">{order.status[0].toUpperCase()}{order.status.slice(1)}</div>
                <div className="py-2 px-4">{new Date(order.createdAt).toLocaleDateString()}</div>
                <div className="absolute inset-y-0 right-4 flex justify-center">
                    <ArrowRightIcon className="w-6 text-gray-200 group-hover:text-brand-200 transition-all group-hover:translate-x-1" />
                </div>
            </Link>
        );
    };

	return (
		<div className="flex flex-col">
			<div className="flex justify-between mb-6">
				<h1>Orders</h1>
			</div>
			<SortSearchFilterTable
				renderItemRow={ItemRow}
				ages={OrderAges}
				baseUrl='/'
				rowClass="grid grid-cols-4"
				items={orders}
				itemTotal={total}
				headers={OrderHeaders}
				filters={OrderFilters}
				filterDropdownDefault="All statuses"
				tableParams={tableParams}
			/>
		</div>
	);
}
