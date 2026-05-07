import Lead from '../models/Lead.js';


export const getLeads = async (req, res) => {
  try {
    const { status, source, salesperson, search } = req.query;

    //Build query object
    let query = {};

    //Only get leads owned by the logged-in user by default
    if (salesperson) {
      query.owner = salesperson;
    } else {
      query.owner = req.user._id;
    }

    //Apply filters
    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    //Apply search
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { company: searchRegex },
      ];
    }

    const leads = await Lead.find(query).populate('owner', 'name email').sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('owner', 'name email');

    if (lead) {
      // Check if user is owner
      if (lead.owner._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this lead' });
      }
      res.json(lead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createLead = async (req, res) => {
  const { name, email, phone, company, status, source } = req.body;

  try {
    const lead = new Lead({
      name,
      email,
      phone,
      company,
      status,
      source,
      owner: req.user._id,
    });

    const createdLead = await lead.save();
    res.status(201).json(createdLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      //Check if user is owner
      if (lead.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this lead' });
      }

      lead.name = req.body.name || lead.name;
      lead.email = req.body.email || lead.email;
      lead.phone = req.body.phone || lead.phone;
      lead.company = req.body.company || lead.company;
      lead.status = req.body.status || lead.status;
      lead.source = req.body.source || lead.source;

      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      //Check if user is owner
      if (lead.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this lead' });
      }

      await lead.deleteOne();
      res.json({ message: 'Lead removed' });
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
