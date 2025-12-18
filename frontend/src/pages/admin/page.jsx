
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { mockBookings, mockGuides, mockVehicles } from "@/lib/mock-data"
import { Calendar, TrendingUp, DollarSign, CheckCircle, Clock, XCircle, LogOut, Plus, X, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const [bookings, setBookings] = useState(mockBookings)
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    duration: '',
    nights: '',
    price: '',
    places: [{ name: '', image: '', mapUrl: '', cost: '', timing: '' }],
    images: [''],
    itinerary: []
  })

  const handleStatusChange = (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status: newStatus } : booking)),
    )
    toast({
      title: "Status Updated",
      description: "Booking status has been updated successfully",
    })
  }

  // Fetch packages on component mount
  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages')
      if (response.ok) {
        const data = await response.json()
        setPackages(data.packages || [])
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    }
  }

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    })
    navigate("/")
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }

      // Auto-generate itinerary days based on duration
      if (field === 'duration' && value) {
        const duration = parseInt(value)
        if (duration > 0) {
          const itinerary = []
          for (let i = 1; i <= duration; i++) {
            itinerary.push({
              day: i,
              title: '',
              description: '',
              places: [{ name: '', image: '', description: '', timing: '' }]
            })
          }
          newData.itinerary = itinerary
        }
      }

      return newData
    })
  }

  const handlePlaceChange = (index, field, value) => {
    const updatedPlaces = [...formData.places]
    updatedPlaces[index][field] = value
    setFormData(prev => ({
      ...prev,
      places: updatedPlaces
    }))
  }

  const addPlace = () => {
    setFormData(prev => ({
      ...prev,
      places: [...prev.places, { name: '', image: '', mapUrl: '', cost: '', timing: '' }]
    }))
  }

  const removePlace = (index) => {
    setFormData(prev => ({
      ...prev,
      places: prev.places.filter((_, i) => i !== index)
    }))
  }

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images]
    updatedImages[index] = value
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }))
  }

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }))
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const packageData = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        places: formData.places.filter(p => p.name.trim() !== ''),
        duration: parseInt(formData.duration) || 0,
        nights: parseInt(formData.nights) || 0,
        price: parseInt(formData.price) || 0,
        images: formData.images.filter(img => img.trim() !== ''),
        itinerary: formData.itinerary
          .filter(i => i.title.trim() !== '' || i.places.some(p => p.name.trim() !== ''))
          .map(day => ({
            day: day.day,
            title: day.title || `Day ${day.day}`,
            description: day.description || `Activities for Day ${day.day}`,
            places: day.places.filter(p => p.name.trim() !== '').map(p => p.name)
          }))
      }

      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packageData)
      })

      if (response.ok) {
        toast({
          title: "Package Created",
          description: "Package has been created successfully",
        })
        // Reset form
        setFormData({
          name: '',
          type: '',
          description: '',
          duration: '',
          nights: '',
          price: '',
          places: [{ name: '', image: '', mapUrl: '', cost: '', timing: '' }],
          images: [''],
          itinerary: []
        })
        // Refresh packages list
        fetchPackages()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create package",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating package:', error)
      toast({
        title: "Error",
        description: "Failed to create package",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
    confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
    totalRevenue: bookings.filter((b) => b.status !== "cancelled").reduce((sum, b) => sum + b.totalAmount, 0),
    availableGuides: mockGuides.filter((g) => g.isAvailable).length,
    availableVehicles: mockVehicles.filter((v) => v.status === "available").length,
  }

  const getStatusBadge = (status) => {
    const variants = {
      pending: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
      confirmed: "bg-blue-500/10 text-blue-700 border-blue-500/20",
      completed: "bg-green-500/10 text-green-700 border-green-500/20",
      cancelled: "bg-red-500/10 text-red-700 border-red-500/20",
    }
    return variants[status] || ""
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />
      case "confirmed":
        return <CheckCircle className="h-3 w-3" />
      case "completed":
        return <CheckCircle className="h-3 w-3" />
      case "cancelled":
        return <XCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your travel business</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.pendingBookings} pending approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">From {stats.confirmedBookings} confirmed bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available Resources</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableGuides + stats.availableVehicles}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.availableGuides} guides, {stats.availableVehicles} vehicles
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="create-package" className="space-y-6">
          <TabsList>
            <TabsTrigger value="create-package">Create Package</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          </TabsList>

          <TabsContent value="create-package">
            <Card>
              <CardHeader>
                <CardTitle>Create New Package</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="package-name">Package Name</Label>
                      <Input
                        id="package-name"
                        placeholder="Enter package name"
                        value={formData.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="package-type">Type</Label>
                      <Select value={formData.type} onValueChange={(value) => handleFormChange('type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed</SelectItem>
                          <SelectItem value="customized">Customized</SelectItem>
                          <SelectItem value="iv">Industrial Visit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (days)</Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="e.g., 3"
                        value={formData.duration}
                        onChange={(e) => handleFormChange('duration', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nights">Nights</Label>
                      <Input
                        id="nights"
                        type="number"
                        placeholder="e.g., 2"
                        value={formData.nights}
                        onChange={(e) => handleFormChange('nights', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="e.g., 5000"
                        value={formData.price}
                        onChange={(e) => handleFormChange('price', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter package description"
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      required
                    />
                  </div>

                  {/* Places Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Places to Visit</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addPlace}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Place
                      </Button>
                    </div>
                    {formData.places.map((place, index) => (
                      <Card key={index} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Place Name</Label>
                            <Input
                              placeholder="e.g., Meenakshi Temple"
                              value={place.name}
                              onChange={(e) => handlePlaceChange(index, 'name', e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input
                              placeholder="https://example.com/image.jpg"
                              value={place.image}
                              onChange={(e) => handlePlaceChange(index, 'image', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Map URL</Label>
                            <Input
                              placeholder="https://maps.google.com/..."
                              value={place.mapUrl}
                              onChange={(e) => handlePlaceChange(index, 'mapUrl', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Cost (₹)</Label>
                            <Input
                              type="number"
                              placeholder="500"
                              value={place.cost}
                              onChange={(e) => handlePlaceChange(index, 'cost', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Timing</Label>
                            <Input
                              placeholder="09:00–12:00"
                              value={place.timing}
                              onChange={(e) => handlePlaceChange(index, 'timing', e.target.value)}
                            />
                          </div>
                          {formData.places.length > 1 && (
                            <div className="flex items-end">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removePlace(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Images Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Package Images</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addImage}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Image
                      </Button>
                    </div>
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={image}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                        />
                        {formData.images.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Itinerary Section */}
                  <div className="space-y-4">
                    <Label>Itinerary</Label>
                    {formData.itinerary.map((day, dayIndex) => (
                      <Card key={dayIndex} className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="text-lg font-semibold">Day {day.day}</div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Title</Label>
                              <Input
                                placeholder="e.g., Arrival in Chennai"
                                value={day.title}
                                onChange={(e) => {
                                  const updatedItinerary = [...formData.itinerary]
                                  updatedItinerary[dayIndex].title = e.target.value
                                  setFormData(prev => ({ ...prev, itinerary: updatedItinerary }))
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                placeholder="Describe the day's activities"
                                value={day.description}
                                onChange={(e) => {
                                  const updatedItinerary = [...formData.itinerary]
                                  updatedItinerary[dayIndex].description = e.target.value
                                  setFormData(prev => ({ ...prev, itinerary: updatedItinerary }))
                                }}
                              />
                            </div>
                          </div>

                          {/* Places for this day */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Places to Visit (Day {day.day})</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const updatedItinerary = [...formData.itinerary]
                                  updatedItinerary[dayIndex].places.push({ name: '', image: '', description: '' })
                                  setFormData(prev => ({ ...prev, itinerary: updatedItinerary }))
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Place
                              </Button>
                            </div>
                            {day.places.map((place, placeIndex) => (
                              <Card key={placeIndex} className="p-3">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                  <div className="space-y-2">
                                    <Label>Place Name</Label>
                                    <Input
                                      placeholder="e.g., Meenakshi Temple"
                                      value={place.name}
                                      onChange={(e) => {
                                        const updatedItinerary = [...formData.itinerary]
                                        updatedItinerary[dayIndex].places[placeIndex].name = e.target.value
                                        setFormData(prev => ({ ...prev, itinerary: updatedItinerary }))
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Image URL</Label>
                                    <Input
                                      placeholder="https://example.com/image.jpg"
                                      value={place.image}
                                      onChange={(e) => {
                                        const updatedItinerary = [...formData.itinerary]
                                        updatedItinerary[dayIndex].places[placeIndex].image = e.target.value
                                        setFormData(prev => ({ ...prev, itinerary: updatedItinerary }))
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                      placeholder="Describe this place"
                                      value={place.description}
                                      onChange={(e) => {
                                        const updatedItinerary = [...formData.itinerary]
                                        updatedItinerary[dayIndex].places[placeIndex].description = e.target.value
                                        setFormData(prev => ({ ...prev, itinerary: updatedItinerary }))
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Timing</Label>
                                    <Input
                                      placeholder="e.g., 09:00–12:00"
                                      value={place.timing}
                                      onChange={(e) => {
                                        const updatedItinerary = [...formData.itinerary]
                                        updatedItinerary[dayIndex].places[placeIndex].timing = e.target.value
                                        setFormData(prev => ({ ...prev, itinerary: updatedItinerary }))
                                      }}
                                    />
                                  </div>
                                </div>
                                {day.places.length > 1 && (
                                  <div className="flex justify-end mt-3">
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => {
                                        const updatedItinerary = [...formData.itinerary]
                                        updatedItinerary[dayIndex].places.splice(placeIndex, 1)
                                        setFormData(prev => ({ ...prev, itinerary: updatedItinerary }))
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </Card>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    <Plus className="mr-2 h-4 w-4" />
                    {loading ? 'Creating...' : 'Create Package'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>People</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.customerName}</div>
                            <div className="text-xs text-muted-foreground">{booking.customerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>{booking.packageName}</TableCell>
                        <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{booking.numberOfPeople}</TableCell>
                        <TableCell className="font-semibold">₹{booking.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${getStatusBadge(booking.status)} flex items-center gap-1 w-fit`}
                          >
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={booking.status}
                            onValueChange={(value) => handleStatusChange(booking.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages">
            <Card>
              <CardHeader>
                <CardTitle>Available Packages</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Package Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Places</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packages.map((pkg) => (
                      <TableRow key={pkg._id}>
                        <TableCell className="font-medium">{pkg.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{pkg.type}</Badge>
                        </TableCell>
                        <TableCell>{pkg.duration > 0 ? `${pkg.duration} days` : "Custom"}</TableCell>
                        <TableCell>{pkg.places?.length || 0} places</TableCell>
                        <TableCell className="font-semibold">
                          {pkg.price > 0 ? `₹${pkg.price.toLocaleString()}` : "Variable"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">{pkg.rating || 0}</span>
                            <span className="text-xs text-muted-foreground">({pkg.reviews || 0})</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides">
            <Card>
              <CardHeader>
                <CardTitle>Tour Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Languages</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Price/Day</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockGuides.map((guide) => (
                      <TableRow key={guide.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={guide.image || "/placeholder.svg"}
                              alt={guide.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium">{guide.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {guide.age} years, {guide.gender}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {guide.languages.map((lang) => (
                              <Badge key={lang} variant="outline" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{guide.experience} years</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">{guide.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">₹{guide.pricePerDay.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={guide.isAvailable ? "default" : "secondary"}
                            className={guide.isAvailable ? "bg-green-500" : "bg-gray-500"}
                          >
                            {guide.isAvailable ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Fleet</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Features</TableHead>
                      <TableHead>Price/Day</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">{vehicle.model}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{vehicle.type}</Badge>
                        </TableCell>
                        <TableCell>{vehicle.capacity} passengers</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {vehicle.features.slice(0, 2).map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">₹{vehicle.pricePerDay.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              vehicle.status === "available"
                                ? "bg-green-500/10 text-green-700 border-green-500/20"
                                : vehicle.status === "sold"
                                  ? "bg-red-500/10 text-red-700 border-red-500/20"
                                  : "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
                            }
                          >
                            {vehicle.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
