// ====== Static datasets for admin subpages ======
// Swap each for its API response later.

// ---- Orders
export const ordersKpis = [
  { key: 'total', label: 'Total Orders', value: '1,245', icon: 'bag', change: '14.2%', up: true, sub: 'this month' },
  { key: 'pending', label: 'Pending', value: '125', icon: 'box', sub: 'awaiting action' },
  { key: 'delivered', label: 'Delivered', value: '871', icon: 'check', sub: '70% of orders' },
  { key: 'revenue', label: 'Revenue', value: '$250,450', icon: 'dollar', change: '18.6%', up: true, sub: 'this month' },
]

export const ordersList = [
  { id: '#KN-1250', customer: 'Rashed K.', email: 'rashed@mail.com', date: 'May 31, 2026', items: 2, status: 'Delivered', amount: '$245.00', payment: 'Paid' },
  { id: '#KN-1249', customer: 'Nusrat J.', email: 'nusrat@mail.com', date: 'May 31, 2026', items: 1, status: 'Processing', amount: '$120.00', payment: 'Paid' },
  { id: '#KN-1248', customer: 'Tamim H.', email: 'tamim@mail.com', date: 'May 30, 2026', items: 3, status: 'Pending', amount: '$320.00', payment: 'Pending' },
  { id: '#KN-1247', customer: 'Ayesha R.', email: 'ayesha@mail.com', date: 'May 30, 2026', items: 1, status: 'Delivered', amount: '$189.00', payment: 'Paid' },
  { id: '#KN-1246', customer: 'Sabbir A.', email: 'sabbir@mail.com', date: 'May 29, 2026', items: 2, status: 'Cancelled', amount: '$99.00', payment: 'Refunded' },
  { id: '#KN-1245', customer: 'Farhan M.', email: 'farhan@mail.com', date: 'May 29, 2026', items: 4, status: 'Delivered', amount: '$512.00', payment: 'Paid' },
  { id: '#KN-1244', customer: 'Ishita D.', email: 'ishita@mail.com', date: 'May 28, 2026', items: 1, status: 'Processing', amount: '$149.00', payment: 'Paid' },
]

export const orderStatusTabs = ['All', 'Pending', 'Processing', 'Delivered', 'Cancelled']

// ---- Inventory
export const inventoryKpis = [
  { key: 'total', label: 'Total Products', value: '357', icon: 'box', sub: 'in catalog' },
  { key: 'in', label: 'In Stock', value: '340', icon: 'check', sub: 'healthy levels' },
  { key: 'low', label: 'Low Stock', value: '12', icon: 'alert', sub: 'needs restock' },
  { key: 'out', label: 'Out of Stock', value: '5', icon: 'x', sub: 'restock now' },
]

export const inventoryList = [
  { sku: 'KN-BMB-001', name: 'LGS Reversible Bomber', category: 'Outerwear', stock: 8, status: 'Low Stock' },
  { sku: 'KN-PNT-014', name: 'Wide Leg Tailored Pants', category: 'Bottoms', stock: 42, status: 'In Stock' },
  { sku: 'KN-TNK-007', name: 'Cashmere Ribbed Tank', category: 'Knitwear', stock: 0, status: 'Out of Stock' },
  { sku: 'KN-CRG-021', name: 'Relaxed Noir Cargo', category: 'Bottoms', stock: 63, status: 'In Stock' },
  { sku: 'KN-TRC-003', name: 'Oversized Trench Coat', category: 'Outerwear', stock: 5, status: 'Low Stock' },
  { sku: 'KN-VST-009', name: 'Structured Knit Vest', category: 'Knitwear', stock: 0, status: 'Out of Stock' },
  { sku: 'KN-SHT-012', name: 'Tactical Cargo Shirt', category: 'Shirts', stock: 27, status: 'In Stock' },
]

// ---- Customers
export const customersKpis = [
  { key: 'total', label: 'Total Customers', value: '3,842', icon: 'users', change: '9.4%', up: true, sub: 'this month' },
  { key: 'new', label: 'New This Month', value: '284', icon: 'users', change: '12.1%', up: true, sub: 'vs last month' },
  { key: 'returning', label: 'Returning Rate', value: '46%', icon: 'trend', sub: 'repeat buyers' },
  { key: 'ltv', label: 'Avg. Lifetime Value', value: '$620', icon: 'dollar', sub: 'per customer' },
]

export const customersList = [
  { name: 'Rashed Karim', email: 'rashed@mail.com', orders: 12, spent: '$2,940', joined: 'Jan 2026', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop' },
  { name: 'Nusrat Jahan', email: 'nusrat@mail.com', orders: 8, spent: '$1,610', joined: 'Feb 2026', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop' },
  { name: 'Tamim Hasan', email: 'tamim@mail.com', orders: 3, spent: '$740', joined: 'Mar 2026', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop' },
  { name: 'Ayesha Rahman', email: 'ayesha@mail.com', orders: 15, spent: '$3,820', joined: 'Nov 2025', status: 'Active', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop' },
  { name: 'Sabbir Ahmed', email: 'sabbir@mail.com', orders: 1, spent: '$99', joined: 'May 2026', status: 'Inactive', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop' },
]

// ---- Finances
export const financeKpis = [
  { key: 'income', label: 'Total Income', value: '$250,450', icon: 'in', change: '18.6%', up: true, sub: 'this month' },
  { key: 'expenses', label: 'Total Expenses', value: '$182,110', icon: 'out', change: '4.2%', up: false, sub: 'this month' },
  { key: 'profit', label: 'Net Profit', value: '$68,340', icon: 'wallet', change: '20.3%', up: true, sub: 'this month' },
  { key: 'margin', label: 'Profit Margin', value: '27.3%', icon: 'percent', sub: 'healthy' },
]

export const transactions = [
  { id: 'TXN-9021', desc: 'Order payout #KN-1250', date: 'May 31, 2026', method: 'Stripe', type: 'income', amount: '+$245.00' },
  { id: 'TXN-9020', desc: 'Cloudinary subscription', date: 'May 30, 2026', method: 'Card', type: 'expense', amount: '-$99.00' },
  { id: 'TXN-9019', desc: 'Order payout #KN-1247', date: 'May 30, 2026', method: 'Stripe', type: 'income', amount: '+$189.00' },
  { id: 'TXN-9018', desc: 'Ad campaign — Meta', date: 'May 29, 2026', method: 'Card', type: 'expense', amount: '-$1,200.00' },
  { id: 'TXN-9017', desc: 'Order payout #KN-1245', date: 'May 29, 2026', method: 'Stripe', type: 'income', amount: '+$512.00' },
]

// ---- Analytics
export const analyticsKpis = [
  { key: 'visitors', label: 'Visitors', value: '84,210', icon: 'users', change: '11.2%', up: true, sub: 'this month' },
  { key: 'conversion', label: 'Conversion Rate', value: '3.8%', icon: 'trend', change: '0.6%', up: true, sub: 'vs last month' },
  { key: 'bounce', label: 'Bounce Rate', value: '42.1%', icon: 'chart', change: '2.1%', up: false, sub: 'improving' },
  { key: 'session', label: 'Avg. Session', value: '4m 12s', icon: 'bar', sub: 'per visit' },
]

export const trafficSources = [
  { label: 'Organic Search', pct: 45, color: '#C9A96E' },
  { label: 'Direct', pct: 25, color: '#8A8278' },
  { label: 'Social', pct: 20, color: '#4ade80' },
  { label: 'Referral', pct: 10, color: '#8b5cf6' },
]

export const analyticsTrend = {
  labels: ['May 01', 'May 05', 'May 10', 'May 15', 'May 20', 'May 25', 'May 30'],
  thisPeriod: [8200, 9400, 12800, 11200, 14100, 16800, 18200],
  lastPeriod: [6100, 7200, 9100, 8600, 9800, 11200, 13400],
}

// ---- Marketing
export const campaigns = [
  { name: 'SS/26 Launch Blast', channel: 'Email', sent: 12400, opened: '48%', ctr: '6.2%', status: 'Sent' },
  { name: 'Members Early Access', channel: 'Email', sent: 3200, opened: '61%', ctr: '9.4%', status: 'Sent' },
  { name: 'Cart Recovery Flow', channel: 'Automation', sent: 890, opened: '54%', ctr: '11.1%', status: 'Active' },
  { name: 'Summer Lookbook', channel: 'Push', sent: 0, opened: '—', ctr: '—', status: 'Scheduled' },
  { name: 'Loyalty Rewards', channel: 'SMS', sent: 0, opened: '—', ctr: '—', status: 'Draft' },
]

export const marketingKpis = [
  { key: 'subs', label: 'Subscribers', value: '18,240', icon: 'users', change: '5.1%', up: true, sub: 'total list' },
  { key: 'open', label: 'Avg. Open Rate', value: '52%', icon: 'send', sub: 'across campaigns' },
  { key: 'ctr', label: 'Avg. CTR', value: '8.1%', icon: 'trend', sub: 'click-through' },
]

// ---- Discounts
export const discounts = [
  { code: 'SS26LAUNCH', type: 'Percentage', value: '20%', usage: 340, limit: 1000, status: 'Active', expires: 'Jun 30, 2026' },
  { code: 'FREESHIP', type: 'Free Shipping', value: '—', usage: 1240, limit: '∞', status: 'Active', expires: 'No expiry' },
  { code: 'WELCOME10', type: 'Percentage', value: '10%', usage: 890, limit: 2000, status: 'Active', expires: 'Dec 31, 2026' },
  { code: 'ARCHIVE50', type: 'Fixed', value: '$50', usage: 120, limit: 200, status: 'Expired', expires: 'Apr 01, 2026' },
  { code: 'VIPNOIR', type: 'Percentage', value: '15%', usage: 45, limit: 100, status: 'Active', expires: 'Aug 15, 2026' },
]

// ---- Reports
export const reports = [
  { name: 'Sales Report', desc: 'Revenue, orders & AOV breakdown', period: 'Monthly', icon: 'chart' },
  { name: 'Inventory Report', desc: 'Stock levels & restock alerts', period: 'Weekly', icon: 'layers' },
  { name: 'Customer Report', desc: 'Acquisition, retention & LTV', period: 'Monthly', icon: 'users' },
  { name: 'Financial Statement', desc: 'Income, expenses & profit', period: 'Monthly', icon: 'dollar' },
  { name: 'Product Performance', desc: 'Best & worst sellers', period: 'Weekly', icon: 'box' },
  { name: 'Marketing Report', desc: 'Campaign & channel ROI', period: 'Monthly', icon: 'send' },
]

// ---- Agents
export const agents = [
  { name: 'Inventory Agent', role: 'Stock monitoring & restock suggestions', status: 'Active', icon: 'layers', accent: '#C9A96E' },
  { name: 'Finance Agent', role: 'Expense tracking & profit analysis', status: 'Active', icon: 'dollar', accent: '#4ade80' },
  { name: 'Orders Agent', role: 'Fulfilment insights & anomaly alerts', status: 'Inactive', icon: 'bag', accent: '#60a5fa' },
  { name: 'Marketing Agent', role: 'Campaign ideas & audience segments', status: 'Inactive', icon: 'send', accent: '#8b5cf6' },
]
