
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, TrendingUp, Truck, ThumbsUp } from 'lucide-react';
import PromoMarquee from '@/components/PromoMarquee';
import FeaturedProducts from '@/components/FeaturedProducts';
import Categories from '@/components/Categories';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Promotional Marquee */}
      <PromoMarquee />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-mondoBlue to-blue-800 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Buy in Bulk, Save More!
              </h1>
              <p className="text-lg md:text-xl mb-8">
                Explore our wide range of snacks, soaps, detergents, and food ingredients 
                at wholesale prices with convenient home delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" className="bg-mondoYellow hover:bg-yellow-500 text-mondoBlue font-bold">
                    <ShoppingBag className="mr-2" size={20} />
                    Shop Now
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Assorted products" 
                className="rounded-lg shadow-xl w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
            className="w-full h-12 md:h-20"
          >
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              fill="#ffffff" 
              opacity="0.1"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-mondoBlue/10 rounded-full">
                <ShoppingBag className="w-8 h-8 text-mondoBlue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bulk Pricing</h3>
              <p className="text-gray-600">Get the best prices when you buy in bulk for your business or home.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-mondoBlue/10 rounded-full">
                <TrendingUp className="w-8 h-8 text-mondoBlue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">We source the highest quality products for your satisfaction.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-mondoBlue/10 rounded-full">
                <Truck className="w-8 h-8 text-mondoBlue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Enjoy convenient home delivery or pickup options for your orders.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-mondoBlue/10 rounded-full">
                <ThumbsUp className="w-8 h-8 text-mondoBlue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Satisfaction</h3>
              <p className="text-gray-600">We prioritize your satisfaction with every purchase.</p>
            </div>
          </div>
        </div>
      </section>

     

      {/* CTA Section */}
      <section className="bg-mondoYellow py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-mondoBlue">Ready to Start Saving?</h2>
          <p className="text-lg mb-8 text-gray-800 max-w-2xl mx-auto">
            Join thousands of satisfied customers who save money by buying in bulk from Mondo Carton King.
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-mondoBlue hover:bg-blue-700 text-white font-bold">
              <ShoppingBag className="mr-2" size={20} />
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
