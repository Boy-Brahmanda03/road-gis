import clsx from "clsx";
import Image from "next/image";

export default function Card({ icon, data, title, type }) {
  const customClassname = clsx("w-full", "h-fit", "rounded-lg", "shadow-sm", "border-2", "p-5", "hover:shadow-md", {
    "border-red-100": type == "rusak",
    "border-yellow-100": type == "sedang",
    "border-green-100": type == "bagus",
  });

  const customTextDataStyle = clsx("text-6xl text-center font-bold", {
    "text-red-300": type == "rusak",
    "text-yellow-300": type == "sedang",
    "text-green-300": type == "bagus",
  });
  return (
    <>
      <div className={customClassname}>
        <div className="grid grid-cols-3">
          <Image src={icon} alt={"Card Icon"} width={150} />
          <div className="col-span-2 grid grid-cols-1 items-center">
            <p className={customTextDataStyle}>{data}</p>
            <h1 className="text-center h-fit font-semibold text-lg">{title}</h1>
          </div>
        </div>
      </div>
    </>
  );
}
