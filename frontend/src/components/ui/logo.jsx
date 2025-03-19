import logo from "../../assets/comsoc_logo.png"; // Corrected the relative path

export default function Logo() {
  return (
    <div className="m-0">
      <img
        src={logo} // Use the imported logo
        alt="Organization Logo" // Improved alt text for accessibility
        className="h-auto mb-4 w-[250px] rounded-full shadow-[0_17px_35px_rgba(23,26,31,0.24),0_0_2px_rgba(23,26,31,0.12)]"
      />
    </div>
  );
}
