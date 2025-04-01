import { ReactNode } from "react"

export default function StaticContentWrapper({
	children,
}: {
	children: ReactNode
}) {
	return (
		<div className="flex h-screen w-full flex-col">
			<header className="p-3">
				<p className="font-semibold">reREPONT</p>
			</header>

			<main className="flex grow flex-col items-center justify-center gap-4">
				<h1 className="text-6xl font-semibold">
					REPont<sup>©</sup> Kódkereső
				</h1>
				<p className="max-w-xl text-center text-xl">
					Nem tudod, hogy a 40 millió jelölésből melyik vonatkozik
					Magyarországra? Most megtudhatod.
				</p>

				{children}
			</main>

			<footer className="flex flex-row justify-between border-t border-gray-200 bg-gray-100 p-3">
				<p>© reREPONT</p>
				<p>
					Az adatok a REPONT<sup>©</sup> oldaláról származnak.
				</p>
			</footer>
		</div>
	)
}
