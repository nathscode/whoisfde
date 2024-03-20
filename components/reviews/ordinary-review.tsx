import Image from "next/image";

export default function OrdinaryReview({
  name,
  work,
  body,
  image,
}: {
  image: string;
  name: string;
  body: string;
  work: string;
}) {
  return (
    <div className="flex gap-5">
      <div>
        <Image src={image} className="" width={175} height={175} alt="og" />
      </div>
      <div>
        <div className="text-xl">{name}</div>
        <div className="text-sm font-light mt-1 mb-4">{work}</div>
        <div className="text-sm">{body}</div>
      </div>
    </div>
  );
}
