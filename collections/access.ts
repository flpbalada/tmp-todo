type AuthUser = {
	collection?: string;
	id?: number | string;
};

export const isAdmin = (user: AuthUser | null): boolean =>
	user?.collection === "admins";

export const isAppUser = (
	user: AuthUser | null,
): user is AuthUser & { id: number | string } =>
	user?.collection === "users" && user.id !== undefined;
