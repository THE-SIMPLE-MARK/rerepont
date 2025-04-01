"use server"

import { z } from "zod"

const dataSchema = z.object({
	id: z.number(),
	ean: z.string(),
	short_name: z.string(),
	material: z.string(),
	amount: z.number(),
	capacity: z.number(),
	is_refillable: z.number(),
	shape: z.string(),
	manufacturer: z.string(),
	type: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
})

export type DataSchema = z.infer<typeof dataSchema>

const apiResponseSchema = z.object({
	whitelist: z.array(dataSchema),
})

export async function getWhitelistData(formData: FormData) {
	try {
		const eanCode = formData.get("eanCode") as string

		if (!eanCode) {
			return {
				error: "FIELD_EMPTY",
				data: null,
			}
		}

		const response = await fetch(
			`https://repont.hu/hu/api/whitelist?ean=${eanCode}&locale=hu`,
			{ cache: "no-store" }
		)

		if (!response.ok) {
			return {
				error: "Sikertelen lekérés",
				status: response.status,
				data: null,
			}
		}

		const responseData = await response.json()

		const validationResult = apiResponseSchema.safeParse(responseData)

		if (!validationResult.success) {
			return {
				error: "ERROR",
				data: null,
			}
		}

		if (validationResult.data.whitelist.length === 0) {
			return {
				error: "NOT_FOUND",
				data: null,
			}
		}

		return {
			error: null,
			data: validationResult.data.whitelist[0],
		}
	} catch (error) {
		console.error(error)
		return {
			error: "ERROR",
			data: null,
		}
	}
}
