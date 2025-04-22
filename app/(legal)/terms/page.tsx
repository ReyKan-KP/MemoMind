"use client"
import React from 'react'

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>By accessing or using Notes AI, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p>Permission is granted to temporarily use Notes AI for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
          <ul className="list-disc ml-8 mt-2">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software contained on the service</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p>When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your password and for all activities that occur under your account.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
          <p>Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You retain any and all of your rights to any content you submit, post or display on or through the service.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Disclaimer</h2>
          <p>The materials on Notes AI are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Limitations</h2>
          <p>In no event shall Notes AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Notes AI, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Third-Party Links</h2>
          <p>Notes AI may contain links to third-party web sites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
          <p>These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.</p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at support@notesai.com.</p>
        </section>
        
        <div className="mt-8 text-sm text-gray-600">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  ) 
}

export default Terms;
