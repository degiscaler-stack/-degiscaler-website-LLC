/** Login useActionState shape (must NOT live in a "use server" file). */

export type LoginCode = 'MISSING' | 'BAD_CREDENTIALS' | 'DOWN' | 'CONFIG';

export type LoginActionState = { code: LoginCode | null };

export const loginInitialState: LoginActionState = { code: null };
