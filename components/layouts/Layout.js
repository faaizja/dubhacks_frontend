export default function Layout({ children }) {
  return (
    <div className="transition-all duration-300 ease-in-out">
      <main
        className={`transition-all min-h-screen duration-300 flex-1 fade-in-down px-4 lg:px-0 lg:mr-8`}
      >
        <div>{children}</div>
      </main>
    </div>
  );
}
