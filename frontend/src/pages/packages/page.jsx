"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Footer } from "@/components/footer"
import { PackageCard } from "@/components/package-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { mockReviews } from "@/lib/mock-data"

export default function PackagesPage() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const navigate = useNavigate()
  const typeParam = searchParams.get("type")
  const [selectedType, setSelectedType] = useState(typeParam || "all")
  const { user } = useAuth()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState(mockReviews)

  useEffect(() => {
    if (typeParam) {
      setSelectedType(typeParam)
    }
  }, [typeParam])

  useEffect(() => {
    fetchPackages()
  }, [reviews])

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages')
      if (response.ok) {
        const data = await response.json()
        const packagesWithReviews = (data.packages || []).map(pkg => {
          const packageReviews = reviews.filter(r => r.packageId === pkg.id || r.packageId === pkg._id)
          const avgRating = packageReviews.length > 0
            ? packageReviews.reduce((sum, r) => sum + r.rating, 0) / packageReviews.length
            : pkg.rating || 0
          return {
            ...pkg,
            rating: Math.round(avgRating * 10) / 10,
            reviews: packageReviews.length
          }
        })
        setPackages(packagesWithReviews)
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPackages = selectedType === "all" ? packages : packages.filter((pkg) => pkg.type === selectedType)

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Our Packages</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Choose from our curated packages or create your own adventure
              </p>
            </div>

            <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full max-w-2xl mx-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Packages</TabsTrigger>
                <TabsTrigger value="fixed">Fixed</TabsTrigger>
                <TabsTrigger value="customized">Customized</TabsTrigger>
                <TabsTrigger value="iv">Industrial Visit</TabsTrigger>
              </TabsList>
            </Tabs>

            {(user?.role === "admin" || user?.email === "jeyanthi282005@gmail.com") && (
              <div className="flex justify-center mt-6">
                <Link to="/packages/create">
                  <Button size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Create Package
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Loading packages...</p>
              </div>
            ) : filteredPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
                  <PackageCard key={pkg._id || pkg.id} package={pkg} reviews={reviews.filter(r => r.packageId === pkg.id || r.packageId === pkg._id)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No packages found for this category.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
