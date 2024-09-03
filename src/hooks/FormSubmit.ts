import { db } from "@/config";
import {
	addDoc,
	collection,
	serverTimestamp,
	doc,
	updateDoc,
} from "firebase/firestore";
import { FormSchema } from "@/schema/formSchema";
import { getAuthState } from "../../store/authStore";
import uploadFile from "@/lib/uploadFile";

export async function submit(value: FormSchema): Promise<{ success: boolean }> {
	const { user } = getAuthState();
	if (!user) {
		return { success: false };
	}
	try {
		const collectionRef = collection(db, "fresherParty");
		const userDocRef = doc(db, "users", user.uid);

		let photoURL = null;
		if (value.paymentMode === "Online"&&value.paymentPhoto) {
			photoURL = await uploadFile(value.paymentPhoto, "upload/qrcode");
		}
		console.log("submit");
		
		await addDoc(collectionRef, {
			email: value.email,
			name: value.name,
			performanceName: value.performanceName,
			qrcode: photoURL?.fileURL||null,
			paymentMode: value.paymentMode,
			rollNo: value.rollNo,
			year: value.year,
			createdAt: serverTimestamp(),
			uid: user.uid,
		});
		await updateDoc(userDocRef, {
			isSubmitted: true,
		});
		return { success: true };
	} catch (error) {
		console.log(error);
		return { success: false };
	}
}
