"use client";

import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ images }: { images: string[] }) => {
	const [currentImage, setCurrentImage] = useState(images[0]);

	return (
		<div>
			<div className="hover:cursor-pointer hover:shadow-lg hover:scale-110 duration-300 transition-all ease-in-out space-y-4 mr-10 mt-10">
				<Image
					src={currentImage}
					alt="product image"
					width={500}
					height={500}
				/>
			</div>

			{images.length > 1 && (
				<div className="flex gap-2 mt-8 ">
					{images.map((image) => (
						<div
							key={image}
							className="border hover:cursor-pointer hover:border-blue-500 hover:scale-110 hoverr:shadow-lg duration-300 transition-all ease-in-out">
							<Image
								src={image}
								alt="product image"
								width={70}
								height={70}
								className="cursor-pointer"
								onClick={() => setCurrentImage(image)}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ProductImages;
