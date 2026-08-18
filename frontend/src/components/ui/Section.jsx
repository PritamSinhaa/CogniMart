export default function Section({
  children,
  className = "",
  id,
}) {
  return (
    <section
      id={id}
      className={`py-12 sm:py-16 lg:py-20 ${className}`}
    >
      {children}
    </section>
  );
}