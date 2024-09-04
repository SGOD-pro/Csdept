"use client";
import React, { useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { getAuthState, useAuthStore } from "@/store/authStore";
import { Vortex } from "../components/ui/vortex";
const HyperText = lazy(() => import("@/components/magicui/hyper-text"));
dynamic;
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const LoginBtn = dynamic(() => import("@/components/ui/LoginBtn"));
const staggerContainer = {
	hidden: { opacity: 1 },
	show: { opacity: 1, transition: { staggerChildren: 0.4 } },
};

const staggerChild = {
	hidden: { opacity: 0, y: 50 },
	show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};
export default function Home() {
	const { verifySession } = getAuthState();
	const { isVerified, isAdmin } = useAuthStore((state) => ({
		isVerified: state.userPrefs?.isVerified,
		isAdmin: state.userPrefs?.isAdmin,
	}));
	const router = useRouter();

	useEffect(() => {
		async function verify() {
			const respose = await verifySession();
			if (respose?.isAdmin) {
				router.push("/admin");
			} else if (respose?.isVerified) {
				router.push("/home");
			}
		}
		if (isAdmin) {
			verify();
		}
	}, []);

	if (isVerified) {
		router.push("/home");
		return null;
	}
	if (isAdmin) {
		router.push("/admin");
		return null;
	}

	return (
		<main className="w-full h-[100dvh]">
			<Vortex
				rangeY={800}
				particleCount={600}
				backgroundColor="black"
				baseHue={190}
				className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
			>
				<div className=" rounded-lg flex items-center flex-col p-4 h-[70dvh] sm:w-2/3 justify-center">
					<Suspense
						fallback={
							<div className="animate-pulse h-[64px] w-72 rounded"></div>
						}
					>
						<HyperText
							className="text-4xl sm:text-5xl font-bold text-white"
							text="The OG CS Dept"
							duration={1.5}
						/>
					</Suspense>
					<motion.div
						className=""
						initial="hidden"
						animate="show"
						variants={staggerContainer}
					
					>
						<motion.p
							className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center"
							variants={staggerChild}
						>
							Get ready for an unforgettable journey filled with excitement{","}{" "}
							laughter{","} and lasting memories!
						</motion.p>

						{/* Animated Button */}
						<motion.div
							className="flex flex-col sm:flex-row items-center gap-4 mt-6"
							variants={staggerChild}
						>
							<LoginBtn />
						</motion.div>
					</motion.div>
				</div>
			</Vortex>
		</main>
	);
}
