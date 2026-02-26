import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Dashboard from './Dashboard'
import { Badge } from './components/ui/badge'
import RidesDashboard from './RidesDashboard'

type Page = 'home' | 'rides'

function App() {
  const [page, setPage] = useState<Page>('home')

  useEffect(() => {
    const syncFromHash = () => {
      const route = window.location.hash.replace('#', '')
      setPage(route === '/rides' ? 'rides' : 'home')
    }

    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  const goToPage = (nextPage: Page) => {
    window.location.hash = nextPage === 'rides' ? '/rides' : '/home'
  }

  const goToHomeSection = (sectionId: string) => {
    goToPage('home')
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
      <div className="fixed top-0 left-1/4 h-1/2 w-1/2 bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 h-1/2 w-1/2 bg-secondary/40 blur-[120px] pointer-events-none" />

      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center space-x-3 mr-8 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-black text-xl">S</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight hidden sm:block">
              SurgePredict<span className="text-primary">.ai</span>
            </span>
          </div>

          <nav className="hidden md:flex flex-1 items-center space-x-8 text-sm font-medium">
            <button className="text-foreground transition-colors hover:text-primary" onClick={() => goToPage('home')}>Home</button>
            <button className="text-muted-foreground transition-colors hover:text-primary" onClick={() => goToPage('rides')}>Rides Dashboard</button>
          </nav>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="hidden sm:inline-flex font-medium bg-primary/5 text-primary border-primary/10">
              Ride Hailing Price AI
            </Badge>
          </div>
        </div>
      </header>

      {page === 'home' ? (
        <main id="home" className="relative max-w-7xl mx-auto px-4 py-12 sm:px-8">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border bg-card/60 p-8 shadow-xl backdrop-blur md:p-12"
          >
            <div className="max-w-3xl space-y-5">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Surge Pricing Intelligence</Badge>
              <h1 className="text-4xl font-black tracking-tight leading-[1.1] sm:text-6xl">
                Predict Ride Fares Before You Dispatch
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                Estimate ride price in real time from rider demand, driver supply, and expected trip duration.
                This model is built for ride-hailing operations using surge-pricing behavior.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => goToHomeSection('predictor')} className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                  Try Live Predictor
                </button>
                <button onClick={() => goToHomeSection('features')} className="rounded-lg border px-5 py-2 text-sm font-semibold transition hover:bg-accent">
                  View Features
                </button>
                <button onClick={() => goToPage('rides')} className="rounded-lg border px-5 py-2 text-sm font-semibold transition hover:bg-accent">
                  Open Rides Dashboard
                </button>
              </div>
            </div>
          </motion.section>

          <section id="features" className="mt-14 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold">Demand-Aware</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                `Number_of_Riders` captures real-time demand pressure in each zone.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold">Supply-Aware</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                `Number_of_Drivers` tracks active driver availability to model surge response.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold">Trip Context</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                `Expected_Ride_Duration` captures route-level complexity and affects fare output.
              </p>
            </div>
          </section>

          <section id="predictor" className="mt-14">
            <div className="mb-6 space-y-2">
              <h2 className="text-3xl font-black tracking-tight">Live Ride Price Predictor</h2>
              <p className="text-muted-foreground">
                Set the three inputs below and run prediction to get the expected ride price instantly.
              </p>
            </div>
            <Dashboard />
          </section>
        </main>
      ) : (
        <main className="relative max-w-7xl mx-auto px-4 py-12 sm:px-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Rides Tracking Dashboard</h2>
                <p className="text-muted-foreground">
                  Separate page for ride operations, filtering, and profit percentage monitoring.
                </p>
              </div>
              <button onClick={() => goToPage('home')} className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-accent">
                Back to Home
              </button>
            </div>
            <RidesDashboard />
          </section>
        </main>
      )}

      <footer className="mt-20 border-t py-12 bg-muted/30 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 bg-muted-foreground/20 rounded-md flex items-center justify-center">
              <span className="text-[10px] font-bold">S</span>
            </div>
            <p className="text-sm font-semibold text-muted-foreground">© 2026 SurgePredict.ai Ride Hailing Pricing</p>
          </div>

          <div className="flex space-x-8 text-sm font-medium text-muted-foreground">
            <button onClick={() => goToPage('home')} className="hover:text-primary transition-colors">Home</button>
            <button onClick={() => goToPage('rides')} className="hover:text-primary transition-colors">Rides Dashboard</button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
