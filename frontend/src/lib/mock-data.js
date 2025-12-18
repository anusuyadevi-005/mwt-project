// Mock data for packages, guides, vehicles, etc.

// Mock Hotels
export const mockHotels = [
  {
    id: 'h1',
    name: 'Grand Palace Hotel',
    location: 'Chennai',
    rating: 4.5,
    priceRange: '₹₹₹',
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
    image: '/luxury-hotel-chennai.jpg',
  },
  {
    id: 'h2',
    name: 'Temple View Resort',
    location: 'Madurai',
    rating: 4.3,
    priceRange: '₹₹',
    amenities: ['WiFi', 'Restaurant', 'Parking'],
    image: '/temple-view-resort-madurai.jpg',
  },
]

// Mock Restaurants
export const mockRestaurants = [
  {
    id: 'r1',
    name: 'Saravana Bhavan',
    location: 'Chennai',
    cuisine: ['South Indian', 'Vegetarian'],
    rating: 4.6,
    priceRange: '₹₹',
    image: '/south-indian-restaurant.png',
  },
  {
    id: 'r2',
    name: 'Murugan Idli Shop',
    location: 'Madurai',
    cuisine: ['South Indian', 'Breakfast'],
    rating: 4.7,
    priceRange: '₹',
    image: '/idli-shop-tamil-nadu.jpg',
  },
]

// Mock Packages
export const mockPackages = [
  {
    id: 'p1',
    name: 'Temple Trail of Tamil Nadu',
    type: 'fixed',
    description:
      "Explore the magnificent temples of Tamil Nadu including Meenakshi Temple, Brihadeeswarar Temple, and more. A spiritual journey through ancient architecture.",
    places: [
      { name: 'Meenakshi Temple', cost: 500, timing: '09:00–12:00' },
      { name: 'Brihadeeswarar Temple', cost: 400, timing: '13:00–16:00' },
      { name: 'Shore Temple', cost: 300, timing: '10:00–13:00' },
      { name: 'Kapaleeshwarar Temple', cost: 250, timing: '14:00–17:00' }
    ],
    extraFeatures: ['Photography', 'Audio Guide', 'Temple Priest Interaction'],
    duration: 7,
    nights: 6,
    price: 25000,
    images: ['/meenakshi-temple-madurai.jpg', '/brihadeeswarar-temple-thanjavur.jpg', '/shore-temple-mahabalipuram.jpg'],
    rating: 4.8,
    reviews: 124,
    guideAvailable: true,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Chennai',
        description: 'Visit Kapaleeshwarar Temple and Marina Beach',
        places: ['Kapaleeshwarar Temple', 'Marina Beach'],
        hotels: [mockHotels[0]],
        restaurants: [mockRestaurants[0]],
      },
    ],
  },
  {
    id: 'p2',
    name: 'Hill Station Retreat',
    type: 'fixed',
    description: "Escape to the cool climate of Tamil Nadu's hill stations. Visit Ooty, Kodaikanal, and Yercaud.",
    places: [
      { name: 'Ooty Botanical Gardens', cost: 300, timing: '09:00–12:00' },
      { name: 'Doddabetta Peak', cost: 400, timing: '13:00–16:00' },
      { name: 'Kodaikanal Lake', cost: 350, timing: '10:00–13:00' }
    ],
    extraFeatures: ['Boating', 'Horse Riding', 'Tea Tasting'],
    duration: 5,
    nights: 4,
    price: 18000,
    images: ['/ooty-tea-gardens.jpg', '/kodaikanal-lake.jpg', '/yercaud-hills.jpg'],
    rating: 4.6,
    reviews: 89,
    guideAvailable: true,
    itinerary: [],
  },
  {
    id: 'p3',
    name: 'Coastal Paradise Tour',
    type: 'fixed',
    description: 'Discover the beautiful beaches and coastal towns of Tamil Nadu.',
    places: [
      { name: 'Marina Beach', cost: 200, timing: '08:00–11:00' },
      { name: 'Mahabalipuram Beach', cost: 350, timing: '12:00–15:00' },
      { name: 'Pondicherry Beach', cost: 300, timing: '16:00–19:00' }
    ],
    extraFeatures: ['Beach Activities', 'Sunset Cruise', 'Local Cuisine'],
    duration: 6,
    nights: 5,
    price: 22000,
    images: ['/marina-beach-chennai.jpg', '/kanyakumari-sunset.jpg', '/mahabalipuram-beach.jpg'],
    rating: 4.7,
    reviews: 156,
    guideAvailable: false,
    itinerary: [],
  },
  {
    id: 'p4',
    name: 'Build Your Own Adventure',
    type: 'customized',
    description: 'Create your perfect Tamil Nadu itinerary by selecting cities and attractions.',
    places: [],
    extraFeatures: [],
    duration: 0,
    price: 0,
    images: ['/tamil-nadu-map-custom-tour.jpg'],
    rating: 4.9,
    reviews: 203,
    guideAvailable: true,
    itinerary: [],
  },
  {
    id: 'iv1',
    name: 'Ashok Leyland Factory Visit',
    type: 'iv',
    description: 'Explore one of India\'s leading automobile manufacturers.',
    places: [
      { name: 'Ashok Leyland Manufacturing Plant', cost: 800, timing: '10:00–13:00' },
      { name: 'Assembly Line Tour', cost: 700, timing: '14:00–17:00' }
    ],
    extraFeatures: ['Safety Briefing', 'Factory Store'],
    duration: 1,
    nights: 0,
    price: 1500,
    images: ['/automobile-factory.jpg'],
    rating: 4.5,
    reviews: 45,
    industry: 'Automotive',
    teamPark: 'Manufacturing',
    buses: [
      { id: 'v1', model: 'Toyota Innova Crysta', available: true, booked: false },
      { id: 'v2', model: 'Tempo Traveller', available: true, booked: false }
    ],
    itinerary: [],
  },
  {
    id: 'iv2',
    name: 'Automotive Plant Visit',
    type: 'iv',
    description: 'An industrial visit to a local manufacturing facility.',
    places: [
      { name: 'Factory Tour', cost: 600, timing: '09:00–12:00' },
      { name: 'QA Lab', cost: 600, timing: '13:00–16:00' }
    ],
    extraFeatures: ['Lab Demonstration', 'Quality Control Session'],
    duration: 1,
    nights: 0,
    price: 1200,
    images: ['/ford-car-manufacturing.jpg'],
    rating: 4.4,
    reviews: 32,
    industry: 'Automotive',
    teamPark: 'Quality Assurance',
    buses: [
      { id: 'v1', model: 'Toyota Innova Crysta', available: true, booked: false },
      { id: 'v2', model: 'Tempo Traveller', available: false, booked: true }
    ],
    itinerary: [],
  },
]

// Mock Guides
export const mockGuides = [
  {
    id: 'g1',
    name: 'Ravi Kumar',
    image: '/placeholder-user.jpg',
    rating: 4.8,
    experience: 8,
    age: 35,
    gender: 'Male',
    specialization: ['History', 'Temple Tours'],
    pricePerDay: 1500,
    languages: ['English', 'Tamil'],
    isAvailable: true,
  },
  {
    id: 'g2',
    name: 'Sangeetha',
    image: '/placeholder-user.jpg',
    rating: 4.6,
    experience: 5,
    age: 29,
    gender: 'Female',
    specialization: ['Nature', 'Hill Stations'],
    pricePerDay: 1200,
    languages: ['English', 'Tamil', 'Hindi'],
    isAvailable: true,
  },
]

// Mock Vehicles
export const mockVehicles = [
  {
    id: 'v1',
    model: 'Toyota Innova Crysta',
    image: '/comfortable-vehicle-illustration.jpg',
    type: 'SUV',
    capacity: 6,
    pricePerDay: 4000,
    features: ['AC', 'Comfort Seats'],
    status: 'available',
  },
  {
    id: 'v2',
    model: 'Tempo Traveller',
    image: '/independent-vehicle-rental.jpg',
    type: 'Van',
    capacity: 12,
    pricePerDay: 7000,
    features: ['AC', 'Large Luggage'],
    status: 'available',
  },
]

// Mock Bookings
export const mockBookings = [
  {
    id: 'b1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    packageName: 'Temple Trail of Tamil Nadu',
    startDate: new Date().toISOString(),
    numberOfPeople: 2,
    totalAmount: 50000,
    status: 'pending',
  },
]

// Mock Reviews
export const mockReviews = [
  {
    id: 'r1',
    packageId: 'p1',
    userName: 'Anita',
    userAvatar: '/placeholder-user.jpg',
    rating: 5,
    comment: 'Amazing experience! Highly recommended.',
    date: new Date().toISOString(),
  },
  {
    id: 'r2',
    packageId: 'p2',
    userName: 'Rahul',
    userAvatar: '/placeholder-user.jpg',
    rating: 4,
    comment: 'Great places and comfortable stay.',
    date: new Date().toISOString(),
  },
]

// Tamil Nadu Cities (for custom packages)
export const tamilNaduCities = [
  {
    name: 'Chennai',
    places: ['Marina Beach', 'Kapaleeshwarar Temple', 'Fort St. George'],
  },
  {
    name: 'Madurai',
    places: ['Meenakshi Temple', 'Thirumalai Nayakkar Mahal', 'Gandhi Museum'],
  },
  {
    name: 'Ooty',
    places: ['Botanical Gardens', 'Ooty Lake', "Doddabetta Peak"],
  },
]

export default {
  mockHotels,
  mockRestaurants,
  mockPackages,
  mockGuides,
  mockVehicles,
  mockBookings,
  mockReviews,
  tamilNaduCities,
}

// Minimal named export to satisfy imports expecting a Review type/value
export const Review = {}

