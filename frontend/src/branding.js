// College Branding Configuration
// Update these values with your actual college information

export const collegeBranding = {
  // College Information
  college_name: "HITAM (ICFAI Foundation for Higher Education, Hyderabad)",
  college_short_name: "HITAM",
  college_website: "https://www.iiit.ac.in/",
  
  // Colors (Update with your college colors)
  colors: {
    primary: "#003366",      // Deep Blue
    secondary: "#FF6B35",    // Orange
    accent: "#004E89",       // Navy Blue
    success: "#06D6A0",      // Teal
    warning: "#EF476F",      // Red
    info: "#118AB2",         // Light Blue
    dark: "#073B4C",         // Dark Teal
  },
  
  // Logos and Images
  logo: {
    full: "/hitam-logo-full.png",
    icon: "/hitam-logo-icon.png",
    alt_text: "HITAM Logo"
  },
  
  // Tagline and Description
  tagline: "Water Quality Monitoring System",
  description: "Real-Time Analysis & Tracking System for Sustainable Water Management",
  
  // Department/Lab Information
  department: "Department of Artificial Intelligence",
  lab: "Smart Grid & Water Management Lab",
  
  // Contact Information (Optional)
  contact: {
    email: "contact@iiit.ac.in",
    phone: "+91-XXXXXXXXXX",
    address: "Hyderabad, Telangana, India"
  },
  
  // Social Links (Optional)
  social: {
    twitter: "https://twitter.com/IIIT",
    linkedin: "https://linkedin.com/company/iiit-hyderabad",
    github: "https://github.com/IIIT"
  },
  
  // Footer Information
  footer: {
    copyright: `© 2026 ${this.college_name}. All rights reserved.`,
    privacy_policy: "/privacy",
    terms_of_service: "/terms"
  }
};

export default collegeBranding;
