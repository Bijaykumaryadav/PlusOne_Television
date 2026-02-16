/* =====================================================
   ADMIN AUTH CONFIG
===================================================== */

export const registerFormControls = [
    {
        name: 'userName',
        label: "User Name",
        placeholder: "Enter your user name",
        componentType: "input",
        type: "text",
    },
    {
        name: 'email',
        label: "Email",
        placeholder: "Enter your email",
        componentType: "input",
        type: "email",
    },
    {
        name: 'password',
        label: "Password",
        placeholder: "Enter your password",
        componentType: "input",
        type: "password",
    }
]


/* =====================================================
   ARTICLE FORM CONFIG (ADMIN PANEL)
===================================================== */

export const articleFormControls = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter article title",
  },
  {
    label: "Subtitle",
    name: "subtitle",
    componentType: "input",
    type: "text",
    placeholder: "Enter subtitle (optional)",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "politics", label: "Politics" },
      { id: "sports", label: "Sports" },
      { id: "technology", label: "Technology" },
      { id: "entertainment", label: "Entertainment" },
      { id: "business", label: "Business" },
      { id: "health", label: "Health" },
      { id: "world", label: "World" },
    ],
  },
  {
    label: "Featured Image URL",
    name: "image",
    componentType: "input",
    type: "text",
    placeholder: "Paste image URL",
  },
  {
    label: "Content",
    name: "content",
    componentType: "textarea",
    placeholder: "Write full article content here...",
  },
  {
    label: "Tags",
    name: "tags",
    componentType: "input",
    type: "text",
    placeholder: "Comma separated tags",
  },
  {
    label: "Status",
    name: "status",
    componentType: "select",
    options: [
      { id: "draft", label: "Draft" },
      { id: "published", label: "Published" },
    ],
  },
];


/* =====================================================
   NEWS HEADER MENU (USER SIDE)
===================================================== */

export const newsHeaderMenuItems = [
  { id: "home", label: "Home", path: "/" },
  { id: "politics", label: "Politics", path: "/category/politics" },
  { id: "sports", label: "Sports", path: "/category/sports" },
  { id: "technology", label: "Technology", path: "/category/technology" },
  { id: "entertainment", label: "Entertainment", path: "/category/entertainment" },
  { id: "business", label: "Business", path: "/category/business" },
];


/* =====================================================
   CATEGORY OPTIONS MAP
===================================================== */

export const newsCategoryOptionsMap = {
  politics: "Politics",
  sports: "Sports",
  technology: "Technology",
  entertainment: "Entertainment",
  business: "Business",
  health: "Health",
  world: "World",
};


/* =====================================================
   FILTER OPTIONS
===================================================== */

export const newsFilterOptions = {
  category: [
    { id: "politics", label: "Politics" },
    { id: "sports", label: "Sports" },
    { id: "technology", label: "Technology" },
    { id: "entertainment", label: "Entertainment" },
    { id: "business", label: "Business" },
    { id: "health", label: "Health" },
    { id: "world", label: "World" },
  ],
  status: [
    { id: "published", label: "Published" },
    { id: "draft", label: "Draft" },
  ],
};


/* =====================================================
   SORT OPTIONS
===================================================== */

export const newsSortOptions = [
  { id: "latest", label: "Latest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];


/* =====================================================
   ADMIN DASHBOARD MENU
===================================================== */

export const adminDashboardMenu = [
  { id: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
  { id: "articles", label: "Manage Articles", path: "/admin/articles" },
  { id: "create-article", label: "Write Article", path: "/admin/create" },
  { id: "drafts", label: "Draft Articles", path: "/admin/drafts" },
  { id: "profile", label: "Profile", path: "/admin/profile" },
];
