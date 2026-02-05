import { motion } from 'framer-motion'
import Dashboard from './Dashboard'
import { Badge } from './components/ui/badge'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
      {/* Glow effects */}
      <div className="fixed top-0 left-1/4 w-1/2 h-1/2 bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] pointer-events-none" />

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
            <a className="text-foreground transition-colors hover:text-primary" href="/">Dashboard</a>
            <a className="text-muted-foreground transition-colors hover:text-primary" href="/analytics">Market Analysis</a>
            <a className="text-muted-foreground transition-colors hover:text-primary" href="/history">History</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="hidden sm:inline-flex font-medium bg-primary/5 text-primary border-primary/10">
              v2.1 Stable
            </Badge>
            <div className="h-8 w-8 rounded-full bg-muted border flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
              <span className="text-[10px] font-bold">JD</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 py-12 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12"
        >
          <div className="flex flex-col gap-4 max-w-3xl">
            <div className="flex items-center space-x-2">
              <span className="h-px w-8 bg-primary/40" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Intelligent Pricing</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]">
              Predict Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Surge Patterns</span> in Real-Time.
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl">
              Leverage artificial intelligence to anticipate demand spikes and supply shortages. Optimize your pricing strategy with precision.
            </p>
          </div>

          <Dashboard />
        </motion.div>
      </main>

      <footer className="mt-20 border-t py-12 bg-muted/30 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 bg-muted-foreground/20 rounded-md flex items-center justify-center">
              <span className="text-[10px] font-bold">S</span>
            </div>
            <p className="text-sm font-semibold text-muted-foreground">© 2026 SurgePredict.ai</p>
          </div>

          <div className="flex space-x-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="hover:text-primary transition-colors">API</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App