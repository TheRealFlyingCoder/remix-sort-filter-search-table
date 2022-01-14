import { CalendarIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'remix';
import { getNewTableUrl, ItemTableParams } from '~/utils/itemTable';
import Dropdown from '../Dropdown';

interface AgeDropdownProps {
	tableParams: ItemTableParams;
	ages: Array<{ value: number; label: string }>;
	baseUrl: string;
}

const AgeDropdown: React.FC<AgeDropdownProps> = ({ tableParams, ages, baseUrl }) => {
	const getLink = (active: boolean, label: string, value?: string) => (
		<Link
			to={getNewTableUrl(baseUrl, tableParams, 'age', value)}
			className={clsx(active || value === tableParams.age ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')}
		>
			{label}
		</Link>
	);

	return (
		<Dropdown
			items={ages}
			itemKey="ages"
			buttonChild={
				<>
					<CalendarIcon className="w-4 mr-2" />
					{ages.find(age => age.value === tableParams.age)?.label || 'All time'}
				</>
			}
			defaultBottom
			isRight
			defaultItem={() => getLink(!tableParams.age, 'All time')}
			generateItem={(active, { label, value }) => getLink(active || value === tableParams.age, label, value.toString())}
		/>
	);
};
export default AgeDropdown;
