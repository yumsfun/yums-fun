'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

// FAQ data
const FAQS = [
  {
    question: 'What is yums.fun?',
    answer: 'yums.fun is a memecoin launchpad on Solana that allows users to easily create and trade tokens with minimal effort. Our platform provides a user-friendly interface for launching your own memecoin and discovering trending tokens in the ecosystem.'
  },
  {
    question: 'How do I create a token?',
    answer: 'To create a token, connect your Solana wallet, click on "Start a new token" button, and follow the simple steps in our token creation form. You\'ll need to provide a name, symbol, and other optional details, then pay a small fee in SOL to deploy your token on the Solana blockchain.'
  },
  {
    question: 'What wallets are supported?',
    answer: 'We currently support Phantom and Solflare wallets. More wallet integrations will be added in the future.'
  },
  {
    question: 'How much does it cost to create a token?',
    answer: 'Creating a token on yums.fun costs 0.05 SOL. This fee covers the cost of deploying your token on the Solana blockchain and maintaining our platform.'
  },
  {
    question: 'Can I customize my token after creation?',
    answer: 'Some aspects of your token, such as the logo and description, can be updated after creation. However, core parameters like the name, symbol, and initial supply cannot be changed once the token is deployed on the blockchain.'
  },
  {
    question: 'How do I buy tokens on yums.fun?',
    answer: 'To buy tokens, navigate to the token\'s detail page, enter the amount of SOL you want to spend in the buy panel, and click the "Buy" button. The transaction will be processed on the Solana blockchain, and the tokens will be sent to your connected wallet.'
  },
  {
    question: 'Is there a fee for trading tokens?',
    answer: 'Yes, there is a small fee for trading tokens on yums.fun. The fee varies depending on the token but is typically around 1-3% of the transaction value. This fee is used to maintain the platform and provide liquidity.'
  },
  {
    question: 'How can I list my existing token on yums.fun?',
    answer: 'If you already have a token on Solana and want to list it on yums.fun, please contact our support team with details about your token. We\'ll review your request and guide you through the listing process.'
  }
];

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };
  
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center mb-10">Support Center</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left Column - FAQs */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {FAQS.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-navy-600 rounded-xl overflow-hidden"
                >
                  <button
                    className="w-full px-4 py-3 flex justify-between items-center text-left font-medium"
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 transition-transform ${expandedFaq === index ? 'transform rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedFaq === index && (
                    <div className="px-4 pb-4 text-gray-300">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-navy-600 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Still have questions?</h3>
              <p className="text-gray-300 mb-4">
                If you couldn't find the answer to your question in our FAQs, please feel free to contact us using the form. Our support team will get back to you as soon as possible.
              </p>
              <Link href="#contact-form" className="text-primary hover:underline">
                Contact Support →
              </Link>
            </div>
          </div>
          
          {/* Right Column - Contact Form */}
          <div id="contact-form">
            <div className="bg-navy-600 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-navy">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-gray-300 mb-4">
                    Thank you for reaching out. Our support team will get back to you as soon as possible.
                  </p>
                  <button
                    className="text-primary hover:underline"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-navy-700 border border-navy-500 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-navy-700 border border-navy-500 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-navy-700 border border-navy-500 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="token-creation">Token Creation</option>
                      <option value="trading">Trading</option>
                      <option value="wallet">Wallet Issues</option>
                      <option value="listing">Token Listing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-2 bg-navy-700 border border-navy-500 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-white"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 