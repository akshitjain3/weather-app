interface SearchIconProps {
  size?: number;
  CSSClasses?: string;
  thickness?: number;
}
const SearchIcon = ({
  size = 24,
  CSSClasses = "",
  thickness = 2,
}: SearchIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={`cursor-pointer ${CSSClasses}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={thickness}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
};

export default SearchIcon;
