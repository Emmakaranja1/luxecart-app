import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Facebook, Twitter, Instagram, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', path: '/products' },
        { label: 'Featured', path: '/products?featured=true' },
        { label: 'New Arrivals', path: '/products?sort=newest' },
        { label: 'Sale', path: '/products?sale=true' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', path: '/contact' },
        { label: 'FAQs', path: '/faq' },
        { label: 'Shipping Info', path: '/shipping' },
        { label: 'Returns', path: '/returns' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Cookie Policy', path: '/cookies' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className="bg-dark-card border-t border-primary/20 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center shadow-glow-primary">
                <Zap className="w-6 h-6 text-dark" />
              </div>
              <span className="text-2xl font-display font-bold text-gradient-hero">
                LUXECART
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Discover premium products with cutting-edge technology and exceptional design. 
              Your one-stop shop for everything extraordinary.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-dark-lighter hover:bg-gradient-primary flex items-center justify-center text-white hover:text-dark transition-all duration-300 group"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-display font-bold text-white mb-4 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-primary transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/20 mt-12 pt-8 flex flex-col md:flex-row justify-center items-center gap-4 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} LuxeCart. All rights reserved.
          </p>
       
        </div>
      </div>
    </footer>
  );
};
