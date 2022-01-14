import { ExclamationCircleIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import React, { HTMLProps } from 'react';

interface InputProps extends HTMLProps<HTMLInputElement> {
	label?: string;
	name: string;
	error?: string;
	addOn?: string;
	leadingIcon?: CustomSVG;
	trailingIcon?: CustomSVG;
}

const Input: React.FC<InputProps> = ({
	children,
	error,
	leadingIcon: LIcon,
	trailingIcon: TIcon,
	addOn,
	label,
	type = 'text',
	name,
	id,
	placeholder,
	className,
	...props
}) => {
	return (
		<div className={clsx('relative font-medium text-grey-4', className)}>
			<div>
				{label && (
					<label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
						{label}
					</label>
				)}
				<div className="relative rounded-md shadow-sm">
					{!!LIcon && (
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<LIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
						</div>
					)}
					<div className="flex">
						{!!addOn && (
							<span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
								{addOn}
							</span>
						)}
						<input
							placeholder={placeholder || label}
							name={name}
							id={id || name}
							aria-invalid={!!error}
							aria-describedby={`${name}-error`}
							type={type}
							{...props}
							className={clsx(
								'focus:ring-brand-500 focus:border-brand-500 block w-full sm:text-sm border-gray-300 placeholder-gray-400',
								!!addOn ? 'rounded-none rounded-r-md' : 'rounded-md',
								!!LIcon && 'pl-10',
								(!!TIcon || !!error) && 'pr-10',
							)}
						/>
					</div>

					{!!TIcon && !error && (
						<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
							<TIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
						</div>
					)}
					{!!error && (
						<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
							<ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
						</div>
					)}
				</div>
			</div>
			{error && (
				<span id={`${name}-error`} className="absolute left-0 -bottom-5 text-xs text-red-600">
					{error}
				</span>
			)}
		</div>
	);
};

export default Input;
