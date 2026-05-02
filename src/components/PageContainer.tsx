interface PageContainerProps {
  children: React.ReactNode
}

// The shared shell for all authenticated pages.
// Handles the responsive card layout — transparent/full-bleed on mobile,
// rounded white card with shadow on desktop. Pages just describe their content.
export default function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="flex-1 flex px-4 py-6 sm:px-10 lg:py-12 overflow-y-auto justify-center items-start sm:items-center bg-app-bg">
      <div className="flex flex-col w-full max-w-7xl mx-auto
        rounded-none sm:rounded-2xl
        border-0 sm:border sm:border-black/5
        bg-transparent sm:bg-white
        p-0 sm:p-12 lg:p-20
        shadow-none sm:shadow-sm
        h-fit sm:my-auto">
        {children}
      </div>
    </main>
  )
}