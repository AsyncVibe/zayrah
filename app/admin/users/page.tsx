import { authGuard } from "@/lib/auth-guard";

const UsersPage = async () => {
	await authGuard();
	return <div>Users Page</div>;
};

export default UsersPage;
