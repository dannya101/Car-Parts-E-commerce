import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const usernameSchema = z
	.string()
	.min(3)
	.max(50)
	.regex(/^[a-zA-Z0-9_]+$/);

const emailSchema = z.string().email();

const passwordSchema = z
	.string()
	.min(8)
	.max(64)
	.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
	.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
	.regex(/[0-9]/, 'Password must contain at least one number')
	.regex(
		/[^a-zA-Z0-9]/,
		'Password must contain at least one special character'
	);

const registerFormSchema = z
	.object({
		username: usernameSchema,
		email: emailSchema,
		password: passwordSchema,
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function useRegisterForm() {
	const { toast } = useToast();

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	async function onSubmit(values: RegisterFormValues) {
		await new Promise((resolve) => setTimeout(resolve, 2000));

		try {
			const result = await fetch("http://localhost:8000/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    password: values.password
                })
            });

			if (result.ok) {
				toast({
					title: 'Success',
					description: 'User registered successfully',
				});
			}

			setTimeout(() => {
				window.location.href = 'login';
			}, 2000);
		} catch (error) {
			toast({
				title: 'Registration failed',
				description:
					'An error occurred while registering the user, please try again',
			});
		} finally {
			form.reset();
		}
	}

	return { form, onSubmit: form.handleSubmit(onSubmit) };
}