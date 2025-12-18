import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/language-context'
import { Instagram, MessageCircle, MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 border-t border-border py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h4 className="font-bold text-xl mb-4 text-primary">{t('tamilNaduTours')}</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {t('richHeritage')}
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <a
                href="https://www.instagram.com/p/DMx2c91S8tHGlIji88K2JWHJr2xGrULs8DBaF80/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-600 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vb6BmxzDDmFM2WGh8D3l"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-600 transition-colors"
                aria-label="Contact us on WhatsApp"
              >
                <MessageCircle className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h5 className="font-semibold text-lg mb-4">{t('quickLinks')}</h5>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">{t('home')}</Link>
              <Link to="/packages" className="text-muted-foreground hover:text-primary transition-colors">{t('packages')}</Link>
              <Link to="/guides" className="text-muted-foreground hover:text-primary transition-colors">{t('guides')}</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">{t('contact')}</Link>
            </div>
          </div>

          {/* Popular Destinations */}
          <div className="text-center md:text-left">
            <h5 className="font-semibold text-lg mb-4">{t('popularDestinations')}</h5>
            <div className="flex flex-col gap-2">
              <Link to="/packages?city=Chennai" className="text-muted-foreground hover:text-primary transition-colors">Chennai</Link>
              <Link to="/packages?city=Madurai" className="text-muted-foreground hover:text-primary transition-colors">Madurai</Link>
              <Link to="/packages?city=Kanyakumari" className="text-muted-foreground hover:text-primary transition-colors">Kanyakumari</Link>
              <Link to="/packages?city=Ooty" className="text-muted-foreground hover:text-primary transition-colors">Ooty</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h5 className="font-semibold text-lg mb-4">{t('contactInfo')}</h5>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{t('chennaiTamilNadu')}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{t('phoneNumber')}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{t('emailAddress')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {t('tamilNaduTours')}. {t('allRightsReserved')}.
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-primary transition-colors">{t('privacyPolicy')}</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">{t('termsOfService')}</Link>
              <Link to="/refund" className="hover:text-primary transition-colors">{t('refundPolicy')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
