import BottomNav from '@/components/layout/BottomNav'
import AmdyLabsFooter from '@/components/layout/AmdyLabsFooter'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen pb-20">
      {children}
      <AmdyLabsFooter />
      <BottomNav />
    </div>
  )
}
