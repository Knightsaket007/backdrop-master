'use client'
import React, { useState } from 'react';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const pricingPlans = [
    {
      name: 'Free',
      description: 'Get started with essential features at no cost',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        '3 background edits per month',
        'Basic fonts & filters',
        'Standard resolution export',
      ],
      popular: false,
      buttonText: 'Get Started Free'
    },
    {
      name: 'Starter',
      description: 'Perfect for hobby projects & personal use',
      monthlyPrice: 9,
      yearlyPrice: 90,
      features: [
        '20 background edits per month',
        'Full Google Fonts library',
        'HD exports',
        'Email support'
      ],
      popular: false,
      buttonText: 'Upgrade to Starter'
    },
    {
      name: 'Pro',
      description: 'For designers & creators who want more control',
      monthlyPrice: 19,
      yearlyPrice: 190,
      features: [
        'Unlimited background edits',
        'Advanced filters & effects',
        'High-resolution exports (up to 4K)',
        'Sticker library & crop tools',
        'Priority email & chat support'
      ],
      popular: true,
      buttonText: 'Start Free'
    }
  ];

  const getPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan) => {
    if (plan.monthlyPrice === 0) return 0;
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlyCost = plan.yearlyPrice;
    return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header Section */}
      <div className="py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mb-6">
            ✨ Special Launch Offer - Save up to 20%
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Get the best tools to create stunning backdrops. Start for free and upgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-16">
            <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${billingCycle === 'yearly' ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards Section */}
      <div className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                plan.popular ? 'ring-2 ring-indigo-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div>
                    {plan.monthlyPrice === 0 ? (
                      <span className="text-4xl font-bold text-gray-900">Free</span>
                    ) : (
                      <>
                        <span className="text-5xl font-bold text-gray-900">${getPrice(plan)}</span>
                        <span className="text-gray-600">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                        {billingCycle === 'yearly' && (
                          <div className="text-sm text-green-600 font-medium mt-1">
                            Save {getSavings(plan)}% annually
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
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

      {/* FAQ Section */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about our pricing plans</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I change plans anytime?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will apply in the next billing cycle.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you offer a free trial?</h3>
              <p className="text-gray-600">Yes, we offer a 7-day free trial on the Pro plan. No credit card required.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What payment methods are accepted?</h3>
              <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I cancel anytime?</h3>
              <p className="text-gray-600">Absolutely! You can cancel your subscription at any time without cancellation fees.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Create stunning backdrops in minutes</h2>
          <p className="text-xl text-indigo-100 mb-8">Join creators and businesses already using Backdrop Master to level up their visuals.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Start Free
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all">
              View Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
