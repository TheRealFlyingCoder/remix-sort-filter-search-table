import clsx from 'clsx';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';

interface DropdownProps<T> {
	items: T[];
	itemKey: string;
	buttonClass?: string;
	buttonChild: JSX.Element | string;
	dropdownClass?: string;
	defaultItem?: (active: boolean) => JSX.Element;
	generateItem: (active: boolean, item: T) => JSX.Element;
	defaultBottom?: boolean;
	isRight?: boolean;
	isTop?: boolean;
}

const Dropdown = <T,>({
	itemKey,
	items,
	defaultItem,
	defaultBottom,
	generateItem,
	buttonClass,
	buttonChild,
	isRight,
	isTop,
	dropdownClass,
}: DropdownProps<T>) => (
	<Menu as="div" className="relative inline-block text-left">
		<div>
			<Menu.Button
				className={clsx(
					'inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-brand-500',
					buttonClass,
				)}
			>
				{buttonChild}
				<ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
			</Menu.Button>
		</div>

		<Transition
			as={Fragment}
			enter="transition ease-out duration-100"
			enterFrom="transform opacity-0 scale-95"
			enterTo="transform opacity-100 scale-100"
			leave="transition ease-in duration-75"
			leaveFrom="transform opacity-100 scale-100"
			leaveTo="transform opacity-0 scale-95"
		>
			<Menu.Items
				className={clsx(
					isRight ? 'origin-top-right right-0' : 'origin-top-left left-0',
					isTop ? 'bottom-[100%]' : '',
					'absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none',
					dropdownClass,
				)}
			>
				<div className="py-1">
					{defaultItem && !defaultBottom && <Menu.Item>{({ active }) => defaultItem(active)}</Menu.Item>}
					{items.map((item, index) => (
						<Menu.Item key={`${itemKey}-${index}`}>{({ active }) => generateItem(active, item)}</Menu.Item>
					))}
					{defaultItem && !!defaultBottom && <Menu.Item>{({ active }) => defaultItem(active)}</Menu.Item>}
				</div>
			</Menu.Items>
		</Transition>
	</Menu>
);

export default Dropdown;
