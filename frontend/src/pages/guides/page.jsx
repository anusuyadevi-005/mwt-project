import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockGuides } from "@/lib/mock-data"
import { Star, Languages, Award, CheckCircle, XCircle } from "lucide-react"

export default function GuidesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Expert Guides</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Experienced, multilingual guides to make your journey memorable
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockGuides.map((guide) => (
                <Card key={guide.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={guide.image || "/placeholder.svg"}
                      alt={guide.name}
                      className="w-full h-64 object-cover"
                    />
                    <Badge className={`absolute top-3 right-3 ${guide.isAvailable ? "bg-green-500" : "bg-red-500"}`}>
                      {guide.isAvailable ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Available
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Unavailable
                        </>
                      )}
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{guide.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-semibold">{guide.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {guide.age} years, {guide.gender}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-2 text-sm">
                        <Languages className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex flex-wrap gap-1">
                          {guide.languages.map((lang, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span>{guide.experience} years experience</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {guide.specialization.map((spec, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-xl font-bold text-primary mb-4">
                      ₹{guide.pricePerDay.toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground"> / day</span>
                    </div>

                    <Button className="w-full" disabled={!guide.isAvailable}>
                      {guide.isAvailable ? "Select Guide" : "Currently Unavailable"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
