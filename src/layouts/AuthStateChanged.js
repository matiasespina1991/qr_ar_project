import React, { useEffect, useState } from "react";
import AuthService from "../auth/AuthService";
import useAuth from "../hook/auth";
import CircularProgressLoader from "../components/CircularProgressLoader";


export default function AuthStateChanged({ children }) {
	const { setUser } = useAuth();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		AuthService.waitForUser((userCred) => {
			setUser(userCred);
			setLoading(false);
		});
		//eslint-disable-next-line
	}, []);

	if (loading) {
		return <CircularProgressLoader />
	}

	return children;
}