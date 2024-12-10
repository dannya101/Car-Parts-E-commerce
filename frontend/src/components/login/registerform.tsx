'use client';

import { useRegisterForm } from '@/hooks/useregisterform';
import { useState } from 'react';
import { Form } from '@/components/ui/form';
import FormFieldWrapper from '@/components/login/formfieldwrapper';
import SubmitButton from '@/components/login/submitbutton';
import PasswordRequirements from '@/components/login/passwordrequirements';

function RegisterForm() {
	const { form, onSubmit } = useRegisterForm();

	const [passwordValue, setPasswordValue] = useState('');

	return (
		<Form {...form}>
			<form
				onSubmit={onSubmit}
				className="space-y-8"
			>
				<FormFieldWrapper
					name="username"
					label="Username"
					placeholder="Enter your username"
					description="Your username should be unique"
					autoComplete="username"
					form={form}
				/>
				<FormFieldWrapper
					name="email"
					label="Email"
					placeholder="email"
					autoComplete="email"
					description="Enter your email."
					form={form}
				/>
				<FormFieldWrapper
					name="password"
					label="Password"
					placeholder="password"
					type="password"
					description="Enter your password."
					autoComplete="current-password"
					form={form}
					handleChange={(e) => {
						setPasswordValue(e.target.value);
						form.setValue('password', e.target.value);
					}}
				>
					{passwordValue && (
						<PasswordRequirements passwordValue={passwordValue} />
					)}
				</FormFieldWrapper>
				<FormFieldWrapper
					name="confirmPassword"
					label="Confirm Password"
					placeholder="confirm password"
					type="password"
					autoComplete="current-password"
					description="Confirm your password."
					form={form}
				/>
				<SubmitButton
					isSubmitting={form.formState.isSubmitting}
					label={'Register'}
				/>
			</form>
		</Form>
	);
}
export default RegisterForm;