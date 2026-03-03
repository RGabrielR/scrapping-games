interface ImageDescriptionProps {
  data: string[];
}

const ImageDescription = ({ data }: ImageDescriptionProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 sm:items-start">
      {data.map((item, index) => (
        <p
          key={`${item}-${index}`}
          className="w-full max-w-[13rem] rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-center text-sm font-semibold text-slate-700 shadow-sm sm:text-[0.92rem]"
        >
          {item}
        </p>
      ))}
    </div>
  );
};

export default ImageDescription;
