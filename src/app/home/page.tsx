"use client";
import InputForm from "@/components/forms/registerForm";
import { SparklesCore } from "@/components/magicui/sparkels";
import Image from "next/image";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from "next/navigation";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import React from "react";
import { cn } from "@/lib/utils";

function Page() {
	const router = useRouter();
	const { userPrefs, user, verify } = useAuthStore((state) => ({
		userPrefs: state.userPrefs,
		verify: state.verifySession,
		user: state.user,
	}));
	console.log(userPrefs?.isSubmitted);

	React.useEffect(() => {
		async function verifySession() {
			const response = await verify();
			if (!response?.isVerified) {
				router.push("/");
			}
		}
		verifySession();
	}, []);
	if (!user || !userPrefs?.isVerified) {
		router.push("/");
		return null;
	}
	return (
		<div className="flex flex-col items-center justify-center w-full min-h-[100dvh] sm:h-[100dvh] py-8 px-2">
			<div className="fixed w-full h-full top-0 left-0 opacity-65 -z-10">
				<SparklesCore
					id="tsparticlesfullpage"
					background="transparent"
					minSize={0.6}
					maxSize={1.4}
					particleDensity={100}
					className="w-full h-full"
					particleColor="#FFFFFF"
				/>
			</div>

			<div className="flex justify-end items-center gap-3 absolute right-2 sm:right-4 top-4 border rounded-md p-2 px-4 backdrop-blur-sm">
				<div className="">
					<h3 className="text-lg leading-none">{user.email}</h3>
					<p className="text-sm capitalize leading-none">{user.displayName}</p>
				</div>
				<Image
					width={100}
					height={100}
					src={user.photoURL || ""}
					className="w-16 h-16 object-cover object-top rounded-full"
					alt="CS"
				/>
			</div>

			{userPrefs.isSubmitted ? (
				<AnimatedGradientText className="p-4">
					<span
						className={cn(
							`inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent text-3xl sm:text-5xl font-semibold`
						)}
					>
						Thank you for your participation
					</span>
				</AnimatedGradientText>
			) : (
				<div className="mt-16 sm:mt-0 w-full sm:w-1/2 mx-auto">
					<InputForm />
				</div>
			)}
		</div>
	);
}

export default Page;
