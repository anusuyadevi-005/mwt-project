"use client"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockPackages, mockReviews, Review } from "@/lib/mock-data"
import { Star, Clock, MapPin, Users, Calendar, ArrowLeft } from "lucide-react"
import { Link } from 'react-router-dom'
import { ReviewForm } from "@/components/review-form"
import { ReviewsList } from "@/components/reviews-list"
import { useAuth } from "@/context/auth-context"

export default function PackageDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reviews, setReviews] = useState(mockReviews.filter((r) => r.packageId === id))

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true)
        // Try to fetch from API first
        const response = await fetch(`/api/packages/${id}`)
        if (response.ok) {
          const data = await response.json()
          setPkg(data.package)
        } else {
          // Fallback to localStorage
          const storedPackages = JSON.parse(localStorage.getItem('packages') || '[]')
          const storedPkg = storedPackages.find((p) => p.id === id || p._id === id)

          if (storedPkg) {
            setPkg(storedPkg)
          } else {
            // Fallback to mock data
            const mockPkg = mockPackages.find((p) => p.id === id)
            if (mockPkg) {
              setPkg(mockPkg)
            } else {
              throw new Error('Package not found')
            }
          }
        }
      } catch (err) {
        console.error('Error fetching package:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPackage()
  }, [id])

  const handleReviewSubmitted = (newReview) => {
    const reviewWithId = {
      id: `r${Date.now()}`,
      packageId: id,
      ...newReview,
    }
    setReviews((prev) => [reviewWithId, ...prev])
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">Loading package...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error && !pkg) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Package Not Found</h1>
            <p className="text-red-500 mb-4">Error: {error}</p>
            <Button onClick={() => navigate("/packages")}>Back to Packages</Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Package Not Found</h1>
              <Button onClick={() => navigate("/packages")}>Back to Packages</Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <Badge className="mb-3">
                    {pkg.type === "fixed"
                      ? "Fixed Package"
                      : pkg.type === "customized"
                        ? "Customized Package"
                        : "Independent Vehicle"}
                  </Badge>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">{pkg.name}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-accent text-accent" />
                      <span className="font-semibold text-foreground">{pkg.rating}</span>
                      <span className="text-sm">({pkg.reviews} reviews)</span>
                    </div>
                    {pkg.duration > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-5 w-5" />
                        <span>{pkg.duration} Days</span>
                      </div>
                    )}
                    {pkg.places.length > 0 && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-5 w-5" />
                        <span>{pkg.places.length} Places</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {pkg.images.map((image, index) => (
                    <div key={index} className={`${index === 0 ? "md:col-span-2" : ""} rounded-lg overflow-hidden`}>
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${pkg.name} ${index + 1}`}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  ))}
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    {pkg.itinerary.length > 0 && <TabsTrigger value="itinerary">Itinerary</TabsTrigger>}
                    {pkg.places.length > 0 && <TabsTrigger value="places">Places</TabsTrigger>}
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-4">About This Package</h3>
                        <p className="text-muted-foreground leading-relaxed">{pkg.description}</p>

                        {pkg.type === "customized" && (
                          <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                            <h4 className="font-semibold mb-2">Customize Your Journey</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Select your preferred cities and attractions to create a personalized itinerary that
                              matches your interests and schedule.
                            </p>
                          </div>
                        )}

                        {pkg.type === "iv" && (
                          <div className="mt-6 p-4 bg-accent/5 rounded-lg">
                            <h4 className="font-semibold mb-2">Independent Vehicle Package</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Choose from our fleet of well-maintained vehicles and explore Tamil Nadu at your own pace.
                              Perfect for those who prefer the freedom of self-guided travel.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {pkg.itinerary.length > 0 && (
                    <TabsContent value="itinerary" className="mt-6">
                      <div className="space-y-4">
                        {pkg.itinerary.map((day) => (
                          <Card key={day.day}>
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                                  {day.day}
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-lg font-bold mb-2">{day.title}</h4>
                                  <p className="text-muted-foreground mb-3 leading-relaxed">{day.description}</p>
                                  <div className="flex flex-wrap gap-2">
                                    {day.places.map((place, idx) => (
                                      <Badge key={idx} variant="secondary">
                                        {place}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  )}

                  {pkg.places.length > 0 && (
                    <TabsContent value="places" className="mt-6">
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold mb-4">Places You'll Visit</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {pkg.places.map((place, idx) => (
                              <div key={idx} className="p-3 bg-muted/50 rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                  {place.image && (
                                    <img
                                      src={place.image}
                                      alt={place.name}
                                      className="w-8 h-8 object-cover rounded"
                                    />
                                  )}
                                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                                  <span className="text-sm font-medium">{place.name}</span>
                                </div>
                                {place.timing && (
                                  <div className="text-xs text-muted-foreground">
                                    Timing: {place.timing}
                                  </div>
                                )}
                                {place.cost && (
                                  <div className="text-xs text-muted-foreground">
                                    Cost: ₹{place.cost}
                                  </div>
                                )}
                                {place.mapUrl && (
                                  <a
                                    href={place.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline"
                                  >
                                    View on Map
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  )}
                </Tabs>

                <section className="mt-8">
                  <h2 className="text-2xl font-bold mb-6">Reviews</h2>
                  <div className="space-y-6">
                    <ReviewForm packageId={pkg.id} onReviewSubmitted={handleReviewSubmitted} />
                    <ReviewsList reviews={reviews} />
                  </div>
                </section>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardContent className="p-6">
                    {pkg.price > 0 && (
                      <div className="mb-6">
                        <div className="text-3xl font-bold text-primary mb-1">₹{pkg.price.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">per person</div>
                      </div>
                    )}

                    <div className="space-y-3 mb-6">
                      {pkg.duration > 0 && (
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <span>
                            <span className="font-semibold">{pkg.duration}</span> days duration
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-sm">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span>Suitable for all group sizes</span>
                      </div>
                      {pkg.places.length > 0 && (
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <span>
                            <span className="font-semibold">{pkg.places.length}</span> destinations
                          </span>
                        </div>
                      )}
                    </div>

                    {user && user.role !== "admin" && user.email !== "jeyanthi282005@gmail.com" && (
                      <Button asChild className="w-full mb-3">
                        <Link to={`/booking?package=${pkg.id}`}>
                          {pkg.type === "customized" ? "Customize & Book" : "Book Now"}
                        </Link>
                      </Button>
                    )}

                    <Button variant="outline" asChild className="w-full bg-transparent">
                      <Link to="/contact">Contact Us</Link>
                    </Button>

                    <div className="mt-6 pt-6 border-t border-border">
                      <h4 className="font-semibold mb-3">What's Included</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>Professional guide services</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>Comfortable transportation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>Hotel recommendations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>24/7 customer support</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
