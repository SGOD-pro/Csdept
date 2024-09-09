"use client";

import * as React from "react";
import {
	CaretSortIcon,
	ChevronDownIcon,
	DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { fetchAllRecords, Result } from "@/hooks/FormSubmit";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { SlidersHorizontal } from "lucide-react";
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
import PaidCell from "../magicui/PaidCell";
export const Columns: ColumnDef<Result>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => row.getValue("name"),
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
	},
	{
		accessorKey: "performanceName",
		header: "Performance Name",
		cell: ({ row }) => row.getValue("performanceName"),
	},
	{
		accessorKey: "paymentMode",
		header: "Payment Mode",
		cell: ({ row }) => row.getValue("paymentMode"),
	},
	{
		accessorKey: "rollNo",
		header: "Roll Number",
		cell: ({ row }) => row.getValue("rollNo"),
	},
	{
		accessorKey: "semister",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Semister
					<CaretSortIcon className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => row.getValue("semister"),
	},
	{
		accessorKey: "qrcode",
		header: "Screenshot",
		cell: ({ row }) => {
			const qrcodeUrl = row.original.qrcode || null;

			return (
				<>
					{qrcodeUrl ? (
						<a
							href={qrcodeUrl}
							target="_blank"
							className="underline text-blue-500"
						>
							Preview
						</a>
					) : (
						<span>No QR Code</span>
					)}
				</>
			);
		},
	},
	{
		header: "Paid",
		cell: ({ row }) => <PaidCell data={row.original} />,
	},
];

export default function DataTableDemo() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [data, setData] = React.useState<Result[]>([]);
	React.useEffect(() => {
		async function record() {
			const result = await fetchAllRecords();
			if (result) {
				setData(result);
			}
		}
		record();
	}, []);
	const table = useReactTable({
		data,
		columns:Columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	const HeaderComponent = React.memo(() => {
		return (
			<>
				<div className="space-y-3 sm:space-y-0 sm:flex gap-2 relative z-10">
					<Input
						placeholder="Filter name..."
						value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
						onChange={(event) =>
							table.getColumn("name")?.setFilterValue(event.target.value)
						}
						className="max-w-sm min-w-72"
					/>
					<Select
						onValueChange={(event) =>
							table.getColumn("paymentMode")?.setFilterValue(event)
						}
						value={
							(table.getColumn("paymentMode")?.getFilterValue() as string) ?? ""
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Mode" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value=" ">All</SelectItem>
							<SelectItem value="Online">Online</SelectItem>
							<SelectItem value="Offline">Offline</SelectItem>
						</SelectContent>
					</Select>
					<Select
						onValueChange={(event) =>
							table.getColumn("semister")?.setFilterValue(event)
						}
						value={
							(table.getColumn("semister")?.getFilterValue() as string) ?? ""
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Semister" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value=" ">All</SelectItem>
							<SelectItem value="1st sem">1st Sem</SelectItem>
							<SelectItem value="3rd sem">3rd Sem</SelectItem>
							<SelectItem value="5th sem">5th Sem</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto w-full sm:w-fit">
							Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</>
		);
	});

	HeaderComponent.displayName = "HeaderComponent";
	return (
		<div className="w-full">
			<div className="flex items-center justify-end sm:justify-normal px-2 sm:py-0 py-4">
				<div className="gap-2 hidden sm:flex justify-between w-full relative z-10">
					<HeaderComponent />
				</div>
				<Dialog>
					<DialogTrigger className="sm:hidden">
						<Button variant={"outline"} size={"icon"} type="button">
							{" "}
							<SlidersHorizontal />
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Filters</DialogTitle>
							<DialogDescription className="space-y-3 px-4 sm:p-0 relative z-10">
								<HeaderComponent />
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={Columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center space-x-2 py-4 ">
				<div className="text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
