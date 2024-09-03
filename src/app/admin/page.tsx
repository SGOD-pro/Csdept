"use client";
import React, { lazy } from "react";
import dynamic from "next/dynamic";

const DataTableDemo = dynamic(() => import("@/components/ui/Result"));
import { getAuthState } from "../../../store/authStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Result() {
	const router=useRouter()
	const { logout } = getAuthState();
	const out = async () => {
		await logout();
		router.push("/");
	};
	return (
		<main className="w-full h-[100dvh] p-5">
			<DataTableDemo />
			<div className="fixed bottom-5 right-8">
				<Button onClick={out} variant={"destructive"}>
					Logout
				</Button>
			</div>
		</main>
	);
}

export default Result;
