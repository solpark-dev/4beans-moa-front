export default function Sticker({
  children,
  color = "bg-white",
  className = "",
}) {
  return (
    <div
      className={`${color} border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}
