function join(a: string, b: string) {
	if (a.endsWith('/')) return a + b;
	return a + '/' + b;
}
const routes = {
	get index() {
		return '/';
	},
	game: {
		get index() {
			return join(routes.index, 'game');
		}
	},
	user: {
		get index() {
			return join(routes.index, 'user');
		},
		get login() {
			return join(this.index, 'login');
		},
		get logout() {
			return join(this.index, 'logout');
		}
	}
};
const privateRoutes: routeToPrivateRouteType<typeof routes> = {
	user: {
		default: true,
		login: false
	}
} satisfies PrivateRoutesType;

export function isRoutePrivate(route: string) {
	const splitted_route = route.split('/').filter((value) => !!value);
	let current_route: PrivateRoutesType | boolean = privateRoutes;
	while (typeof current_route !== 'boolean') {
		const tmp = splitted_route.shift() ?? 'default';
		current_route = current_route[tmp] ?? (current_route['default'] || false);
	}
	return current_route;
}

type routeToPrivateRouteType<T> = {
	[key in keyof T | 'default']+?: key extends keyof T
		? T[key] extends string
			? boolean
			: routeToPrivateRouteType<T[key]>
		: boolean;
};
interface PrivateRoutesType {
	[key: string]: boolean | PrivateRoutesType | undefined;
}

export default routes;
