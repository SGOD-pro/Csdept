"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { submit as formSubmit } from "@/hooks/FormSubmit";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchama, FormSchema } from "@/schema/formSchema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
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
import { useAuthStore } from "../../../store/authStore";
import FileInput from "../ui/FileInput";

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
		resolver: zodResolver(formSchama),
		defaultValues: {
			performanceName: [],
			email: user?.email || "",
		},
	});
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	async function onSubmit(data: FormSchema) {
		setDisable(true);
		const resonse = await formSubmit(data);
		if (resonse.success) {
			toast({
				title: "Thank you!",
				description: "Your entry has been recorded. Enjoy the event!",
			});
		} else {
			toast({
				title: "Sorry something went wrong!",
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
				className="gap-4 grid sm:grid-cols-2 items-center border p-3 rounded-md my-8 w-full"
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

				{/* Payment Photo Field */}
				<FormField
					control={form.control}
					name="paymentPhoto"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Payment Photo URL</FormLabel>
							<FormControl>
								<FileInput
									onChange={(file) => field.onChange(file)}
									accept="image/*"
									ref={fileInputRef}
									disabled={disable || !paymentMode}
								/>
							</FormControl>
							<FormMessage />
							<FormDescription className="text-xs text-rose-600">
								*Attach a screenshot of your payment.
							</FormDescription>
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
					name="year"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Curent Year</FormLabel>
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
									<SelectItem value="1st year">1st Year</SelectItem>
									<SelectItem value="2nd year">2nd Year</SelectItem>
									<SelectItem value="3rd year">3rd Year</SelectItem>
									<SelectItem value="4th year">4th Year</SelectItem>
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
