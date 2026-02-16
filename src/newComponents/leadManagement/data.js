// Lead Management Data
export const cardData = [
  {
    title: "Total Leads",
    icon: "users", // Changed to meaningful icon name
    value: "1,234",
    description: "+12% from last month",
    color: "blue"
  },
  {
    title: "Hot Leads",
    icon: "trending-up",
    value: "89",
    description: "+5% from last week",
    color: "red"
  },
  {
    title: "Conversion Rate",
    icon: "target",
    value: "23.5%",
    description: "+2.1% from last month",
    color: "green"
  },
  {
    title: "Total Value",
    icon: "dollar-sign",
    value: "$2.4M",
    description: "+18% from last month",
    color: "purple"
  }
];

// Lead sources for dropdown
export const leadSources = [
  "website",
  "Referral", 
  "Cold Call",
  "LinkedIn",
  "Trade Show",
  "Email Campaign",
  "Social Media",
  "Event",
  "Organic Search",
  "Paid Ads"
];

// Lead statuses
export const leadStatuses = [
  { value: "Hot", label: "Hot", color: "red" },
  { value: "Warm", label: "Warm", color: "orange" },
  { value: "Cold", label: "Cold", color: "blue" }
];

// Form validation rules
export const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    required: true,
    pattern: /^[\+]?[\d\s\-\(\)]{10,}$/
  },
  company: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  value: {
    required: true,
    pattern: /^\$?[\d,]+(\.\d{2})?$/
  }
};