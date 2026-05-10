/** Client + server action shapes for public forms (must NOT live in a "use server" file). */

export type OrderActionState = { error: string | null; ok?: boolean; redirectTo?: string };

export const orderInitialActionState: OrderActionState = { error: null };

export type ContactActionState = { error: string | null; ok?: boolean; redirectTo?: string };

export const contactInitialActionState: ContactActionState = { error: null };
