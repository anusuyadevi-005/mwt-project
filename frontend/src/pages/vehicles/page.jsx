import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockVehicles } from "@/lib/mock-data"
import { Users, CheckCircle, XCircle } from "lucide-react"

export default function VehiclesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Vehicle Fleet</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Comfortable, well-maintained vehicles for your journey
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={vehicle.image || "/placeholder.svg"}
                      alt={vehicle.model}
                      className="w-full h-48 object-cover"
                    />
                    <Badge
                      className={`absolute top-3 right-3 ${vehicle.status === "available" ? "bg-green-500" : vehicle.status === "sold" ? "bg-red-500" : "bg-yellow-500"}`}
                    >
                      {vehicle.status === "available" ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Available
                        </>
                      ) : vehicle.status === "sold" ? (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Sold
                        </>
                      ) : (
                        "Maintenance"
                      )}
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-2">
                      <Badge variant="secondary">{vehicle.type}</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{vehicle.model}</h3>

                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Capacity: {vehicle.capacity} passengers</span>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {vehicle.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-xl font-bold text-primary mb-4">
                      ₹{vehicle.pricePerDay.toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground"> / day</span>
                    </div>

                    <Button className="w-full" disabled={vehicle.status !== "available"}>
                      {vehicle.status === "available"
                        ? "Select Vehicle"
                        : vehicle.status === "sold"
                          ? "Sold Out"
                          : "Under Maintenance"}
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
