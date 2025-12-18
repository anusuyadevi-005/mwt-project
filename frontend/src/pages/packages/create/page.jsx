"use client"

import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, X, Edit, CheckCircle, XCircle, Settings } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { mockPackages, mockGuides, mockVehicles } from "@/lib/mock-data"

export default function CreatePackagePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [showTypeModal, setShowTypeModal] = useState(true)
  const [selectedType, setSelectedType] = useState('')
  const [packages, setPackages] = useState([])
  const [apiPackages, setApiPackages] = useState([])

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages')
        if (response.ok) {
          const data = await response.json()
          setApiPackages(data.packages || [])
        }
      } catch (error) {
        console.error('Error fetching packages:', error)
        // Fallback to localStorage
        const stored = localStorage.getItem('packages')
        setPackages(stored ? JSON.parse(stored) : mockPackages)
      }
    }
    fetchPackages()
  }, [])
  const [guides, setGuides] = useState(() => {
    const stored = localStorage.getItem('guides')
    return stored ? JSON.parse(stored) : mockGuides
  })
  const [vehicles, setVehicles] = useState(() => {
    const stored = localStorage.getItem('vehicles')
    return stored ? JSON.parse(stored) : mockVehicles
  })

  // Check if user is logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('loginRequired')}</h1>
            <p className="text-muted-foreground mb-4">{t('pleaseLoginToContinue')}</p>
            <Button onClick={() => navigate("/login")}>{t('login')}</Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const handleTypeSelection = (type) => {
    setSelectedType(type)
    setShowTypeModal(false)
  }

  const handleBookFixedPackage = async (pkg) => {
    if (!pkg.guideAvailable) {
      alert('Guide is not available for this package')
      return
    }

    try {
      const booking = {
        id: Date.now().toString(),
        customerName: user.name || user.email,
        customerEmail: user.email,
        packageName: pkg.name,
        packageId: pkg.id,
        startDate: new Date().toISOString(),
        numberOfPeople: 1,
        totalAmount: pkg.price,
        status: 'confirmed',
        type: 'fixed'
      }

      // Get existing bookings
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      const updatedBookings = [...existingBookings, booking]

      // Save booking
      localStorage.setItem('bookings', JSON.stringify(updatedBookings))

      // Update guide availability
      const updatedGuides = guides.map(g => ({
        ...g,
        isAvailable: g.isAvailable && Math.random() > 0.5 // Simulate availability change
      }))
      setGuides(updatedGuides)
      localStorage.setItem('guides', JSON.stringify(updatedGuides))

      alert('Package booked successfully!')
      navigate('/packages')
    } catch (error) {
      console.error('Error booking package:', error)
      alert('Failed to book package: ' + error.message)
    }
  }

  const handleBookBus = async (pkgId, busId) => {
    try {
      // Update package buses
      const updatedPackages = packages.map(pkg => {
        if (pkg.id === pkgId && pkg.buses) {
          return {
            ...pkg,
            buses: pkg.buses.map(bus =>
              bus.id === busId
                ? { ...bus, available: !bus.available, booked: !bus.booked }
                : bus
            )
          }
        }
        return pkg
      })
      setPackages(updatedPackages)
      localStorage.setItem('packages', JSON.stringify(updatedPackages))

      // Update vehicles
      const updatedVehicles = vehicles.map(v =>
        v.id === busId
          ? { ...v, status: v.status === 'available' ? 'booked' : 'available' }
          : v
      )
      setVehicles(updatedVehicles)
      localStorage.setItem('vehicles', JSON.stringify(updatedVehicles))

      alert('Bus booking updated successfully!')
    } catch (error) {
      console.error('Error booking bus:', error)
      alert('Failed to book bus: ' + error.message)
    }
  }

  const renderFixedPackages = () => {
    const displayPackages = apiPackages.length > 0 ? apiPackages : packages
    const fixedPackages = displayPackages.filter(pkg => pkg.type === 'fixed')

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fixedPackages.map((pkg) => (
          <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden">
              <img
                src={pkg.images[0] || "/placeholder.svg"}
                alt={pkg.name}
                className="h-full w-full object-cover"
              />
              <Badge className="absolute top-3 right-3 bg-primary">
                Fixed Package
              </Badge>
            </div>

            <CardContent className="p-5">
              <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{pkg.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Guide:</span>
                  <Badge variant={pkg.guideAvailable ? "default" : "destructive"}>
                    {pkg.guideAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>

                <div>
                  <span className="text-sm font-medium">Places:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {pkg.places.slice(0, 3).map((place, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {place.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Extra Features:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {pkg.extraFeatures.slice(0, 2).map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-2xl font-bold text-primary mb-4">
                ₹{pkg.price.toLocaleString()}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleBookFixedPackage(pkg)}
                  disabled={!pkg.guideAvailable}
                  className="flex-1"
                >
                  {pkg.guideAvailable ? 'Book Now' : 'Unavailable'}
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderIVPackages = () => {
    const displayPackages = apiPackages.length > 0 ? apiPackages : packages
    const ivPackages = displayPackages.filter(pkg => pkg.type === 'iv')

    return (
      <div className="max-w-2xl mx-auto">
        {ivPackages.map((pkg) => (
          <Card key={pkg.id} className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {pkg.name}
                <Badge variant="secondary">IV Package</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Industry</Label>
                  <Input value={pkg.industry} readOnly />
                </div>
                <div>
                  <Label>Team Park</Label>
                  <Input value={pkg.teamPark} readOnly />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Available Buses (DJ)</Label>
                <div className="space-y-2">
                  {pkg.buses?.map((bus) => (
                    <div key={bus.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{bus.model}</span>
                        <Badge variant={bus.available ? "default" : "destructive"}>
                          {bus.available ? "Available" : "Booked"}
                        </Badge>
                      </div>
                      <Button
                        onClick={() => handleBookBus(pkg.id, bus.id)}
                        variant={bus.booked ? "destructive" : "default"}
                        size="sm"
                      >
                        {bus.booked ? 'Cancel Booking' : 'Book Bus'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xl font-bold text-primary">
                ₹{pkg.price.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
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
              {t('back')}
            </Button>

            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Create Your Package</h1>
              <p className="text-muted-foreground">
                Choose from our fixed packages or book an industrial visit
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {selectedType === 'fixed' && renderFixedPackages()}
            {selectedType === 'iv' && renderIVPackages()}
          </div>
        </section>
      </main>

      <Footer />

      {/* Type Selection Modal */}
      <Dialog open={showTypeModal} onOpenChange={setShowTypeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Package Type</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4">
            <Button
              onClick={() => handleTypeSelection('fixed')}
              className="h-20 flex flex-col gap-2"
              variant="outline"
            >
              <span className="text-lg font-semibold">Fixed Packages</span>
              <span className="text-sm text-muted-foreground">Pre-planned travel packages</span>
            </Button>
            <Button
              onClick={() => handleTypeSelection('iv')}
              className="h-20 flex flex-col gap-2"
              variant="outline"
            >
              <span className="text-lg font-semibold">IV Packages</span>
              <span className="text-sm text-muted-foreground">Industrial visit packages</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
