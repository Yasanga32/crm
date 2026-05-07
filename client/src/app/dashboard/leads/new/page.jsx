import React from 'react';
import LeadForm from '@/components/LeadForm';

export const metadata = {
  title: 'Create New Lead | LeadFlow CRM',
  description: 'Add a new prospect to your sales intelligence ecosystem.',
};

const NewLeadPage = () => {
  return (
    <div className="animate-in">
      <LeadForm />
    </div>
  );
};

export default NewLeadPage;
