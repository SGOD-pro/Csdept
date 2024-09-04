import { db } from "@/config";
import {
	addDoc,
	collection,
	serverTimestamp,
	doc,
	updateDoc,
	getDocs,
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
		if (value.paymentMode === "Online" && value.paymentPhoto) {
			photoURL = await uploadFile(value.paymentPhoto, "upload/qrcode");
		}
		console.log("submit");

		await addDoc(collectionRef, {
			email: value.email,
			name: value.name,
			performanceName: value.performanceName,
			qrcode: photoURL?.fileURL || null,
			paymentMode: value.paymentMode,
			rollNo: value.rollNo,
			semister: value.semister,
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
export interface Result extends FormSchema {
	uid:string;
	qrcode: string;
}
export async function fetchAllRecords() {
	const collectionRef = collection(db, "fresherParty");
	try {
		const querySnapshot = await getDocs(collectionRef);
		const records: Result[] = querySnapshot.docs.map((doc) => ({
			uid: doc.id,
			email: doc.data().email,
			name: doc.data().name,
			performanceName: doc.data().performanceName,
			paymentMode: doc.data().paymentMode,
			rollNo: doc.data().rollNo,
			semister: doc.data().semister,
			qrcode: doc.data().qrcode,
		}));
		return records;
	} catch (error) {
		console.error("Error fetching records: ", error);
	}
}
