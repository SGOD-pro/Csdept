import React from "react";
import { getAuthState } from "@/store/authStore";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
function LoginBtn() {
	const { signInWithGoogle } = getAuthState();
	const [disable, setDisable] = React.useState(false);
	const login = async () => {
		setDisable(true);
		if (!(await signInWithGoogle())) {
			setDisable(false);
		}
	};
	return (
		<button
			className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset] flex items-center m-auto"
			onClick={login}
		>
			<IconBrandGoogleFilled />
			<span className="">oogle</span>
		</button>
	);
}

export default LoginBtn;
