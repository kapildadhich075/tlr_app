import {
  videoLengthOptions,
  videoSizeOptions,
} from "@/app/constants/Steps/logistics";

export const Logistics = () => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col">
        <label htmlFor={videoLengthOptions.id} className="text-white">
          {videoLengthOptions.label}
        </label>
        <select
          id={videoLengthOptions.id}
          name={videoLengthOptions.id}
          className="p-2 rounded-md bg-blue-100 text-gray-500 mt-2"
        >
          {videoLengthOptions.options.map((option, index) => (
            <option key={index} value={option.value} disabled={index === 0}>
              {option.text}
            </option>
          ))}
        </select>

        <label htmlFor={videoSizeOptions.id} className="text-white mt-6">
          {videoSizeOptions.label}
        </label>

        <select
          id={videoSizeOptions.id}
          name={videoSizeOptions.id}
          className="p-2 rounded-md bg-blue-100 text-gray-500 mt-2"
        >
          {videoSizeOptions.options.map((option, index) => (
            <option key={index} value={option.value} disabled={index === 0}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
