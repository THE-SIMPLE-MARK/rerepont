"use client"

import { Input } from "@heroui/input"
import { Button } from "@heroui/button"
import { useState, useEffect } from "react"
import { Toaster, toast } from "sonner"
import { getWhitelistData } from "../actions"
import { z } from "zod"
import type { DataSchema } from "../actions"
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
} from "@heroui/table"

const eanSchema = z
	.string()
	.min(1, "Kérem adja meg a vonalkódot.")
	.regex(/^\d+$/, "A vonalkód csak számokat tartalmazhat.")
	.length(13, "A vonalkódnak 13 számjegyből kell állnia.")

const getErrorMessage = (result: z.SafeParseError<string>): string =>
	result.error.errors[0]?.message ?? "Érvénytelen vonalkód"

export default function Form() {
	const [eanCode, setEanCode] = useState<string>("")
	const [error, setError] = useState<string>("")
	const [data, setData] = useState<DataSchema | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	// revalidate on input change
	useEffect(() => {
		if (!eanCode) {
			setError("")
			return
		}

		const validationResult = eanSchema.safeParse(eanCode)
		if (!validationResult.success) {
			setError(getErrorMessage(validationResult))
			return
		}

		setError("")
	}, [eanCode])

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()

		setData(null)

		// skip validation if already has errors or is already loading
		if (error || isLoading) return

		setIsLoading(true)

		try {
			const formData = new FormData(e.currentTarget)
			const result = await getWhitelistData(formData)
			console.log(result)

			if (result.error) {
				switch (result.error) {
					case "FIELD_EMPTY":
						toast.error("Kérem adja meg a lekérendő kódot.")
						break
					case "NOT_FOUND":
						toast.error("Ez a termék nem található vagy nem visszaváltható.")
						break
					default:
						toast.error("Ismeretlen hiba történt a lekérés során!")
				}
			} else {
				setData(result.data ?? null)
			}
		} catch (err) {
			toast.error("Hiba történt a kérés feldolgozása során.")
			console.error(err)
		} finally {
			setIsLoading(false)
		}
	}

	const isInvalid = Boolean(error)
	const clearInput = () => setEanCode("")

	return (
		<>
			<Toaster richColors position="bottom-center" />
			<form className="flex flex-row gap-2" onSubmit={handleSubmit}>
				<Input
					variant="faded"
					placeholder="Vonalkód"
					maxLength={13}
					type="text"
					inputMode="numeric"
					className="w-64"
					size="lg"
					value={eanCode}
					onValueChange={setEanCode}
					name="eanCode"
					isInvalid={isInvalid}
					errorMessage={error}
					isClearable
					onClear={clearInput}
				/>

				<Button
					type="submit"
					size="lg"
					variant="faded"
					isLoading={isLoading}
					isDisabled={isInvalid || !eanCode}
					style={{
						width: isLoading ? "154px" : "110px",
						transition: "width 200ms ease-in-out",
					}}
				>
					Keresés
				</Button>
			</form>

			<div
				className="w-fit transition-all ease-in-out"
				style={{ height: data ? "115px" : "0px" }}
			>
				{data && <ResultTable data={data} />}
			</div>
		</>
	)
}

function ResultTable({ data }: { data: DataSchema }) {
	const formattedAmount = new Intl.NumberFormat("hu-HU", {
		style: "currency",
		currency: "HUF",
		maximumFractionDigits: 0,
	}).format(data.amount)

	return (
		<div className="m-4 w-full">
			<Table aria-label="Termék adatok" classNames={{ th: "uppercase" }}>
				<TableHeader>
					<TableColumn>Érték</TableColumn>
					<TableColumn>Gyártó</TableColumn>
					<TableColumn>Kategória</TableColumn>
					<TableColumn>Forma</TableColumn>
					<TableColumn>Űrtartalom</TableColumn>
					<TableColumn>Anyag</TableColumn>
					<TableColumn>Űjratölthetőség</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow key={data.id}>
						<TableCell>{formattedAmount}</TableCell>
						<TableCell>{data.manufacturer}</TableCell>
						<TableCell>{data.type}</TableCell>
						<TableCell>{data.shape}</TableCell>
						<TableCell>{data.capacity} L</TableCell>
						<TableCell>{data.material}</TableCell>
						<TableCell>
							{data.is_refillable ? "Újratölthető" : "Nem újratölthető"}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	)
}
