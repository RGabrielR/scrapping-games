import { formatThousands } from "@/shared/lib/numberFormat";

interface PriceInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onHint: () => void;
}

const PriceInput = ({ value, onChange, onSubmit, onHint }: PriceInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange(formatThousands(e.target.value));

  return (
    <div className="flex flex-row justify-center items-center md:mt-0">
      <div
        className="w-[15%] sm:w-[8%] bg-green-500 mr-2 md:mr-6 cursor-pointer hover:bg-green-600 rounded-md"
        onClick={onHint}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="p-2 md:p-4 h-12 md:h-20"
          style={{ fill: "white", width: "100%" }}
        >
          <path d="M385.1 419.1C349.7 447.2 304.8 464 256 464s-93.7-16.8-129.1-44.9l80.4-80.4c14.3 8.4 31 13.3 48.8 13.3s34.5-4.8 48.8-13.3l80.4 80.4zm68.1 .2C489.9 374.9 512 318.1 512 256s-22.1-118.9-58.8-163.3L465 81c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L419.3 58.8C374.9 22.1 318.1 0 256 0S137.1 22.1 92.7 58.8L81 47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9L58.8 92.7C22.1 137.1 0 193.9 0 256s22.1 118.9 58.8 163.3L47 431c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l11.8-11.8C137.1 489.9 193.9 512 256 512s118.9-22.1 163.3-58.8L431 465c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-11.8-11.8zm-34.1-34.1l-80.4-80.4c8.4-14.3 13.3-31 13.3-48.8s-4.8-34.5-13.3-48.8l80.4-80.4C447.2 162.3 464 207.2 464 256s-16.8 93.7-44.9 129.1zM385.1 92.9l-80.4 80.4c-14.3-8.4-31-13.3-48.8-13.3s-34.5 4.8-48.8 13.3L126.9 92.9C162.3 64.8 207.2 48 256 48s93.7 16.8 129.1 44.9zM173.3 304.8L92.9 385.1C64.8 349.7 48 304.8 48 256s16.8-93.7 44.9-129.1l80.4 80.4c-8.4 14.3-13.3 31-13.3 48.8s4.8 34.5 13.3 48.8zM208 256a48 48 0 1 1 96 0 48 48 0 1 1 -96 0z" />
        </svg>
      </div>

      <div className="relative w-[70%]">
        <input
          type="text"
          className="md:py-6 px-4 text-gray-500 pl-12 pr-16 block w-full border-2 border-gray-200 shadow-sm rounded-md text-lg md:text-3xl focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-white dark:border-gray-700 dark:text-gray-400"
          placeholder="0.00"
          autoComplete="off"
          onChange={handleChange}
          value={value}
          style={{ WebkitAppearance: "none", MozAppearance: "textfield" } as React.CSSProperties}
        />
        <div className="absolute inset-y-0 left-0 top-[-0.1rem] flex items-center rounded-sm pointer-events-none z-20 pl-4">
          <span className="text-gray-500 text-xl md:text-3xl">$</span>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center rounded-sm pointer-events-none z-20 pr-20">
          <span className="text-gray-500 text-xl md:text-3xl">ARS</span>
        </div>
        <div
          onClick={onSubmit}
          className="absolute inset-y-0 right-0 flex rounded-sm items-center z-20 cursor-pointer bg-slate-950 hover:bg-black pl-6 pr-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 320 512"
            style={{ fill: "white" }}
          >
            <path d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PriceInput;
