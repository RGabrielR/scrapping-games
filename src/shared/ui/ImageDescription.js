const ImageDescription = ({ data }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 sm:items-start">
      {data.map((item, index) => (
        <p
          key={`${item}-${index}`}
          className="w-full max-w-[13rem] rounded-lg border-3 border-blue-900 bg-blue-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-md shadow-blue-200 sm:text-base"
        >
          - {item}
        </p>
      ))}
    </div>
  );
};

export default ImageDescription;
