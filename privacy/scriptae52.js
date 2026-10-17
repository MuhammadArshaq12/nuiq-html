var privacyDropDownOptions = [
  {
    id: "1.0",
    title: "Introduction",
    context:
      "At NulQ, we are committed to respecting your online privacy and recognizing the need for appropriate protection and management of any personally identifiable information ('Personal Information') and Personal Health Information ('PHI') you share with us while using our product, NulQ.",
  },
  {
    id: "2.0",
    title: "Information We Collect",
    context:
      "We collect personal identifying information such as your username, name, and email when you create an account with us or contact us directly. We gather general logs of activity like service usage amounts. We may collect non-personal information such as your IP address, browser type, and usage data when you access NulQ.",
  },
  {
    id: "3.0",
    title: "Use Of Information",
    context:
      "We use the collected information to provide, maintain, and improve NulQ and its features; to respond to your inquiries and support requests; and to communicate with you about updates, promotions, and news.",
  },
  {
    id: "4.0",
    title: "Data Security, HIPAA Compliance, and PHI Handling",
    context:
      "NulQ adheres strictly to the regulations set forth by the Health Insurance Portability and Accountability Act (HIPAA). As such:\n4.1 PHI data is encrypted in transit and at rest, and this information is cached solely for processing and scrubbed from our systems within minutes after delivery to the client.\n4.2 Our employees do not have access to any PHI data, including transcripts and notes, even for troubleshooting purposes. All personnel who may interact with code that handles PHI receive instruction in HIPAA compliance.\n4.3 In the unlikely event of a data breach, we will follow all required steps as set forth by HIPAA for breach notification.",
  },
  {
    id: "5.0",
    title: "User Access and Controls",
    context:
      "Employees have restricted access to any personally identifiable information and no access to PHI. Users retain the right to request the amendment or deletion of their Personal Information.",
  },
  {
    id: "6.0",
    title: "Data Sharing and Disclosure",
    context:
      "We do not store PHI and do not share any such information. Metadata may be disclosed if required by law.",
  },
  {
    id: "7.0",
    title: "Use of Google Analytics",
    context:
      "Google Analytics helps us understand how our customers use NulQ, focusing on site traffic and usage patterns.",
  },
  {
    id: "8.0",
    title: "Email Marketing",
    context:
      "You may opt out of marketing communications at any time by contacting support@nuiq.com.",
  },
  {
    id: "9.0",
    title: "Changes to This Privacy Policy",
    context:
      "We may update this policy and encourage you to review it periodically.",
  },
  {
    id: "10.0",
    title: "Payment Information",
    context:
      "We use Stripe for payment processing. They manage all sensitive payment details in compliance with their Privacy Policy.",
  },
  {
    id: "11.0",
    title: "Governing Law",
    context:
      "This Privacy Policy and any privacy related issues are governed by the laws of Utah and the United States.",
  },
  {
    id: "12.0",
    title: "Contact Us",
    context:
      "For any privacy-related concerns or inquiries, please contact us at support@nuiq.com.",
  },
];

var termsDropDownOptions = [
  {
    id: "1.0",
    title: "Introduction",
    context:
      "Welcome to NuIQ. This website and its associated services are owned and operated by NulQ. By visiting our website and accessing the information, resources, services, products, and tools we provide, you understand and agree to accept and adhere to the following terms and conditions.",
  },
  {
    id: "2.0",
    title: "Responsible Use and Conduct",
    context:
      "By visiting our website and accessing the information, resources, services, products, and tools we provide, you agree to use these resources only for the purposes intended as permitted by the terms of this Agreement, and in a manner that abides by all applicable laws. Creating multiple accounts for the purpose of manipulating, abusing, or misrepresenting yourself or others on our website is strictly prohibited and constitutes a violation of this Agreement. Any violation may result in the termination of your access to the website.",
  },
  {
    id: "3.0",
    title: "Liability Limitations",
    context:
      "NulQ is not liable if a user enters any personal identifying information in violation of HIPAA rules. Users are reminded that our service does not require any personally identifiable information or Personal Health Identifying Information to generate documentation templates. NuIQ WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO THESE TERMS OF SERVICE OR YOUR USE OF THE SERVICE, INCLUDING, WITHOUT LIMITATION, LOSS OF REVENUE, PROFITS, OR BUSINESS INTERRUPTION.",
  },
  {
    id: "4.0",
    title: "Changes and Termination of Services",
    context:
      "NulQ reserves the right to cease operations at any time. Continued use of the Service following such changes constitutes your acceptance of the changes.",
  },
  {
    id: "5.0",
    title: "Use of Generated Content",
    context:
      "NulQ provides templates for documentation. However, the ultimate responsibility for the content of the documentation lies with the user. We are not liable for any inaccuracies, errors, or omissions in the templates generated. Users should use their professional judgment when using these templates in their work.",
  },
  {
    id: "6.0",
    title: "Collection of Information",
    context:
      "We may collect personal information such as your username, email, and usage data when you use our service, or contact us. We also keep general logs of activity like the amounts of our services used.",
  },
  {
    id: "7.0",
    title: "Payment Processing",
    context:
      "We use a third-party service, Stripe, for payment processing. We do not store or collect your payment card details. That information is provided directly to our third-party payment processors whose use of your personal information is governed by their Privacy Policy. Please refer to Stripe's Privacy Policy for more information.",
  },
  {
    id: "8.0",
    title: "Service Access, Payments and Refunds",
    context:
      "NulQ offers access to its services for purchase. Payment for the services is required at the time of purchase and is non-refundable. Once the services are purchased, no refunds will be provided, even if the user does not utilize all aspects of the service.",
  },
  {
    id: "9.0",
    title: "SMS Terms",
    context:
      "NulQ occasionally sends text messages as needed to notify of pending subscription expiration or when nearing a subscription limit. This message frequency is rare and only happens to warn of a pending subscription issue. Message and data rates may apply. Text HELP to (801) 804-0611 for assistance. Reply STOP to opt-out. Carriers are not liable for any delays or undelivered messages.",
  },
  {
    id: "10.0",
    title: "Disclaimer of Warranties",
    context:
      "THE SERVICE IS PROVIDED 'AS IS' AND WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NONINFRINGEMENT. NUIQ DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE.",
  },
  {
    id: "11.0",
    title: "Indemnification",
    context:
      "You agree to indemnify and hold harmless NulQ, its affiliates, officers, directors, employees, agents, and licensors from and against all losses, expenses, damages, and costs, including reasonable attorneys' fees, resulting from any violation of this disclaimer or any activity related to your use of the Service.",
  },
  {
    id: "12.0",
    title: "Governing Law",
    context:
      "This disclaimer shall be governed by and construed in accordance with the laws of Utah, without regard to its conflict of law principles.",
  },
];

function createDropdownItem(item) {
  const optionItem = document.createElement("li");
  optionItem.addEventListener("click", function () {
    document.getElementById("dropdownMenuButton2").innerText = `${item.title}`;
  });
  optionItem.innerHTML = `<a class="dropdown-item" href="#${item.id}">${item.title}</a>`;
  return optionItem;
}

function createDataContainer(item) {
  const dataContainer = document.createElement("div");
  dataContainer.setAttribute("id", item.id);
  dataContainer.setAttribute('class','data-container');
  dataContainer.innerHTML = `
    <div>
      <h5>${item.id} ${item.title}</h5>
    </div>
    <div>
      <p>${item.context}</p>
    </div>`;
  return dataContainer;
}

function handleSwitchTabs(array) {
  const dropdownFragment = document.createDocumentFragment();
  const dataFragment = document.createDocumentFragment();

  array.forEach((item) => {
    const optionItem = createDropdownItem(item);
    const dataContainer = createDataContainer(item);

    dropdownFragment.appendChild(optionItem);
    dataFragment.appendChild(dataContainer);
  });

  document.getElementById("privacy-dropdown").appendChild(dropdownFragment);
  document.getElementById("data-preview").appendChild(dataFragment);
}

function clearData() {
  const dropdown = document.getElementById("privacy-dropdown");
  const dataPreview = document.getElementById("data-preview");
  dropdown.innerHTML = "";
  dataPreview.innerHTML = "";
}

const privacyBtn = document.getElementById("privacy-btn");
const termsBtn = document.getElementById("terms-btn");

privacyBtn.addEventListener("click", function (event) {
  scrollToTop();
  setUrlSearchParams('tab','privacy-policy');
  document.title = "Privacy Policy | NuIQ - Automatic Therapy Notes";
  event.preventDefault();
  clearData();
  handleSwitchTabs(privacyDropDownOptions);
  termsBtn.classList.remove("tabIsActive");
  privacyBtn.classList.add("tabIsActive");
});

termsBtn.addEventListener("click", function (event) {
  scrollToTop();
  setUrlSearchParams('tab','terms-of-service');
  document.title = "Terms of Service | NuIQ - Automatic Therapy Notes";
  event.preventDefault();
  clearData();
  handleSwitchTabs(termsDropDownOptions);
  privacyBtn.classList.remove("tabIsActive");
  termsBtn.classList.add("tabIsActive");
});

//starting privacy
document.addEventListener("DOMContentLoaded", function () {
  const tab = getUrlSearchParams('tab');
  if(tab === null || tab === 'privacy-policy'){
    setUrlSearchParams('tab','privacy-policy');
    handleSwitchTabs(privacyDropDownOptions);
  }else if (tab == 'terms-of-service') {
    handleSwitchTabs(termsDropDownOptions);
    privacyBtn.classList.remove("tabIsActive");
    termsBtn.classList.add("tabIsActive");
  }
});

function handleScroll() {
  const privacyHeader = document.getElementById('privacy-header');
  if (window.scrollY > 620) {
    privacyHeader.classList.add('fixed-privacy-header');
  } else {
    privacyHeader.classList.remove('fixed-privacy-header');
  }
}

window.addEventListener('scroll', handleScroll);
