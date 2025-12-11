export function PageTitle({ title, subtitle }) {
  return (
    <>
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      {subtitle && <p className="text-gray-500 mb-6 text-sm text-center">{subtitle}</p>}
    </>
  );
}
