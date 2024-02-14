import { z } from 'zod'

export const user = z.object({
  username: z.string().min(3, 'Must be longer than 3 characters').max(20, 'Must be shorter than 20 characters').trim(),
  password: z.string().min(3, 'Must be longer than 3 characters').max(20, 'Must be shorter than 20 characters'),
})

export const userDTO = z.object({ username: user.shape.username, password: user.shape.password }).strict()
export type UserDTO = z.infer<typeof userDTO>
