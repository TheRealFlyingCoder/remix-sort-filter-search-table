import { ArrowNarrowLeftIcon, ArrowNarrowRightIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'remix';

interface PaginationProps {
	total: number;
	itemsPerPage: number;
	currentPage: number;
	getLink: (page: number) => string;
}
const Pagination: React.FC<PaginationProps> = ({ total, itemsPerPage, currentPage, getLink }) => {
	const pageCount = Math.ceil(total / itemsPerPage);

	const getButtons = () => {
		let buttons: JSX.Element[] = [];

		for (let i = 1; i <= pageCount; i++) {
			const pageButton = (
				<Link
					key={`pagination-${i}`}
					to={getLink(i)}
					className={clsx(
						'border-transparent border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium',
						i === currentPage ? 'border-brand-500 text-brand-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
					)}
					aria-current="page"
				>
					{i}
				</Link>
			);

			const divider = (
				<span
					key={`pagination-divider-${i}`}
					className="border-transparent text-gray-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
				>
					...
				</span>
			);
			if (pageCount > 8) {
				//Always have a divider after page 1
				if (i === 1) {
					buttons.push(pageButton);
					buttons.push(divider);
				//Always have a divider before the last page
				} else if (i === pageCount) {
					buttons.push(divider);
					buttons.push(pageButton);
				} else if (
					i === currentPage ||
					i === currentPage - 1 ||
					i === currentPage + 1 ||
					(currentPage < 3 && i < 5) ||
					(currentPage >= pageCount - 2 && i > pageCount - 4)
				) {
					buttons.push(pageButton);
				}
			} else {
				buttons.push(pageButton);
			}
		}

		return buttons;
	};

	return pageCount > 1 ? (
		<nav className="border-t border-gray-200 my-4 px-4 flex items-center justify-between">
			<div className="-mt-px w-0 flex-1 flex">
				{currentPage !== 1 && (
					<Link
						to={getLink(currentPage - 1)}
						className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
					>
						<ArrowNarrowLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
						Previous
					</Link>
				)}
			</div>
			<div className="">{getButtons()}</div>
			<div className="-mt-px w-0 flex-1 flex justify-end">
				{currentPage !== pageCount && (
					<Link
						to={getLink(currentPage + 1)}
						className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
					>
						Next
						<ArrowNarrowRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
					</Link>
				)}
			</div>
		</nav>
	) : null;
};

export default Pagination;
