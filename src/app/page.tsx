"use client";
import React, { useEffect, lazy,Suspense } from "react";
import { motion } from "framer-motion";
import { getAuthState, useAuthStore } from "../../store/authStore";
import { Vortex } from "../components/ui/vortex";
const HyperText = lazy(() => import("@/components/magicui/hyper-text"));
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function Home() {
	const { signInWithGoogle, verifySession } = getAuthState();
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
				<Suspense fallback={<div className="animate-pulse h-[64px] w-72 rounded"></div>}>
            <HyperText
              className="text-4xl sm:text-5xl font-bold text-white"
              text="The OG CS Dept"
              duration={1.5}
            />
          </Suspense>
					<motion.p
						className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: "easeOut", delay: 0.5,staggerChildren:.5 }}
					>
						This is a deep dive into code. It&apos;ll push your limits, and
						you&apos;ll emerge with skills that last a lifetime.
					</motion.p>

					{/* Animated Button */}
					<motion.div
						className="flex flex-col sm:flex-row items-center gap-4 mt-6"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
					>
						<button
							className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset] flex items-center"
							onClick={signInWithGoogle}
						>
							<IconBrandGoogleFilled />
							<span className="">oogle</span>
						</button>
					</motion.div>
				</div>
			</Vortex>
		</main>
	);
}
