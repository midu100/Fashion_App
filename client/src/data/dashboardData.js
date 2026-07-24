// ====== Static dashboard data ======
// Single source for the admin dashboard UI. Swap these for API responses later
// (each block maps to a field returned by GET /dashboard/overview).

// ====== Sidebar navigation
export const adminNav = [
  { label: 'Dashboard', icon: 'grid', to: '/admin' },
  { label: 'Analytics', icon: 'bar', to: '/admin/analytics' },
  { label: 'Orders', icon: 'bag', to: '/admin/orders', badge: 24 },
  { label: 'Products', icon: 'box', to: '/admin/products' },
  { label: 'Categories', icon: 'tag', to: '/admin/categories' },
  { label: 'Inventory', icon: 'layers', to: '/admin/inventory' },
  { label: 'Customers', icon: 'users', to: '/admin/customers' },
  { label: 'Finances', icon: 'dollar', to: '/admin/finances' },
  { label: 'Marketing', icon: 'send', to: '/admin/marketing' },
  { label: 'Discounts', icon: 'tag', to: '/admin/discounts' },
  { label: 'Agents', icon: 'cpu', to: '/admin/agents', tag: 'New' },
  { label: 'Reports', icon: 'chart', to: '/admin/reports' },
  { label: 'Settings', icon: 'settings', to: '/admin/settings' },
]

// ====== Top KPI cards
export const kpis = [
  { key: 'revenue', label: 'Total Revenue', value: '$250,450.00', change: '18.6%', up: true, icon: 'dollar', sub: 'vs Apr 01 - Apr 30' },
  { key: 'orders', label: 'Orders', value: '1,245', change: '14.2%', up: true, icon: 'box', sub: 'vs Apr 01 - Apr 30' },
  { key: 'aov', label: 'Average Order Value', value: '$201.20', change: '6.1%', up: true, icon: 'trend', sub: 'vs Apr 01 - Apr 30' },
  { key: 'profit', label: 'Net Profit', value: '$68,340.00', change: '20.3%', up: true, icon: 'wallet', sub: 'vs Apr 01 - Apr 30' },
]

// ====== Revenue chart (line — this period vs last period)
export const revenueChart = {
  labels: ['May 01', 'May 05', 'May 10', 'May 15', 'May 20', 'May 25', 'May 30'],
  thisPeriod: [11000, 14500, 21500, 16000, 19500, 24000, 27500],
  lastPeriod: [7000, 9000, 12500, 10500, 11000, 14500, 17500],
}

// ====== Sales by channel (donut)
export const salesByChannel = {
  total: '$250,450',
  channels: [
    { label: 'Website', pct: 60, value: '$150,270', color: '#C9A96E' },
    { label: 'Mobile App', pct: 25, value: '$62,610', color: '#8A8278' },
    { label: 'Marketplace', pct: 10, value: '$25,045', color: '#4ade80' },
    { label: 'Retail Store', pct: 5, value: '$12,525', color: '#8b5cf6' },
  ],
}

// ====== Orders overview (donut)
export const ordersOverview = {
  total: 1245,
  segments: [
    { label: 'Delivered', pct: 70, count: 871, color: '#4ade80' },
    { label: 'Processing', pct: 15, count: 187, color: '#C9A96E' },
    { label: 'Pending', pct: 10, count: 125, color: '#60a5fa' },
    { label: 'Cancelled', pct: 5, count: 62, color: '#f87171' },
  ],
}

// ====== Inventory status
export const inventoryStatus = [
  { label: 'Low Stock', value: '12 products', tone: 'warning', icon: 'alert' },
  { label: 'Out of Stock', value: '5 products', tone: 'danger', icon: 'x' },
  { label: 'In Stock', value: '340 products', tone: 'success', icon: 'check' },
  { label: 'Total Products', value: '357 products', tone: 'muted', icon: 'box' },
]

// ====== Financial summary
export const financialSummary = [
  { label: 'Total Income', value: '$250,450.00', icon: 'in' },
  { label: 'Total Expenses', value: '$182,110.00', icon: 'out' },
  { label: 'Net Profit', value: '$68,340.00', icon: 'wallet' },
  { label: 'Profit Margin', value: '27.3%', icon: 'percent' },
]

// ====== Top selling products
export const topSelling = [
  { name: 'Oversized Linen Shirt', sold: 1245, revenue: '$24,980', pct: 100, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=200&auto=format&fit=crop' },
  { name: 'Tailored Blazer', sold: 890, revenue: '$18,760', pct: 78, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=200&auto=format&fit=crop' },
  { name: 'Minimal Sneakers', sold: 760, revenue: '$15,200', pct: 64, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=200&auto=format&fit=crop' },
  { name: 'Leather Tote Bag', sold: 540, revenue: '$11,430', pct: 48, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=200&auto=format&fit=crop' },
  { name: 'Relaxed Fit Tee', sold: 430, revenue: '$8,600', pct: 36, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=200&auto=format&fit=crop' },
]

// ====== Recent orders
export const recentOrders = [
  { id: '#KN-1250', customer: 'Rashed K.', date: 'May 31, 2026', status: 'Delivered', amount: '$245.00', payment: 'Paid' },
  { id: '#KN-1249', customer: 'Nusrat J.', date: 'May 31, 2026', status: 'Processing', amount: '$120.00', payment: 'Paid' },
  { id: '#KN-1248', customer: 'Tamim H.', date: 'May 30, 2026', status: 'Pending', amount: '$320.00', payment: 'Pending' },
  { id: '#KN-1247', customer: 'Ayesha R.', date: 'May 30, 2026', status: 'Delivered', amount: '$189.00', payment: 'Paid' },
  { id: '#KN-1246', customer: 'Sabbir A.', date: 'May 29, 2026', status: 'Cancelled', amount: '$99.00', payment: 'Refunded' },
]

// ====== Status → colour map (badges)
export const statusColor = {
  Delivered: '#4ade80',
  Processing: '#C9A96E',
  Pending: '#60a5fa',
  Cancelled: '#f87171',
  Paid: '#4ade80',
  Refunded: '#f87171',
}

// ====== Admin identity (static for now)
export const adminUser = {
  name: 'Mridul Ahasan',
  role: 'Admin',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
}
