import { z } from "zod";

export const formSchema = z
	.object({
		name: z.string(),
		email: z.string().email(),
		paymentMode: z.string(),
		paymentPhoto: z
			.instanceof(File)
			.refine((file) => file.size < 5 * 1024 * 1024, {
				message: "File must be smaller than 5MB",
			})
			.refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
				message: "File must be an image (JPEG or PNG)",
			})
			.optional(),
		rollNo: z.number().nonnegative(),
		performanceName: z.array(z.string()).refine((value) => value.length > 0, {
			message: "You have to select at least one item.",
		}),
		semister: z.string(),
	})
	.refine(
		(data) => {
			if (data.paymentMode === "online") {
				return data.paymentPhoto !== undefined && data.paymentPhoto !== null;
			}
			return true;
		},
		{
			message: "Payment photo is required for online payment.",
			path: ["paymentPhoto"],
		}
	);

export type FormSchema = z.infer<typeof formSchema>;
