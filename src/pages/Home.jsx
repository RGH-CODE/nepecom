import ProductGrid from '../components/ProductGrid'
import { Button } from '../components/ui/button'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-muted/40 py-20 lg:py-32">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              className="flex flex-col justify-center space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Elevate Your Style
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Discover the latest trends in fashion and accessories. Shop our curated collection for the season.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="px-8">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  View Collections
                </Button>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative aspect-square w-full max-w-[500px] rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl absolute -z-10" />
              {/* Placeholder for hero image if available, or just use typography/abstract */}
              <div className="relative rounded-xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop"
                  alt="Hero Fashion"
                  className="object-cover w-[400px] h-[500px]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container px-4 md:px-6 py-12">
        <ProductGrid />
      </main>
    </div>
  )
}
