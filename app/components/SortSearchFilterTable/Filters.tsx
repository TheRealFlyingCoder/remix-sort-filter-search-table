import clsx from 'clsx';
import { Link } from 'remix';
import { getNewTableUrl, ItemTableParams } from '~/utils/itemTable';
import Dropdown from '../Dropdown';

interface FilterProps {
	baseUrl: string;
	tableParams: ItemTableParams;
	filters: string[];
	dropdownDefault: string;
	filterMeta?: Record<string, number>;
}

const Filters: React.FC<FilterProps> = ({ baseUrl, tableParams, filters, dropdownDefault, filterMeta }) => {
	const buttonChild = !!tableParams.filter ? `${tableParams.filter[0].toUpperCase()}${tableParams.filter.slice(1)}` : dropdownDefault;

	const generateItem = (active: boolean, filter: string) => (
		<Link
			to={getNewTableUrl(baseUrl, tableParams, 'filter', filter)}
			className={clsx(
				active || filter === tableParams.filter ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
				'block px-4 py-2 text-sm',
			)}
		>
			{filter[0].toUpperCase()}
			{filter.slice(1)}
		</Link>
	);

	const generateDefault = () => (
		<Link
			to={getNewTableUrl(baseUrl, tableParams, 'filter')}
			className={clsx(!tableParams.filter ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')}
		>
			{dropdownDefault}
		</Link>
	);

	return filters.length > 3 ? (
		<Dropdown items={filters} itemKey="filter" buttonChild={buttonChild} defaultItem={generateDefault} generateItem={generateItem} />
	) : (
		<div className="flex items-center space-x-2 font-medium trackin-wide">
			<Link
				prefetch="intent"
				to={getNewTableUrl(baseUrl, tableParams, 'filter')}
				className={clsx(
					'py-1 px-4 rounded-full shadow bg-white hover:bg-brand-50',
					!tableParams.filter && 'bg-brand hover:bg-brand text-white',
				)}
			>
				All
			</Link>
			{filters.map(filter => {
				const active = filter === tableParams.filter;
				const disabled = !!tableParams.search || (!!filterMeta && !filterMeta[filter]);

				const content = (
					<>
						{filter[0].toUpperCase()}
						{filter.slice(1)}
						{filterMeta && (
							<span className={clsx('ml-2 text-gray-400', active && 'text-gray-200')}>{filterMeta[filter] || 0}</span>
						)}
					</>
				);

				return disabled ? (
					<div key={`filter-${filter}`} className="py-1 px-4">
						{content}
					</div>
				) : (
					<Link
						key={`filter-${filter}`}
						prefetch={'intent'}
						to={getNewTableUrl(baseUrl, tableParams, 'filter', filter)}
						className={clsx(
							'py-1 px-4 rounded-full shadow bg-white hover:bg-brand-50',
							active && 'bg-brand hover:bg-brand text-white',
						)}
					>
						{content}
					</Link>
				);
			})}
		</div>
	);
};

export default Filters;
