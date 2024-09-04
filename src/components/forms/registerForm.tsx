"use client";
import { ScanQrCode } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { submit as formSubmit } from "@/hooks/FormSubmit";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema, FormSchema } from "@/schema/formSchema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { useAuthStore } from "../../store/authStore";
import FileInput from "../ui/FileInput";
import Image from "next/image";

const items = [
	{
		id: "Dance",
		label: "Dance",
	},
	{
		id: "Singing",
		label: "Singing",
	},
	{
		id: "Modeling",
		label: "Modeling",
	},
	{
		id: "Drama",
		label: "Drama",
	},
	{
		id: "Poetry",
		label: "Poetry",
	},
	{
		id: "Comedy",
		label: "Comedy",
	},
] as const;

export default function InputForm() {
	const { user } = useAuthStore((state) => ({ user: state.user }));

	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			performanceName: [],
			email: user?.email || "",
		},
	});
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	async function onSubmit(data: FormSchema) {
		// Validate the form data explicitly before proceeding
		const parsedData = formSchema.safeParse(data);

		if (!parsedData.success) {
			// If validation fails, show the first error and return
			const firstError = parsedData.error.errors[0];
			toast({
				title: "Error",
				description: firstError.message,
			});
			return;
		}

		if (data.paymentMode === "Online" && !data.paymentPhoto) {
			toast({
				title: "Please add payment photo",
				description: "Payment photo is required for online payment.",
			});
			return; 
		}
		setDisable(true);
		const response = await formSubmit(data);

		if (response.success) {
			toast({
				title: "Thank you!",
				description: "Your entry has been recorded. Enjoy the event!",
			});
		} else {
			toast({
				title: "Sorry, something went wrong!",
				description: "Please try again later.",
			});
			setDisable(false);
		}
	}
	const [disable, setDisable] = React.useState(false);
	const [paymentMode, setPaymentMode] = React.useState(false);
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="gap-4 grid sm:grid-cols-2 items-end border p-3 rounded-md my-8 w-full"
			>
				{/* Email Field */}
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									placeholder="Email"
									{...field}
									readOnly
									className=" grayscale"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Name Field */}
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Name" {...field} disabled={disable} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Payment Mode Field */}
				<FormField
					control={form.control}
					name="paymentMode"
					render={({ field }) => (
						<FormItem className="space-y-3">
							<FormLabel>Payment Mode</FormLabel>
							<FormControl className="">
								<RadioGroup
									onValueChange={(e) => {
										setPaymentMode(e === "Online");
										field.onChange(e);
									}}
									defaultValue={field.value}
									className=" space-y-1 flex justify-around items-center"
									disabled={disable}
								>
									<FormItem className="flex items-center space-x-3 space-y-0 border w-full justify-center h-full rounded-md py-3">
										<FormControl>
											<RadioGroupItem value="Offline" />
										</FormControl>
										<FormLabel className="font-normal">Offline</FormLabel>
									</FormItem>
									<FormItem className="flex items-center space-x-3 space-y-0 border w-full justify-center h-full rounded-md py-3">
										<FormControl>
											<RadioGroupItem value="Online" />
										</FormControl>
										<FormLabel className="font-normal">Online</FormLabel>
									</FormItem>
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="py-3">
					<Dialog>
						<DialogTrigger className="flex items-center gap-3">
							<span className="">Tap to view the qrcode</span>
							<Button variant={"outline"} size={"icon"} type="button">
								{" "}
								<ScanQrCode />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Rs: 100</DialogTitle>
								<DialogDescription>
									<Image
										src={"/qrcode.jpg"}
										alt="qrcode"
										width={450}
										height={580}
										className="w-full size-fit object-contain max-h-[70dvh]"
									/>
								</DialogDescription>
							</DialogHeader>
						</DialogContent>
					</Dialog>
				</div>
				{/* Payment Photo Field */}
				<FormField
					control={form.control}
					name="paymentPhoto"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Payment Photo {"  "}{" "}
								<span className="text-rose-600 text-xs">
									*Attach a screenshot of your payment.
								</span>
							</FormLabel>
							<FormControl>
								<FileInput
									onChange={(file) => field.onChange(file)}
									accept="image/*"
									ref={fileInputRef}
									disabled={disable || !paymentMode}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Roll Number Field */}
				<FormField
					control={form.control}
					name="rollNo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Roll Number</FormLabel>
							<FormControl>
								<Input
									placeholder="Roll Number"
									type="number"
									value={field.value?.toString() || ""}
									onChange={(e) => field.onChange(Number(e.target.value))}
									disabled={disable}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Performance Field */}
				<FormField
					control={form.control}
					name="performanceName"
					render={() => (
						<FormItem>
							<FormLabel className="text-base">Performace</FormLabel>
							<DropdownMenu modal={false}>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="w-full"
										disabled={disable}
									>
										{form.watch("performanceName").join(", ") || "Choose"}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56 space-y-2">
									<DropdownMenuLabel>Names</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<ScrollArea className="h-40 w-full rounded-md border p-1">
										{items.map((item) => (
											<FormField
												key={item.id}
												control={form.control}
												name="performanceName"
												render={({ field }) => {
													return (
														<DropdownMenuItem
															onSelect={(event) => event.preventDefault()}
														>
															<FormItem
																key={item.id}
																className="flex space-x-3 space-y-0"
															>
																<FormControl className="space-y-4">
																	<Checkbox
																		checked={field.value?.includes(item.id)}
																		onCheckedChange={(checked) => {
																			return checked
																				? field.onChange([
																						...field.value,
																						item.id,
																				  ])
																				: field.onChange(
																						field.value?.filter(
																							(value) => value !== item.id
																						)
																				  );
																		}}
																	/>
																</FormControl>
																<FormLabel className="font-normal block">
																	{item.label}
																</FormLabel>
															</FormItem>
														</DropdownMenuItem>
													);
												}}
											/>
										))}
									</ScrollArea>
								</DropdownMenuContent>
							</DropdownMenu>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Year Field */}
				<FormField
					control={form.control}
					name="semister"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Curent Semister</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
								disabled={disable}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select the current year" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="1st sem">1st Sem</SelectItem>
									<SelectItem value="3rd sem">3rd Sem</SelectItem>
									<SelectItem value="5th sem">5th Sem</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="sm:mt-7" disabled={disable}>
					Submit
				</Button>
			</form>
		</Form>
	);
}
