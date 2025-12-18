import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"

export function PackageCard(props) {
  const pkg = props.package || props.pkg
  const reviews = props.reviews || []
  const { user } = useAuth()
  const { t } = useLanguage()
  const typeColors = {
    fixed: "bg-primary/10 text-primary",
    customized: "bg-accent/10 text-accent-foreground",
    iv: "bg-secondary text-secondary-foreground",
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    if (!confirm('Are you sure you want to delete this package?')) return

    try {
      // Get existing packages from localStorage
      const existingPackages = JSON.parse(localStorage.getItem('packages') || '[]')

      // Remove the package
      const updatedPackages = existingPackages.filter(p => p.id !== pkg.id && p._id !== pkg._id)

      // Save back to localStorage
      localStorage.setItem('packages', JSON.stringify(updatedPackages))

      // Refresh the page to update the list
      window.location.reload()
    } catch (error) {
      console.error('Error deleting package:', error)
      alert('Failed to delete package: ' + error.message)
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={pkg.images[0] || "/placeholder.svg"}
          alt={pkg.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className={`absolute top-3 right-3 ${typeColors[pkg.type]}`}>
          {pkg.type === "fixed" ? t('fixedPackage') : pkg.type === "customized" ? t('customized') : t('industrialVisit')}
        </Badge>
      </div>

      <CardContent className="p-5">
        <h3 className="text-xl font-bold mb-2 line-clamp-1">{pkg.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{pkg.description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          {pkg.duration > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{pkg.duration} {t('days')} {pkg.nights > 0 && `${pkg.nights} ${t('nights')}`}</span>
            </div>
          )}
          {pkg.places && pkg.places.length > 0 && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{pkg.places.length} {t('places')}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-semibold">{pkg.rating || 0}</span>
          </div>
          <span className="text-sm text-muted-foreground">({pkg.reviews || 0} {t('reviews')})</span>
        </div>

        {reviews.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Recent Reviews:</h4>
            <div className="space-y-2">
              {reviews.slice(0, 2).map((review, index) => (
                <div key={index} className="bg-muted/50 p-2 rounded text-xs">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{review.rating}</span>
                    <span className="text-muted-foreground">- {review.userName}</span>
                  </div>
                  <p className="text-muted-foreground line-clamp-2">{review.comment}</p>
                </div>
              ))}
              {reviews.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{reviews.length - 2} more reviews
                </div>
              )}
            </div>
          </div>
        )}

        {pkg.price > 0 && (
          <div className="text-2xl font-bold text-primary">
            ₹{pkg.price.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground"> / {t('person')}</span>
          </div>
        )}

        {/* Display places with images and maps */}
        {pkg.places && pkg.places.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold">Places to Visit:</h4>
            <div className="grid grid-cols-1 gap-2">
              {pkg.places.slice(0, 2).map((place, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                  {place.image && (
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{place.name}</div>
                    {place.timing && (
                      <div className="text-xs text-muted-foreground">{place.timing}</div>
                    )}
                  </div>
                  {place.mapUrl && (
                    <a
                      href={place.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <MapPin className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
              {pkg.places.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{pkg.places.length - 2} more places
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-0 space-y-2">
        {user && user.role === "admin" && (
          <div className="flex gap-2 w-full">
            <Button asChild variant="outline" className="flex-1">
              <Link to={`/packages/${pkg._id || pkg.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                {t('edit')}
              </Link>
            </Button>
            <Button variant="outline" onClick={handleDelete} className="flex-1">
              <Trash2 className="h-4 w-4 mr-2" />
              {t('delete')}
            </Button>
          </div>
        )}
        <Button asChild className="w-full">
          <Link to={`/packages/${pkg._id || pkg.id}`}>
            {pkg.type === "customized" ? t('customizePackage') : pkg.type === "iv" && user && user.role !== "admin" && user.email !== "jeyanthi282005@gmail.com" ? t('bookNow') : pkg.type === "iv" && !user ? t('loginToBook') : t('viewDetails')}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
