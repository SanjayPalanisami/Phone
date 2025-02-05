const details = {
  WelcomePage: [
    {
      message: "Welcome to the world of Pre-Owned Smartphones",
      img1: "https://techeconomy.ng/wp-content/uploads/2023/12/The-Most-Popular-Phone-Brands-in-Every-Country-in-2023.jpg",
      img2: "https://www.androidauthority.com/wp-content/uploads/2022/12/EoY-2022-phone-collage-angled.jpg", 
      button: "Verification"
    }
  ],
  HeaderVerify: ['User Details', 'Business Details', 'Shop Location', 'Community Approval'],
  userDetails: [
    { label: 'Full Name', type: 'text', maxLength: 50, required: true },
    { label: 'Business Name', type: 'text', maxLength: 50, required: true },
    { label: 'Email Address', type: 'email', maxLength: 100, required: true },
  ],
  BusinessDetails: {
    'Shop Address': [
      { label: 'Address line 1', type: 'text', maxLength: 100, required: true },
      { label: 'Address line 2', type: 'text', maxLength: 100, required: false },
      { label: 'Street', type: 'text', maxLength: 50, required: true },
      { label: 'City', type: 'text', maxLength: 50, required: true },
      { label: 'State', type: 'text', maxLength: 50, required: true },
      { label: 'Zip', type: 'number', maxLength: 6, required: true },
    ],
    'Business Registration Number': [
      { label: 'Shop License Number', type: 'text', maxLength: 20, required: true },
      { label: 'GSTIN Number', type: 'text', maxLength: 15, required: true },
    ],
    'Type of business': ['Mobile Sales', 'Repairs', 'Accessories', 'Multi-Service'],
  },
  Approval: [
    {
      message1: "You Belong to Neelambur Region",  
      message2: "Attach a Message with the Request", 
      field: "Message",  
      button: "Approval",
    }
  ],
  Request: [
    {
      message1: "The Approval takes 1hr to 2 days",
      message2: "Request send Successfully"
    }
  ],
  Status: {
    'SHOPS IN COMMUNITY': 'STATUS',
    'NAME': 'PENDING',
    'LOCATION OF THE SHOP': 'APPROVES'
  },
  fakeProfile: {
    userDetails: {
      'Full Name': 'John Doe',
      'Business Name': 'Doe Enterprises',
      'Contact Number': '+1 555-1234-5678',
      'Email Address': 'johndoe@example.com',
    },
    BusinessDetails: {
      'Shop Address': {
        'Address line 1': '123 Main St.',
        'Address line 2': 'Suite 101',
        'Street': 'Main Street',
        'City': 'Springfield',
        'State': 'Illinois',
        'Zip': '62701',
      },
      'Business Registration Number': {
        'Shop License Number': 'ABC123456789',
        'GSTIN Number': 'GSTIN12345XYZ',
      },
    },
  },
};

export default details;