import Image from 'next/image'

export default function Home() {
	return (
		<div className="relative min-h-screen">
			{/* Background image */}
			<div className="absolute inset-0 -z-10">
				<Image
					alt="Background"
					src="https://static.wixstatic.com/media/c837a6_2119733e838e4a2f8813ebde736f99d5~mv2.jpg/v1/fill/w_2538,h_1950,al_b,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_2119733e838e4a2f8813ebde736f99d5~mv2.jpg"
					fill
					sizes="100vw"
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-black/30" />
			</div>

			{/* Foreground content */}
			<div className="relative z-10 flex min-h-screen items-center justify-center p-8">
				<div className="text-center text-white max-w-2xl">
					<h1 className="text-4xl font-bold mb-4">Welcome</h1>
					<p className="text-lg opacity-90">This app uses a full-screen background image.</p>
				</div>
			</div>
		</div>
	)
}