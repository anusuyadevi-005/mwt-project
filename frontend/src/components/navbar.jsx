import { Link } from "react-router-dom"
import { useAuth } from "../context/auth-context"
import { useLanguage } from "../context/language-context"
import { Button } from "./ui/button"
import { User, LogOut, Menu, MapPin } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useState } from "react"
import { LanguageSwitcher } from "./language-switcher"
import ThemeSwitcher from "./ui/theme-switcher"

function Navbar() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Tamil Nadu Tours</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              {t("home")}
            </Link>
            <Link to="/packages" className="text-sm font-medium hover:text-primary transition-colors">
              {t("packages")}
            </Link>
            <Link to="/guides" className="text-sm font-medium hover:text-primary transition-colors">
              {t("guides")}
            </Link>
            <Link to="/vehicles" className="text-sm font-medium hover:text-primary transition-colors">
              {t("vehicles")}
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              {t("contact")}
            </Link>
            {user && (user.role === "admin" || user.email === "jeyanthi282005@gmail.com") && (
              <Button asChild variant="outline">
                <Link to="/admin">Create Packages</Link>
              </Button>
            )}
            {user && user.role !== "admin" && user.email !== "jeyanthi282005@gmail.com" && (
              <Button asChild>
                <Link to="/booking">{t("bookNow")}</Link>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            <ThemeSwitcher />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">{user.name || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">{t("profile")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/bookings">{t("myBookings")}</Link>
                  </DropdownMenuItem>
                  {(user.role === "admin" || user.email === "jeyanthi282005@gmail.com") && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">{t("admin")}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">{t("login")}</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">{t("signup")}</Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link to="/" className="block py-2 text-sm font-medium hover:text-primary">
              {t("home")}
            </Link>
            <Link to="/packages" className="block py-2 text-sm font-medium hover:text-primary">
              {t("packages")}
            </Link>
            <Link to="/guides" className="block py-2 text-sm font-medium hover:text-primary">
              {t("guides")}
            </Link>
            <Link to="/vehicles" className="block py-2 text-sm font-medium hover:text-primary">
              {t("vehicles")}
            </Link>
            <Link to="/contact" className="block py-2 text-sm font-medium hover:text-primary">
              {t("contact")}
            </Link>
            {user && (user.role === "admin" || user.email === "jeyanthi282005@gmail.com") && (
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin">Create Packages</Link>
              </Button>
            )}
            {user && user.role !== "admin" && user.email !== "jeyanthi282005@gmail.com" && (
              <Button asChild>
                <Link to="/booking">{t("bookNow")}</Link>
              </Button>
            )}
            {!user && (
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" asChild className="flex-1">
                  <Link to="/login">{t("login")}</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link to="/signup">{t("signup")}</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
