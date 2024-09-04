import { z } from "zod";
export const formSchama = z.object({
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
	performanceName: z
		.array(z.string())
		.refine((value) => value.some((item) => item), {
			message: "You have to select at least one item.",
		}),
	semister: z.string(),
});

export type FormSchema = z.infer<typeof formSchama>;
