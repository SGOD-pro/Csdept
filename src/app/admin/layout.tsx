"use client";
import { SparklesCore } from "@/components/magicui/sparkels";
import { useAuthStore } from "../../../store/authStore";
import { notFound } from "next/navigation";
import React from "react";
import { useRouter } from "next/navigation";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { userPref, verify } = useAuthStore((state) => ({
		userPref: state.userPrefs,
		verify: state.verifySession,
		
	}));
	const router=useRouter()
	React.useEffect(() => {
		async function verifySession() {
			const resposne = await verify();
			if (!resposne?.isAdmin) {
				router.push("/")
			}
		}
		verifySession();
	}, []);

	if (!userPref?.isAdmin) {
		notFound();
	}
	return (
		<>
			<div className="fixed w-full h-[100dvh] top-0 left-0 opacity-65 -z-10">
				<SparklesCore
					id="tsparticlesfullpage"
					background="transparent"
					minSize={0.6}
					maxSize={1.8}
					particleDensity={100}
					className="w-full h-full"
					particleColor="#FF4500"
				/>
			</div>
			{children}
		</>
	);
}
