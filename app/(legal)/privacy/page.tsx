"use client"
import React from 'react'

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>Welcome to Notes AI. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <p>We collect information that you provide directly to us, such as when you create an account, update your profile, or use certain features of our service. This may include:</p>
          <ul className="list-disc ml-8 mt-2">
            <li>Personal information (name, email address)</li>
            <li>User-generated content such as notes and documents</li>
            <li>Usage data and analytics</li>
            <li>Device information</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p>We may use the information we collect for various purposes, including to:</p>
          <ul className="list-disc ml-8 mt-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process and fulfill your requests</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Develop new products and services</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Sharing Your Information</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc ml-8 mt-2">
            <li>Service providers who perform services on our behalf</li>
            <li>Business partners with your consent</li>
            <li>For legal purposes when required by law</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Security</h2>
          <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Your Choices</h2>
          <p>You may update, correct, or delete your account information at any time by logging into your account settings. You may also contact us to request access to, correction of, or deletion of personal information.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at support@notesai.com.</p>
        </section>
        
        <div className="mt-8 text-sm text-gray-600">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  ) 
}

export default Privacy; 
