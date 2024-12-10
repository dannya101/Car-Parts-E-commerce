import React from 'react';
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface FormFieldWrapperProps {
	name: string;
	label: string;
	placeholder: string;
	type?: string;
	autoComplete?: string;
	description: string;
	form: any;
	// eslint-disable-next-line no-unused-vars
	handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	children?: React.ReactNode;
}

function FormFieldWrapper({
	name,
	label,
	placeholder,
	type,
	autoComplete,
	description,
	form,
	handleChange,
	children,
}: FormFieldWrapperProps) {
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<label className="block text-sm font-medium text-white">{label}</label>
					<FormControl>
						<input
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
							placeholder={placeholder}
							{...field}
							autoComplete={autoComplete}
							type={type}
							onChange={handleChange ? handleChange : field.onChange}
						/>
					</FormControl>
					<FormMessage />
					<FormDescription>{description}</FormDescription>
					{children}
				</FormItem>
			)}
		/>
	);
}

export default FormFieldWrapper;