
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
    <>
    </>
  );
};

export default PricingPage;