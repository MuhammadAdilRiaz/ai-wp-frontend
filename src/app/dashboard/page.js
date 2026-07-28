import Sidebar from '@/components/Sidebar'
import DashboardHero from '@/components/DashboardHero'

export const metadata = {
  title: 'Dashboard — AI WP Builder',
}

export default function DashboardPage() {
  const user = { name: 'Adil', email: 'multi.xpert5r@gmail.com', initial: 'A' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar user={user} />
      <main style={{ flex: 1, minWidth: 0 }}>
        <DashboardHero user={user} credits={100} />
      </main>
    </div>
  )
}
