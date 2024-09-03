import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { auth, db } from "@/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
	signOut,
	onAuthStateChanged,
	signInWithPopup,
	GoogleAuthProvider,
} from "firebase/auth";

export interface UserPrefs {
	isAdmin?: boolean;
	isSubmitted?: boolean;
	isVerified?: boolean;
}
interface User {
	uid: string;
	email: string;
	displayName: string;
	photoURL?: string;
}
interface AdminAuth {
	user: User | null;
	userPrefs: UserPrefs | null;
	hydrated: boolean;
	setHydrated(): void;
	verifySession(): Promise<void>;
	logout(): Promise<{ success: boolean; error?: Error }>;
	signInWithGoogle(): Promise<{ success: boolean; error?: Error }>;
}

export const useAuthStore = create<AdminAuth>()(
	persist(
		immer((set) => ({
			user: null,
			userPrefs: null,
			hydrated: false,

			setHydrated() {
				set({ hydrated: true });
			},

			async verifySession() {
				return new Promise<void>((resolve) => {
					const unsubscribe = onAuthStateChanged(auth, async (user) => {
						if (user) {
							const userDocRef = doc(db, "users", user.uid);
							const userDoc = await getDoc(userDocRef);
							const userDetails: User = {
								uid: user.uid,
								email: user.email!,
								displayName: user.displayName!,
								photoURL: user.photoURL!,
							};
							if (userDoc.exists()) {
								set({
									user: userDetails,
									userPrefs: userDoc.data() as UserPrefs,
								});
								if (userDoc.data()?.isAdmin) {
									set({ user: null, userPrefs: null });
								}
								console.log(userDoc.data());
							} else {
								set({ user: userDetails, userPrefs: null });
							}
						} else {
							console.log("no user");
							set({ user: null, userPrefs: null });
						}
						set({ hydrated: true });
						resolve();
					});
					return () => unsubscribe();
				});
			},

			async signInWithGoogle() {
				const provider = new GoogleAuthProvider();
				try {
					const result = await signInWithPopup(auth, provider);
					const user = result.user;
					const userDetails: User = {
						uid: user.uid,
						email: user.email!,
						displayName: user.displayName!,
						photoURL: user.photoURL!,
					};
					const userDocRef = doc(db, "users", user.uid);
					const userDoc = await getDoc(userDocRef);
					if (!userDoc.exists()) {
						await setDoc(doc(db, "users", user.uid), {
							isVerified: true,
						} as UserPrefs);
						set({ user: userDetails, userPrefs: { isVerified: true } });
					} else {
						set({ user: userDetails, userPrefs: userDoc.data() });
					}
					return { success: true };
				} catch (error) {
					console.error("Error during Google Sign-In:", error);
					return { success: false, error: error as Error };
				}
			},

			async logout() {
				try {
					await signOut(auth);
					set({ user: null, userPrefs: null });
					return { success: true };
				} catch (error) {
					console.log(error);
					return { success: false, error: error as Error };
				}
			},
		})),
		{
			name: "auth",
			onRehydrateStorage() {
				return (state, error) => {
					if (!error) state?.setHydrated();
				};
			},
		}
	)
);

export const getAuthState = () => useAuthStore.getState();
