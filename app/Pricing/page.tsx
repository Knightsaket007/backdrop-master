
'use client'
import React, { useState } from 'react';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  
  const pricingPlans = [
    {
      name: 'Starter',
      description: 'Perfect for small teams getting started',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Up to 10 team members',
        'Basic XKCD comic delivery',
        'Email support',
        'Monthly analytics reports',
        'Standard templates'
      ],
      popular: false,
      buttonText: 'Get Started'
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses',
      monthlyPrice: 79,
      yearlyPrice: 790,
      features: [
        'Up to 50 team members',
        'Premium comic collection',
        'Priority email & chat support',
        'Weekly analytics reports',
        'Custom templates',
        'Advanced scheduling',
        'Team collaboration tools'
      ],
      popular: true,
      buttonText: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with custom needs',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      features: [
        'Unlimited team members',
        'Complete comic library access',
        '24/7 phone & chat support',
        'Real-time analytics',
        'Custom branding',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee'
      ],
      popular: false,
      buttonText: 'Contact Sales'
    }
  ];

  const getPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlyCost = plan.yearlyPrice;
    return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header Section */}
      <div className="pricing-header-section py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="pricing-header-badge inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mb-6">
            ✨ Special Launch Offer - Save up to 30%
          </div>
          <div className="pricing-main-title text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your Perfect Plan
          </div>
          <div className="pricing-subtitle text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Get the best XKCD comic delivery service for your team. Start with a free trial and upgrade anytime.
          </div>
          
          {/* Billing Toggle */}
          <div className="pricing-toggle-wrapper flex items-center justify-center mb-16">
            <span className={`pricing-toggle-label mr-3 ${billingCycle === 'monthly' ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`pricing-toggle-button relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pricing-toggle-slider inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`pricing-toggle-label ml-3 ${billingCycle === 'yearly' ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="pricing-savings-badge ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards Section */}
      <div className="pricing-cards-section pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`pricing-plan-card relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                  plan.popular ? 'ring-2 ring-indigo-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="pricing-popular-badge absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="pricing-card-content p-8">
                  <div className="pricing-plan-header text-center mb-8">
                    <div className="pricing-plan-name text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </div>
                    <div className="pricing-plan-description text-gray-600 mb-6">
                      {plan.description}
                    </div>
                    <div className="pricing-plan-price">
                      <span className="pricing-price-amount text-5xl font-bold text-gray-900">
                        ${getPrice(plan)}
                      </span>
                      <span className="pricing-price-period text-gray-600">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                      {billingCycle === 'yearly' && (
                        <div className="pricing-yearly-savings text-sm text-green-600 font-medium mt-1">
                          Save {getSavings(plan)}% annually
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pricing-features-list mb-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="pricing-feature-item flex items-start">
                          <svg className="pricing-check-icon w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="pricing-feature-text text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    className={`pricing-cta-button w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                      plan.popular
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="pricing-faq-section bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pricing-faq-header text-center mb-16">
            <div className="pricing-faq-title text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </div>
            <div className="pricing-faq-subtitle text-lg text-gray-600">
              Everything you need to know about our pricing plans
            </div>
          </div>

          <div className="pricing-faq-grid grid gap-8 md:grid-cols-2">
            <div className="pricing-faq-item">
              <div className="pricing-faq-question text-lg font-semibold text-gray-900 mb-3">
                Can I change plans anytime?
              </div>
              <div className="pricing-faq-answer text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </div>
            </div>
            
            <div className="pricing-faq-item">
              <div className="pricing-faq-question text-lg font-semibold text-gray-900 mb-3">
                Is there a free trial?
              </div>
              <div className="pricing-faq-answer text-gray-600">
                Yes, we offer a 14-day free trial for all plans. No credit card required to get started.
              </div>
            </div>
            
            <div className="pricing-faq-item">
              <div className="pricing-faq-question text-lg font-semibold text-gray-900 mb-3">
                What payment methods do you accept?
              </div>
              <div className="pricing-faq-answer text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for enterprise customers.
              </div>
            </div>
            
            <div className="pricing-faq-item">
              <div className="pricing-faq-question text-lg font-semibold text-gray-900 mb-3">
                Can I cancel anytime?
              </div>
              <div className="pricing-faq-answer text-gray-600">
                Absolutely! You can cancel your subscription at any time with no cancellation fees.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="pricing-cta-section bg-indigo-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="pricing-cta-title text-3xl font-bold text-white mb-4">
            Ready to get started?
          </div>
          <div className="pricing-cta-description text-xl text-indigo-100 mb-8">
            Join thousands of teams already using our service to brighten their day with XKCD comics.
          </div>
          <div className="pricing-cta-buttons flex flex-col sm:flex-row gap-4 justify-center">
            <button className="pricing-cta-primary bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Start Free Trial
            </button>
            <button className="pricing-cta-secondary border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;