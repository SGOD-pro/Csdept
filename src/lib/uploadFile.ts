import { storage } from "@/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
async function uploadFile(
	file: File,
	path:string,
): Promise<{ fileURL: string; error?: Error }> {
	const storageRef = ref(storage, `${path}/IMG-${new Date()}`);
	try {
		const snapshot = await uploadBytes(storageRef, file);
		console.log("Uploaded a file!", snapshot);
		const downloadURL = await getDownloadURL(storageRef);
		console.log("File available at", downloadURL);
		return { fileURL: downloadURL };
	} catch (error) {
		console.error("Error uploading file:", error);
		return {fileURL:"", error: error as Error };
	}
}
export default uploadFile;