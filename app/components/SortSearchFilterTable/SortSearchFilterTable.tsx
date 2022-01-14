import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { Link } from 'remix';
import { getNewTableUrl, ItemTableParams } from '~/utils/itemTable';
import Dropdown from '../Dropdown';
import Input from '../Input';
import Pagination from '../Pagination';
import AgeDropdown from './AgeDropdown';
import Filters from './Filters';

interface SortSearchFilterTableProps<T> {
	items: T[];
	itemTotal: number;
	filters: string[];
	filterMeta?: Record<string, number>;
	tableParams: ItemTableParams;
	filterDropdownDefault: string;
	searchPlaceholder?: string;
	headers: string[];
	ages: Array<{ value: number; label: string }>;
	baseUrl: string;
	rowClass?: string;
	renderItemRow: (item: T) => JSX.Element;
}

const SortSearchFilterTable = <T,>({
	items,
	itemTotal,
	filters,
	filterMeta,
	filterDropdownDefault,
	baseUrl,
	tableParams,
	headers,
	ages,
	searchPlaceholder,
	rowClass,
	renderItemRow,
}: SortSearchFilterTableProps<T>) => {
	return (
		<div>
			<div className="flex justify-between items-center">				
				<Filters baseUrl={baseUrl} dropdownDefault={filterDropdownDefault} tableParams={tableParams} filterMeta={filterMeta} filters={filters} />
				<div className="flex items-center space-x-4">
					<AgeDropdown tableParams={tableParams} ages={ages} baseUrl={baseUrl} />
					<form>
						<Input
							name="search"
							defaultValue={tableParams.search}
							leadingIcon={SearchIcon}
							placeholder={searchPlaceholder || 'Search'}
						/>
					</form>
				</div>
			</div>
			<div className="mt-2 h-6 flex w-full items-center justify-end">
				{!!Object.entries(tableParams).find(([key, val]) => !['page', 'items'].includes(key) && !!val) && (
					<Link className="tracking-wide text-sm text-brand-400 hover:text-brand-800" to={baseUrl}>
						Reset table
					</Link>
				)}
			</div>
			<div className="mt-8 bg-white rounded shadow flex flex-col w-full">
				<div className={clsx(rowClass, 'bg-gray-50')}>
					{headers.map(header => {
						const isSortingUp = tableParams.sort === header && tableParams.direction === 'asc';
						const isSortingDown = tableParams.sort === header && tableParams.direction === 'desc';
						return (
							<Link
								key={`header-${header}`}
								className="border border-gray-200 text-gray-600 hover:shadow flex px-4 py-2 font-medium text-sm tracking-wider hover:bg-gray-100"
								to={getNewTableUrl(baseUrl, tableParams, 'sort', header)}
							>
								{header.toUpperCase()}
								{isSortingUp && <ChevronUpIcon className="ml-auto w-4" />}
								{isSortingDown && <ChevronDownIcon className="ml-auto w-4" />}
							</Link>
						);
					})}
				</div>
				{items.map(renderItemRow)}
				{!items ||
					(!items.length && (
						<div className="w-full flex justify-center py-4">
							<h4 className="text-gray-600 tracking-wider font-medium">No results found</h4>
						</div>
					))}
				<Pagination
					total={itemTotal}
					itemsPerPage={tableParams.items}
					currentPage={tableParams.page}
					getLink={page => getNewTableUrl(baseUrl, tableParams, 'page', page.toString())}
				/>
			</div>
			{itemTotal > tableParams.items && (
				<div className="flex mt-4 items-center justify-between">

				<p className="mt-4 text-gray-600 tracking-wider text-sm">
					Showing <b>{tableParams.items * (tableParams.page - 1) + 1}</b> to <b>{tableParams.items * tableParams.page}</b> of{' '}
					<b>{itemTotal}</b> results
				</p>
				<Dropdown itemKey="items" items={['10', '25', '50', '100']} isRight isTop buttonChild={`${tableParams.items} items per page`} generateItem={(active, item) => (
						<Link
						to={getNewTableUrl(baseUrl, tableParams, 'items', item)}
						className={clsx(active || item === tableParams.items.toString() ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')}
					>
						{item} items per page
					</Link>
				)}/>
				</div>
			)}
		</div>
	);
};

export default SortSearchFilterTable;
