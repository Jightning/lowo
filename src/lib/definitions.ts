import { Category } from '@/types'
import { z } from 'zod'

// Schema to validate the users main sighup
export const SignupFormSchema = z.object({
	email: z.email({ message: 'Please enter a valid email.' }).trim(),
	password: z
		.string()
		.min(8, { message: 'Be at least 8 characters long' })
		.regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
		.regex(/[0-9]/, { message: 'Contain at least one number.' })
		.regex(/[^a-zA-Z0-9]/, {
			message: 'Contain at least one special character.',
		})
		.trim(),
})

export const nullCategory: Category = {
	id: '-1',
    name: 'No Category',
    color: '#000000',

	dateCreated: '0',
	dateUpdated: '0'
}