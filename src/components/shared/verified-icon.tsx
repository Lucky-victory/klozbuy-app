export const KlozUIVerifiedIcon = ({
  className = "bg-klozui-green-500",
  size = 32,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Interlocking circles forming the main shape */}
      <circle cx="16.1" cy="10.3" r="6.2" className="fill-current" />
      <circle cx="22.1" cy="14" r="6.1" className="fill-current" />
      <circle cx="22.1" cy="20" r="6.1" className="fill-current" />
      <circle cx="16.1" cy="24" r="6.1" className="fill-current" />
      <circle cx="10.1" cy="20" r="6.1" className="fill-current" />
      <circle cx="10.1" cy="14.1" r="6.1" className="fill-current" />

      {/* Extended checkmark with proper spacing */}
      <path
        d="M11.5 16L15 19.5L21.5 13"
        fill="none"
        className="stroke-white"
        strokeLinecap="round"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
};
