# TerraSentinel Flood Analytics Dashboard

## 🚀 New Features Added

### 📊 **Real-Time Flood Analytics**
- **Flood Trends by State**: Interactive bar chart showing total flood incidents (2015-2024) for top 10 Indian states
- **Rainfall Correlation**: Scatter plot with correlation coefficient (r-value) and insights
- **Historical Flood Charts**: Time-series data with dual-axis (incidents + rainfall) and state filtering
- **Flood Risk Scores**: Real-time risk assessment (0-100 scale) with color-coded alerts

### 🌍 **Comprehensive Indian Dataset**
- **20 Indian States**: Complete flood data for major flood-prone regions
- **10-Year Historical Data**: 2015-2024 flood incidents, rainfall, and impact metrics
- **Realistic Metrics**: Population affected, economic loss, severity levels
- **Monsoon Patterns**: Seasonal variations and extreme weather events

### 🎯 **Advanced Features**
- **Risk Calculation**: Algorithm based on rainfall thresholds and historical patterns
- **Color-Coded Risk Levels**: 
  - 🟢 Green (0-25): Low Risk
  - 🟡 Yellow (25-50): Moderate Risk  
  - 🟠 Amber (50-75): High Risk
  - 🔴 Red (75-100): Critical Risk
- **State Filtering**: Dynamic filtering for historical data analysis
- **Correlation Insights**: Automated analysis of rainfall-flood relationships

### 📡 **API Integration**
- **OpenWeatherMap API**: Real-time rainfall data integration
- **Fallback System**: Graceful degradation with realistic synthetic data
- **Error Handling**: Comprehensive error messages and loading states
- **Live Data Updates**: Real-time dashboard statistics from PostgreSQL database

### 🎨 **UI/UX Enhancements**
- **Loading States**: Skeleton loaders and smooth transitions
- **Error Messages**: User-friendly API failure notifications
- **Responsive Design**: Mobile-optimized analytics charts
- **Interactive Tooltips**: Detailed data on hover
- **Preserved Styling**: Original design maintained exactly

## 📁 **Files Added/Modified**

### New Files:
- `app/analytics/flood-data-service.ts` - Comprehensive data service
- `.env.example` - Environment variables template

### Updated Files:
- `app/analytics/analytics-client.tsx` - Enhanced analytics dashboard
- `app/dashboard/page.tsx` - Real-time data integration

## 🔧 **Setup Instructions**

### 1. Environment Variables
```bash
# Copy the example file
cp .env.example .env.local

# Add your OpenWeatherMap API key
# Get free key from: https://openweathermap.org/api
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

### 2. Database Setup
Ensure your PostgreSQL database is populated with flood data:
```bash
cd backend
node execute-comprehensive-data.js
```

### 3. Start Backend Server
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

### 4. Start Frontend
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

## 📈 **Data Sources**

### Primary Sources:
- **Realistic Indian Flood Data**: 10-year historical patterns
- **State-wise Statistics**: Assam, Bihar, Uttar Pradesh, West Bengal, etc.
- **Monsoon Data**: Seasonal rainfall patterns and extremes

### API Integration:
- **OpenWeatherMap**: Live rainfall data (optional)
- **Fallback Data**: Realistic synthetic data when API unavailable

## 🎯 **Key Metrics Tracked**

### Flood Incidents:
- Total incidents per state (2015-2024)
- Monthly historical patterns
- Severity classification (Low/Medium/High)

### Rainfall Data:
- Annual average rainfall by state
- Monthly rainfall trends
- Correlation with flood incidents

### Risk Assessment:
- Real-time risk scores (0-100)
- Color-coded threat levels
- State-wise risk ranking

## 🚨 **Risk Score Calculation**

### Algorithm:
```javascript
Risk Score = (Incident Risk + Rainfall Risk)
- Incident Risk: (Total Incidents / 500) * 50 (max 50)
- Rainfall Risk: (Current Rainfall / Historical Average) * 50 (max 50)
```

### Thresholds:
- **Critical (75-100)**: Immediate attention required
- **High (50-75)**: Enhanced monitoring needed
- **Moderate (25-50)**: Normal monitoring
- **Low (0-25)**: Routine monitoring

## 🔍 **Analytics Features**

### Correlation Analysis:
- Pearson correlation coefficient
- Automated insight generation
- State-wise relationship mapping

### Historical Trends:
- 10-year flood incident patterns
- Seasonal variations
- Extreme event identification

### Real-Time Monitoring:
- Live dashboard statistics
- Current flood alerts
- Satellite feed status

## 📱 **Responsive Design**

- **Mobile Optimized**: Charts adapt to screen size
- **Touch Friendly**: Interactive elements work on all devices
- **Performance Optimized**: Efficient data loading and rendering

## 🛠️ **Technical Stack**

- **Frontend**: Next.js, TypeScript, Chart.js
- **Backend**: Node.js, Express, PostgreSQL
- **APIs**: OpenWeatherMap (optional)
- **Styling**: Tailwind CSS (preserved original design)

## 🔄 **Data Flow**

1. **Database** → **Backend API** → **Frontend Dashboard**
2. **OpenWeatherMap** → **Risk Calculation** → **Real-time Scores**
3. **Historical Data** → **Analytics Engine** → **Chart Visualization**

## 📞 **Support**

For issues or questions:
1. Check database connection
2. Verify API endpoints are running
3. Ensure environment variables are set
4. Review browser console for errors

---

**Note**: All original UI, layout, and styling have been preserved exactly. Only data, charts, and functionality have been enhanced.
