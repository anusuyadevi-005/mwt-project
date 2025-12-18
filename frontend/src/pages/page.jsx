import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { MapPin, Users, Car, Star, Calendar, Shield } from "lucide-react"
import { useAuth } from "../context/auth-context"
import { useLanguage } from "../context/language-context"

export default function HomePage() {
  const { user } = useAuth()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 text-balance">
              {t('discoverBeauty')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-pretty">
              {t('experienceAuthentic')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/packages">{t('explorePackages')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">{t('getInTouch')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{t('whyChooseUs')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>{t('expertGuides')}</CardTitle>
                <CardDescription>
                  {t('expertGuidesDesc')}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Car className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>{t('comfortableTravel')}</CardTitle>
                <CardDescription>
                  {t('comfortableTravelDesc')}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-yellow-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="w-12 h-12 text-yellow-600 mb-4" />
                <CardTitle>{t('trustedService')}</CardTitle>
                <CardDescription>{t('trustedServiceDesc')}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Package Types Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{t('chooseTravelStyle')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <Calendar className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>{t('fixedPackages')}</CardTitle>
                <CardDescription className="text-base">
                  {t('fixedPackagesDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/packages?type=fixed">{t('viewFixedPackages')}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow border-green-200">
              <CardHeader>
                <MapPin className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>{t('customizedPackages')}</CardTitle>
                <CardDescription className="text-base">
                  {t('customizedPackagesDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link to="/packages?type=customized">{t('customizeTour')}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow border-yellow-200">
              <CardHeader>
                <Car className="w-12 h-12 text-yellow-600 mb-4" />
                <CardTitle>{t('independentVehicle')}</CardTitle>
                <CardDescription className="text-base">
                  {t('independentVehicleDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-yellow-600 hover:bg-yellow-700">
                  <Link to="/vehicles">{t('browseVehicles')}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{t('featuredPackages')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{t('templeTrailOfTamilNadu')}</CardTitle>
                <CardDescription className="text-sm">
                  {t('templeTrailDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/packages">{t('viewDetails')}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{t('hillStationRetreat')}</CardTitle>
                <CardDescription className="text-sm">
                  {t('hillStationRetreatDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/packages">{t('viewDetails')}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{t('coastalParadiseTour')}</CardTitle>
                <CardDescription className="text-sm">
                  {t('coastalParadiseTourDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/packages">{t('viewDetails')}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{t('buildYourOwnAdventure')}</CardTitle>
                <CardDescription className="text-sm">
                  {t('buildYourOwnAdventureDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/packages">{t('viewDetails')}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{t('ashokLeylandFactoryVisit')}</CardTitle>
                <CardDescription className="text-sm">
                  {t('ashokLeylandFactoryVisitDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/packages">{t('viewDetails')}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{t('automotivePlantVisit')}</CardTitle>
                <CardDescription className="text-sm">
                  {t('automotivePlantVisitDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/packages">{t('viewDetails')}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-blue-100">{t('yearsExperience')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">{t('tourPackages')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-blue-100">{t('happyTravelers')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8</div>
              <div className="text-blue-100 flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
{t('rating')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl font-bold text-gray-900">{t('readyToStartJourney')}</h2>
          <p className="text-xl text-gray-600">
            {t('bookAdventureToday')}
          </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              {user && user.role !== "admin" && user.email !== "jeyanthi282005@gmail.com" ? (
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link to="/booking">{t('bookNow')}</Link>
                </Button>
              ) : !user ? (
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link to="/login">{t('loginToBook')}</Link>
                </Button>
              ) : null}
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">{t('contact')}</Link>
              </Button>
            </div>
        </div>
      </section>
    </div>
  )
}
