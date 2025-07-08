const PlantaIcon = ({ className = "w-10 h-10 text-green-500" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      d="M12 22V15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M9 10c-3 0-6 2.5-6 5s2.5 5 5 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M15 10c3 0 6 2.5 6 5s-2.5 5-5 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path d="M12 15c-3 0-5-3-5-5s2-5 5-5 5 2 5 5-2 5-5 5Z" />
  </svg>
);

export default PlantaIcon;

