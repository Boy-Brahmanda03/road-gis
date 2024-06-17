import clsx from "clsx";

export default function Card({ data, title, type }) {
  const customClassname = clsx("w-full", "h-fit", "rounded-lg", "shadow-sm", "border-2", "p-5", "hover:shadow-md", {
    "border-red-100 hover:bg-red-50": type == "rusak",
    "border-yellow-100 hover:bg-yellow-50": type == "sedang",
    "border-green-100 hover:bg-green-50": type == "bagus",
  });

  const customTextDataStyle = clsx("text-6xl text-center font-bold", {
    "text-red-300": type == "rusak",
    "text-yellow-300": type == "sedang",
    "text-green-300": type == "bagus",
  });
  return (
    <>
      <div className={customClassname}>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 items-center">
            <p className={customTextDataStyle}>{data}</p>
            <h1 className="text-center h-fit font-semibold text-lg">{title}</h1>
          </div>
        </div>
      </div>
    </>
  );
}
