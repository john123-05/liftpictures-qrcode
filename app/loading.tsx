const placeholders = Array.from({ length: 5 }, (_, index) => index);

export default function Loading() {
  return (
    <main className="screen-shell min-h-screen bg-page text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-[2800px] flex-col px-1 py-1 sm:px-2 sm:py-2 lg:px-3">
        <section className="flex min-h-[calc(100vh-0.5rem)] flex-1 flex-col border-y border-line py-1 sm:min-h-[calc(100vh-1rem)] sm:py-2">
          <div className="flex min-h-full flex-1 flex-col overflow-hidden">
            <div className="px-5 pb-3 pt-4 text-center sm:px-8 sm:pb-4 sm:pt-5">
              <div className="mx-auto h-4 w-[32rem] max-w-full animate-pulse bg-page-strong" />
            </div>
            <div className="grid min-h-0 flex-1 grid-rows-2 gap-1 overflow-hidden sm:gap-2">
              <div className="flex min-h-0 items-center">
                <LoadingRow placeholders={placeholders} />
              </div>
              <div className="flex min-h-0 items-center">
                <LoadingRow placeholders={placeholders} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function LoadingRow({ placeholders }: { placeholders: number[] }) {
  return (
    <div className="flex w-max gap-6 pl-0.5 pr-6 sm:gap-8 sm:pl-1 sm:pr-8 lg:pl-2">
      {placeholders.map((placeholder) => (
        <div
          key={placeholder}
          className="grid w-[28rem] animate-pulse grid-cols-[minmax(0,1fr)_5.8rem] gap-3 border border-line bg-white p-3 sm:w-[34rem] sm:grid-cols-[minmax(0,1fr)_6.3rem] sm:gap-4 sm:p-4 xl:w-[39rem] xl:grid-cols-[minmax(0,1fr)_7rem]"
        >
          <div className="aspect-[16/10.8] border border-line bg-page-strong" />
          <div className="grid grid-rows-[auto_1fr_auto] border-l border-line pl-3 sm:pl-4">
            <div className="h-4 w-14 bg-page-strong" />
            <div className="flex items-end py-3 sm:py-4">
              <div className="aspect-square w-full bg-page-strong" />
            </div>
            <div className="h-3 w-12 bg-page-strong" />
          </div>
        </div>
      ))}
    </div>
  );
}
