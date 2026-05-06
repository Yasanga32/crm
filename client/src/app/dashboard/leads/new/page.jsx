import React from 'react';
import LeadForm from '@/components/LeadForm';

export const metadata = {
  title: 'Create New Lead | CRM',
  description: 'Add a new lead to your CRM system',
};

const NewLeadPage = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">New Lead</h1>
        <p className="text-gray-500 mt-1">Enter the details for the new prospect.</p>
      </div>
      <LeadForm />
    </div>
  );
};

export default NewLeadPage;
