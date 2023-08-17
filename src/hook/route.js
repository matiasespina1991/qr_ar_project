

import { useRouter } from "next/router";
import { useEffect } from "react";
import React from "react";
import useAuth from "./auth";
import CircularProgressLoader from "../components/CircularProgressLoader";

export function withPublic(Component) {
	return function WithPublic(props) {
		const auth = useAuth();
		const router = useRouter();

		if (auth.user) {
			router.replace("/");
			return <CircularProgressLoader />;
		}

		return <Component auth={auth} {...props} />;
	};
}


export function withProtected(Component) {
	return function WithProtected(props) {
		const auth = useAuth();
		const router = useRouter();

		useEffect(() => {
			if (!auth.user) {
				router.replace('/login');
			}
		}, [auth.user]);

		if (!auth.user) {
			return <CircularProgressLoader />;
		}

		return <Component auth={auth} {...props} />;
	};
}