export default function AmdyLabsFooter() {
  return (
    <div className="flex items-center justify-center gap-2 py-5 border-t border-slate-100 dark:border-slate-800 mt-4">
      <span className="text-slate-400 text-xs">Powered by</span>
      <div className="flex items-center gap-1.5">
        <img
          src="/amdy-labs.png"
          alt="Amdy Labs"
          className="h-5 w-auto"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <span className="text-xs font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          AMDY LABS
        </span>
      </div>
    </div>
  )
}
