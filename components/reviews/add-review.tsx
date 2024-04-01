import Image from "next/image";
import ReviewsPadding from "../util/reviews-padding";

export default function AddReview() {
	return (
		<ReviewsPadding>
			<div className="flex gap-6 flex-col sm:flex-row">
				<div className="flex-1">
					<Image
						src="/under-rock.png"
						alt="image"
						height={400}
						width={400}
						className="rounded-lg"
					/>
				</div>
				<div className="flex-1 grid grid-cols-1 gap-2">
					<div
						className="
               active:bg-gray-100 
               max-sm:py-8 
               active:border-gray-100 
               active:opacity-50 
               md:hover:bg-gray-100 
               hover:cursor-pointer 
               border 
               border-dashed 
               px-10 
               border-spacing-24 
               rounded-lg 
               border-gray-500 
               flex 
               justify-center 
               items-center"
					>
						<Image src={"/add_black.svg"} width={17} height={17} alt="add" />
					</div>
					<div
						className="
              active:bg-gray-100 
              max-sm:py-8 
              active:border-gray-100 
              active:opacity-50 
              md:hover:bg-gray-100 
              hover:cursor-pointer 
              border 
              border-dashed 
              px-10 
              border-spacing-24 
              rounded-lg 
              border-gray-500 
              flex 
              justify-center 
              items-center"
					>
						<div className="flex gap-2 items-center">
							<div>
								<Image
									src={"/add_black.svg"}
									width={17}
									height={17}
									alt="add"
								/>
							</div>
							<div className="font-semibold">Add location</div>
						</div>
					</div>
				</div>
			</div>
			<div>
				<textarea
					rows={6}
					cols={50}
					className="border-[0.75px] my-2 w-full p-2 outline-none rounded-md border-gray-400"
				>
					Type in your reviews or captions here
				</textarea>
			</div>
			<div className="w-full flex justify-end">
				<button
					className="
                bg-[#4159AD] 
                md:hover:bg-[#2f407e] 
                active:opacity-50 
                text-white 
                rounded-md 
                px-4 
                py-2"
				>
					Submit
				</button>
			</div>
		</ReviewsPadding>
	);
}
