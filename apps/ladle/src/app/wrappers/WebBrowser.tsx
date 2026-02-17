/**
 * Mimic a web browser window
 */

export function WebBrowser({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full resize flex-col overflow-hidden rounded-lg border shadow-lg">
      {/* Browser header */}
      <div className="flex items-center gap-2 bg-gray-200 px-4 py-2">
        <div className="flex space-x-1">
          <span className="block h-3 w-3 rounded-full bg-red-500"></span>
          <span className="block h-3 w-3 rounded-full bg-yellow-500"></span>
          <span className="block h-3 w-3 rounded-full bg-green-500"></span>
        </div>
        <div className="flex-1 text-center font-medium">Web Browser</div>
        <div className="w-16"></div> {/* Placeholder for right side */}
      </div>

      {/* Browser content */}
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  );
}
