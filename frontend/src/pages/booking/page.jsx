"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from 'react-router-dom'
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { mockPackages, mockGuides, mockVehicles, tamilNaduCities } from "@/lib/mock-data"
import { Calendar, Users, MapPin, Star, ArrowRight, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"

export default function BookingPage() {
  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const { t } = useLanguage()
  const packageId = searchParams.get("package")

  const [step, setStep] = useState(1)
  const [selectedPackage, setSelectedPackage] = useState(packageId || "")
const [bookingType, setBookingType] = useState("fixed")

  // Booking details
  const [startDate, setStartDate] = useState("")
  const [numberOfPeople, setNumberOfPeople] = useState("2")
  const [selectedGuide, setSelectedGuide] = useState("")

  const [selectedVehicle, setSelectedVehicle] = useState("")


  // Customized package details
  const [selectedCities, setSelectedCities] = useState([])
  const [selectedPlaces, setSelectedPlaces] = useState([])
  const [customDuration, setCustomDuration] = useState("3")

  // Contact details
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")

  const pkg = mockPackages.find((p) => p.id === selectedPackage)
  const guide = mockGuides.find((g) => g.id === selectedGuide)
  const vehicle = mockVehicles.find((v) => v.id === selectedVehicle)

  useEffect(() => {
    if (pkg) {
      setBookingType(pkg.type)
    }
  }, [pkg])

  // Pre-fill contact details from user data
  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
      setPhone(user.contactNumber || user.phone || "")
    }
  }, [user])

  const calculateTotal = () => {
    let total = 0

    if (bookingType === "fixed" && pkg) {
      total += pkg.price * Number.parseInt(numberOfPeople || 1)
    } else if (bookingType === "customized") {
      // Base price calculation for customized packages
      const basePrice = 5000 * Number.parseInt(customDuration || 1)
      total += basePrice * Number.parseInt(numberOfPeople || 1)
    }

    if (guide) {
      const duration = bookingType === "customized" ? Number.parseInt(customDuration || 1) : pkg?.duration || 1
      total += guide.pricePerDay * duration
    }

    if (vehicle) {
      const duration = bookingType === "customized" ? Number.parseInt(customDuration || 1) : pkg?.duration || 1
      total += vehicle.pricePerDay * duration
    }

    return total
  }

  const handleCityToggle = (city) => {
    setSelectedCities((prev) => (prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]))
  }

  const handlePlaceToggle = (place) => {
    setSelectedPlaces((prev) => (prev.includes(place) ? prev.filter((p) => p !== place) : [...prev, place]))
  }
  const handleSubmit = async () => {
    // Validation
    if (!selectedPackage && bookingType === "fixed") {
      toast({
        title: t("noPackageSelected"),
        description: t("selectTravelPackage"),
        variant: "destructive",
      });
      return;
    }

    if (!name || !email || !phone) {
      toast({
        title: t("missingInformation"),
        description: t("fillContactDetails"),
        variant: "destructive",
      });
      return;
    }

    if (!startDate) {
      toast({
        title: t("missingDate"),
        description: t("selectStartDate"),
        variant: "destructive",
      });
      return;
    }

    if (bookingType === "customized" && selectedCities.length === 0) {
      toast({
        title: t("noCitiesSelected"),
        description: t("selectAtLeastOneCity"),
        variant: "destructive",
      });
      return;
    }

    const totalAmount = calculateTotal();
    if (totalAmount <= 0) {
      toast({
        title: t("invalidTotal"),
        description: t("totalMustBeGreater"),
        variant: "destructive",
      });
      return;
    }

  try {
    // First create the booking
    const bookingResponse = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        specialRequests,
        packageId: selectedPackage,
        bookingType,
        startDate,
        numberOfPeople,
        selectedGuide,
        selectedVehicle,
        selectedCities,
        selectedPlaces,
        customDuration,
        totalPrice: calculateTotal(),
      }),
    });

    const bookingData = await bookingResponse.json();

    if (!bookingResponse.ok) {
      toast({
        title: t("bookingFailed"),
        description: bookingData.error || t("serverError"),
        variant: "destructive",
      });
      return;
    }

    const bookingId = bookingData.bookingId;
    console.log('Booking created successfully:', bookingData);

    // Now create Razorpay order
    const totalAmount = calculateTotal();
    console.log('Creating order with amount:', totalAmount, 'bookingId:', bookingId);

    if (!totalAmount || totalAmount <= 0) {
      console.error('Invalid amount:', totalAmount);
      toast({
        title: t("invalidAmount"),
        description: t("totalAmountMustBeGreater"),
        variant: "destructive",
      });
      return;
    }

    if (!bookingId) {
      console.error('Invalid bookingId:', bookingId);
      toast({
        title: t("invalidBooking"),
        description: t("bookingIdMissing"),
        variant: "destructive",
      });
      return;
    }

    const orderResponse = await fetch("http://localhost:5000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalAmount,
        bookingId: bookingId,
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      console.error('Order creation failed:', orderData);
      toast({
        title: t("paymentSetupFailed"),
        description: orderData.error || t("unableToInitializePayment"),
        variant: "destructive",
      });
      return;
    }

    // Initialize Razorpay checkout
    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: 'Tamil Nadu Travel',
      description: `Booking ID: ${bookingId}`,
      handler: async function (response) {
        // Verify payment
        const verifyResponse = await fetch("http://localhost:5000/api/payment/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingId: bookingId,
          }),
        });

        const verifyData = await verifyResponse.json();

        if (verifyResponse.ok) {
          toast({
            title: t("paymentSuccessful"),
            description: t("success"),
          });
          setTimeout(() => navigate("/"), 2000);
        } else {
          toast({
            title: t("paymentVerificationFailed"),
            description: t("contactSupport"),
            variant: "destructive",
          });
        }
      },
      prefill: {
        name: name,
        email: email,
        contact: phone,
      },
      theme: {
        color: '#2563eb',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error(err);
    toast({
      title: t("bookingFailed"),
      description: t("serverError"),
      variant: "destructive",
    });
  }
};

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("completeYourBooking")}</h1>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {step > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
                  </div>
                  <span className="text-sm font-medium">{t("packageDetails")}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {step > 2 ? <CheckCircle className="h-5 w-5" /> : "2"}
                  </div>
                  <span className="text-sm font-medium">{t("guideVehicle")}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className={`flex items-center gap-2 ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    3
                  </div>
                  <span className="text-sm font-medium">{t("contactPayment")}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {step === 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Package & Travel Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {!packageId && (
                        <div className="space-y-2">
                          <Label htmlFor="package">Select Package</Label>
                          <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                            <SelectTrigger id="package">
                              <SelectValue placeholder="Choose a package" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockPackages.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {pkg && (
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h3 className="font-semibold mb-2">{pkg.name}</h3>
                          <p className="text-sm text-muted-foreground">{pkg.description}</p>
                        </div>
                      )}

                      {bookingType === "customized" && (
                        <div className="space-y-4">
                          <div>
                            <Label className="mb-3 block">Select Cities to Visit</Label>
                            <div className="grid grid-cols-2 gap-3">
                              {tamilNaduCities.map((city) => (
                                <div key={city.name} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={city.name}
                                    checked={selectedCities.includes(city.name)}
                                    onCheckedChange={() => handleCityToggle(city.name)}
                                  />
                                  <label
                                    htmlFor={city.name}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    {city.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {selectedCities.length > 0 && (
                            <div>
                              <Label className="mb-3 block">Select Places to Visit</Label>
                              <div className="space-y-3">
                                {tamilNaduCities
                                  .filter((city) => selectedCities.includes(city.name))
                                  .map((city) => (
                                    <div key={city.name} className="space-y-2">
                                      <h4 className="text-sm font-semibold">{city.name}</h4>
                                      <div className="grid grid-cols-2 gap-2 pl-4">
                                        {city.places.slice(0, 5).map((place) => (
                                          <div key={place} className="flex items-center space-x-2">
                                            <Checkbox
                                              id={place}
                                              checked={selectedPlaces.includes(place)}
                                              onCheckedChange={() => handlePlaceToggle(place)}
                                            />
                                            <label
                                              htmlFor={place}
                                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                              {place}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="duration">Trip Duration (days)</Label>
                            <Input
                              id="duration"
                              type="number"
                              min="1"
                              max="30"
                              value={customDuration}
                              onChange={(e) => setCustomDuration(e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="people">Number of People</Label>
                          <Input
                            id="people"
                            type="number"
                            min="1"
                            max="50"
                            value={numberOfPeople}
                            onChange={(e) => setNumberOfPeople(e.target.value)}
                          />
                        </div>
                      </div>

                      <Button onClick={() => setStep(2)} className="w-full">
                        Continue to Guide & Vehicle Selection
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Select Your Guide</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 gap-4">
                          {mockGuides
                            .filter((g) => g.isAvailable)
                            .map((g) => (
                              <div
                                key={g.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedGuide === g.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                                onClick={() => setSelectedGuide(g.id)}
                              >
                                <div className="flex items-start gap-4">
                                  <img
                                    src={g.image || "/placeholder.svg"}
                                    alt={g.name}
                                    className="h-20 w-20 rounded-lg object-cover"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <h4 className="font-semibold">{g.name}</h4>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                          <Star className="h-3 w-3 fill-accent text-accent" />
                                          <span>{g.rating}</span>
                                          <span>•</span>
                                          <span>{g.experience} years exp</span>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-semibold">₹{g.pricePerDay.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground">per day</div>
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {g.languages.map((lang) => (
                                        <Badge key={lang} variant="secondary" className="text-xs">
                                          {lang}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          <div
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedGuide === "" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                            onClick={() => setSelectedGuide("")}
                          >
                            <p className="text-sm font-medium">No guide needed - I'll explore on my own</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Select Your Vehicle</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 gap-4">
                          {mockVehicles
                            .filter((v) => v.status === "available")
                            .map((v) => (
                              <div
                                key={v.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedVehicle === v.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                                onClick={() => setSelectedVehicle(v.id)}
                              >
                                <div className="flex items-start gap-4">
                                  <img
                                    src={v.image || "/placeholder.svg"}
                                    alt={v.model}
                                    className="h-20 w-32 rounded-lg object-cover"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <h4 className="font-semibold">{v.model}</h4>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                          <Users className="h-3 w-3" />
                                          <span>{v.capacity} passengers</span>
                                          <span>•</span>
                                          <span>{v.type}</span>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-semibold">₹{v.pricePerDay.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground">per day</div>
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {v.features.slice(0, 3).map((feature) => (
                                        <Badge key={feature} variant="outline" className="text-xs">
                                          {feature}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          <div
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedVehicle === "" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                            onClick={() => setSelectedVehicle("")}
                          >
                            <p className="text-sm font-medium">No vehicle needed - I have my own transport</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                        Back
                      </Button>
                      <Button onClick={() => setStep(3)} className="flex-1">
                        Continue to Contact Details
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="requests">Special Requests (Optional)</Label>
                        <Textarea
                          id="requests"
                          placeholder="Any special requirements or preferences..."
                          rows={4}
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-4">
                        <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                          Back
                        </Button>
                        <Button onClick={handleSubmit} className="flex-1">
                          Confirm Booking
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pkg && bookingType === "fixed" && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{pkg.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {pkg.duration} days • {pkg.places.length} places
                        </div>
                      </div>
                    )}

                    {bookingType === "customized" && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">Custom Package</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {customDuration} days • {selectedCities.length} cities • {selectedPlaces.length} places
                        </div>
                      </div>
                    )}

                    {startDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Starting {new Date(startDate).toLocaleDateString()}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{numberOfPeople} travelers</span>
                    </div>

                    {guide && (
                      <div className="pt-4 border-t">
                        <div className="text-sm font-semibold mb-1">Guide</div>
                        <div className="text-sm text-muted-foreground">{guide.name}</div>
                      </div>
                    )}

                    {vehicle && (
                      <div className="pt-4 border-t">
                        <div className="text-sm font-semibold mb-1">Vehicle</div>
                        <div className="text-sm text-muted-foreground">{vehicle.model}</div>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                      {pkg && bookingType === "fixed" && (
                        <div className="flex justify-between text-sm">
                          <span>Package ({numberOfPeople} people)</span>
                          <span>₹{(pkg.price * Number.parseInt(numberOfPeople)).toLocaleString()}</span>
                        </div>
                      )}

                      {bookingType === "customized" && (
                        <div className="flex justify-between text-sm">
                          <span>
                            Custom Package ({numberOfPeople} people, {customDuration} days)
                          </span>
                          <span>
                            ₹
                            {(
                              5000 *
                              Number.parseInt(customDuration) *
                              Number.parseInt(numberOfPeople)
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {guide && (
                        <div className="flex justify-between text-sm">
                          <span>Guide ({bookingType === "customized" ? customDuration : pkg?.duration || 0} days)</span>
                          <span>
                            ₹
                            {(
                              guide.pricePerDay *
                              (bookingType === "customized" ? Number.parseInt(customDuration) : pkg?.duration || 0)
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {vehicle && (
                        <div className="flex justify-between text-sm">
                          <span>
                            Vehicle ({bookingType === "customized" ? customDuration : pkg?.duration || 0} days)
                          </span>
                          <span>
                            ₹
                            {(
                              vehicle.pricePerDay *
                              (bookingType === "customized" ? Number.parseInt(customDuration) : pkg?.duration || 0)
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">₹{calculateTotal().toLocaleString()}</span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      * Final price may vary based on availability and seasonal rates
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
