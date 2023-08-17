import { createContext, useContext, useEffect, useState } from "react";
import AuthService from "../auth/AuthService";
import { useSnackbar } from 'notistack';

const authContext = createContext();

export default function useAuth() {
	return useContext(authContext);
}

export function AuthProvider(props) {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);

	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	
	const loginWithEmailAndPassword = async (email, password) => {
		
		setError(null)

		// getAdmin().then( async (adminsArray)=>  { 
		// 	let hasAdminInDatabase = adminsArray.some( admin => admin['email'] === email )

			if(!email){
				enqueueSnackbar(
					'Please check if you have entered the email address correctly.', 
					{
						variant: 'error', 
						autoHideDuration: 4000
					}
				);
				console.log('Login Error: Email field is empty.')
				return;
			}

			if(!password){
				enqueueSnackbar(
					'Please check if you have entered the password correctly.', 
					{
						variant: 'error', 
						autoHideDuration: 4000
					}
				);
				console.log('Login Error: Password field is empty.')
				return;
			}
		
			// if(hasAdminInDatabase){
				const { error, user } = await AuthService.loginWithEmailAndPassword(email, password);
				setUser(user ?? null);
				setError(error ?? "");

				if(user){
					enqueueSnackbar(
						'You are successfully logged in!', 
						{
							variant: 'success', 
							autoHideDuration: 2000
						}
					);
					console.log('Login successful.')
				}

				if(error){
					enqueueSnackbar(
						'Please check if you have entered the password correctly.', 
						{
							variant: 'error', 
							autoHideDuration: 4000
						}
					);
					console.log(`Login Error: ${error}`)
					setError('login-error')
				}
				return;
			// }

			// if(!hasAdminInDatabase){
			// 	enqueueSnackbar(
			// 		'The email or password you have entered are invalid, please try again.', 
			// 		{
			// 			variant: 'error', 
			// 			autoHideDuration: 4000
			// 		}
			// 	);
			// 	console.log('Login Error: Invalid email or password.')
			// 	setError('login-error')
			// }
		// })


	};

	const logout = async () => {
		await AuthService.logout();
		setUser(null);
	};

	const value = { user, error, loginWithEmailAndPassword, logout, setUser };

	return <authContext.Provider value={value} {...props} />;
}