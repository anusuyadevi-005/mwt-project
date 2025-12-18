"use client"


import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    numberOfPeople: "",
    numberOfNights: "",
    vehicleType: "",
    hotelType: "",
    message: "",
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Pre-fill contact details from user data
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || "").split(" ")
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.contactNumber || user.phone || "",
      }))
    }
  }, [user])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast({
        title: t('error'),
        description: t('fillRequiredFields'),
        variant: "destructive",
      })
      return
    }

    console.log("Contact form submitted:", formData)

    toast({
      title: t('success'),
      description: t('inquirySubmitted'),
    })

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      age: "",
      gender: "",
      numberOfPeople: "",
      numberOfNights: "",
      vehicleType: "",
      hotelType: "",
      message: "",
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('contactUs')}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('planPerfectAdventure')}
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('travelInquiryForm')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="text-sm font-medium mb-2 block">
                            {t('firstName')} <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleChange("firstName", e.target.value)}
                            placeholder={t('enterFullName')}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="text-sm font-medium mb-2 block">
                            {t('lastName')} <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleChange("lastName", e.target.value)}
                            placeholder={t('enterFullName')}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="email" className="text-sm font-medium mb-2 block">
                            {t('emailAddress')} <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder={t('enterEmail')}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="text-sm font-medium mb-2 block">
                            {t('phoneNumber')} <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            placeholder={t('enterPhone')}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="age" className="text-sm font-medium mb-2 block">
                            {t('age')}
                          </label>
                          <Input
                            id="age"
                            type="number"
                            value={formData.age}
                            onChange={(e) => handleChange("age", e.target.value)}
                            placeholder={t('age')}
                            min="1"
                            max="120"
                          />
                        </div>
                        <div>
                          <label htmlFor="gender" className="text-sm font-medium mb-2 block">
                            {t('gender')}
                          </label>
                          <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                            <SelectTrigger id="gender">
                              <SelectValue placeholder={t('gender')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">{t('male')}</SelectItem>
                              <SelectItem value="female">{t('female')}</SelectItem>
                              <SelectItem value="other">{t('other')}</SelectItem>
                              <SelectItem value="prefer-not-to-say">{t('preferNotToSay')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="numberOfPeople" className="text-sm font-medium mb-2 block">
                            {t('numberOfPeople')}
                          </label>
                          <Input
                            id="numberOfPeople"
                            type="number"
                            value={formData.numberOfPeople}
                            onChange={(e) => handleChange("numberOfPeople", e.target.value)}
                            placeholder={t('numberOfPeople')}
                            min="1"
                          />
                        </div>
                        <div>
                          <label htmlFor="numberOfNights" className="text-sm font-medium mb-2 block">
                            {t('numberOfNights')}
                          </label>
                          <Input
                            id="numberOfNights"
                            type="number"
                            value={formData.numberOfNights}
                            onChange={(e) => handleChange("numberOfNights", e.target.value)}
                            placeholder={t('numberOfNights')}
                            min="1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="vehicleType" className="text-sm font-medium mb-2 block">
                            {t('typeOfVehicle')}
                          </label>
                          <Select
                            value={formData.vehicleType}
                            onValueChange={(value) => handleChange("vehicleType", value)}
                          >
                            <SelectTrigger id="vehicleType">
                              <SelectValue placeholder={t('typeOfVehicle')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sedan">{t('sedan')}</SelectItem>
                              <SelectItem value="suv">{t('suv')}</SelectItem>
                              <SelectItem value="van">{t('van')}</SelectItem>
                              <SelectItem value="bus">{t('bus')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label htmlFor="hotelType" className="text-sm font-medium mb-2 block">
                            {t('typeOfHotel')}
                          </label>
                          <Select
                            value={formData.hotelType}
                            onValueChange={(value) => handleChange("hotelType", value)}
                          >
                            <SelectTrigger id="hotelType">
                              <SelectValue placeholder={t('typeOfHotel')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">{t('normal')}</SelectItem>
                              <SelectItem value="luxury">{t('luxury')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className="text-sm font-medium mb-2 block">
                          {t('additionalMessage')}
                        </label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          placeholder={t('tellUsPreferences')}
                          rows={5}
                          className="resize-none"
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        {t('submitInquiry')}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{t('phoneNumber')}</h3>
                        <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                        <p className="text-sm text-muted-foreground">+91 87654 32109</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{t('emailAddress')}</h3>
                        <p className="text-sm text-muted-foreground">info@tamilnadutours.com</p>
                        <p className="text-sm text-muted-foreground">bookings@tamilnadutours.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{t('contactInfo')}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          123 Anna Salai, Chennai, Tamil Nadu 600002, India
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{t('businessHours')}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>{t('mondayFriday')}</p>
                      <p>{t('saturday')}</p>
                      <p>{t('sunday')}</p>
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
