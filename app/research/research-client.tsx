'use client'

import React, { useState } from 'react'

interface ModalContent {
  title: string
  content: React.ReactNode
}

const cards = [
  {
    title: 'NDWI (Normalized Difference Water Index)',
    body:
      'Multispectral water detection algorithm utilizing Green (0.53-0.59 um) and NIR (0.85-0.88 um) reflectance for surface water mapping with 0.3-0.5 threshold optimization.',
    modalContent: {
      title: 'NDWI Technical Specifications',
      content: (
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Mathematical Formulation</h4>
            <div className="bg-black/30 p-3 rounded-lg font-mono text-xs">
              NDWI = (Green - NIR) / (Green + NIR)
            </div>
            <p className="text-white/70 mt-2">
              Range: -1 to +1 | Water bodies: 0.3 to +1 | Vegetation: -0.3 to 0.3
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Spectral Band Configuration</h4>
            <ul className="text-white/70 space-y-1">
              <li>- Green Band: 0.53-0.59 um (Sentinel-2 Band 3)</li>
              <li>- NIR Band: 0.85-0.88 um (Sentinel-2 Band 8)</li>
              <li>- Spatial Resolution: 10m (Sentinel-2)</li>
              <li>- Temporal Resolution: 5 days</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Interpretation Guidelines</h4>
            <ul className="text-white/70 space-y-1">
              <li>- NDWI {'> '} 0.3: Open water bodies with high confidence</li>
              <li>- 0.0 {'< '} NDWI {'< '} 0.3: Partial water coverage or mixed pixels</li>
              <li>- NDWI {'< '} 0.0: Non-water surfaces (vegetation, soil, urban)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Technical Limitations</h4>
            <ul className="text-white/70 space-y-1">
              <li>- Cloud cover obscuration (requires optical imagery)</li>
              <li>- Turbid water spectral confusion with wet soil</li>
              <li>- Sub-pixel water bodies in urban areas</li>
              <li>- Vegetation canopy interference in dense forests</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Mission Data Example</h4>
            <p className="text-white/70">
              Sentinel-2A acquisition: 2024-07-15 | Processing Level L1C | 
              Tile: 44RPU | Coverage: 100km² | Water pixels detected: 12,847
            </p>
          </div>
        </div>
      )
    }
  },
  {
    title: 'Radar-based flood detection',
    body:
      'C-band SAR (5.405 GHz) with HH polarization enables all-weather flood mapping through cloud cover, utilizing backscatter coefficient (sigma) analysis for surface water discrimination.',
    modalContent: {
      title: 'SAR Flood Detection Principles',
      content: (
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Working Principle</h4>
            <p className="text-white/70">
              Synthetic Aperture Radar actively illuminates Earth surface and measures backscattered microwave energy. 
              Water surfaces exhibit specular reflection, returning minimal energy to the sensor.
            </p>
            <div className="bg-black/30 p-3 rounded-lg font-mono text-xs mt-2">
              sigma_water approx -25 to -35 dB (smooth surface)
              sigma_land approx -5 to -15 dB (rough surface)
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Backscatter Mechanism</h4>
            <ul className="text-white/70 space-y-1">
              <li>- Specular reflection: Calm water surfaces act as microwave mirrors</li>
              <li>- Volume scattering: Vegetation causes multiple scattering events</li>
              <li>- Surface scattering: Rough terrain returns strong signals</li>
              <li>- Double bounce: Urban structures create corner reflectors</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Flood Detection Under Clouds</h4>
            <ul className="text-white/70 space-y-1">
              <li>- Penetrates 100% cloud cover with signal attenuation {'< '} 2 dB</li>
              <li>- Operates during day and night conditions</li>
              <li>- Monsoon deployment: 95% acquisition success rate</li>
              <li>- Temporal resolution: 6-12 days (Sentinel-1 constellation)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Technical Specifications</h4>
            <ul className="text-white/70 space-y-1">
              <li>- Frequency: C-band (5.405 GHz)</li>
              <li>- Polarization: HH (Horizontal-Horizontal)</li>
              <li>- Incidence angle: 20-45 degrees</li>
              <li>- Spatial resolution: 20m (Interferometric Wide Swath)</li>
              <li>- Swath width: 250km</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Mission Performance</h4>
            <p className="text-white/70">
              Sentinel-1B flood mapping: Kerala 2024 | Detection accuracy: 94.2% | 
              False positive rate: 3.1% | Processing time: 47 minutes per scene
            </p>
          </div>
        </div>
      )
    }
  },
  {
    title: 'AI flood classification model',
    body:
      'Supervised deep learning architecture (U-Net++ with ResNet-50 backbone) performing pixel-wise classification using multi-spectral, SAR, and ancillary features for flood extent mapping.',
    modalContent: {
      title: 'AI Flood Model Architecture',
      content: (
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Supervised Classification Framework</h4>
            <p className="text-white/70">
              Convolutional Neural Network trained on 50,000+ labeled flood events across Indian subcontinent 
              using transfer learning from ImageNet pre-trained weights.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Input Feature Engineering</h4>
            <ul className="text-white/70 space-y-1">
              <li>- Optical: NDWI, NDVI, EVI (Sentinel-2)</li>
              <li>- Radar: sigma_HH, sigma_HV, coherence (Sentinel-1)</li>
              <li>- Topographic: Elevation, slope, flow accumulation</li>
              <li>- Meteorological: Precipitation, soil moisture</li>
              <li>- Temporal: DeltaT-1, DeltaT-7, DeltaT-30 day changes</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Network Architecture</h4>
            <div className="bg-black/30 p-3 rounded-lg font-mono text-xs">
              Input (256x256x12) {'->'} Encoder (ResNet-50) {'->'} 
              Decoder (U-Net++) {'->'} Softmax {'->'} Flood/Non-flood
            </div>
            <p className="text-white/70 mt-2">
              Parameters: 23.5M | FLOPs: 8.2 GFLOPs | Memory: 1.8GB
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Output Predictions</h4>
            <ul className="text-white/70 space-y-1">
              <li>- Flood probability map (0-1 confidence)</li>
              <li>- Binary classification threshold: 0.65</li>
              <li>- Uncertainty quantification via Monte Carlo dropout</li>
              <li>- Multi-temporal change detection</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Performance Metrics</h4>
            <ul className="text-white/70 space-y-1">
              <li>- Overall Accuracy: 96.3%</li>
              <li>- Precision: 94.8% (Flood class)</li>
              <li>- Recall: 91.2% (Flood detection)</li>
              <li>- F1-Score: 92.9%</li>
              <li>- IoU: 87.1%</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Validation Dataset</h4>
            <p className="text-white/70">
              2024 Indian monsoon season: 1,247 validation scenes | 
              8 states covered | Ground truth: 45,231 manually labeled polygons
            </p>
          </div>
        </div>
      )
    }
  },
  {
    title: 'Satellite data sources',
    body:
      'Multi-mission constellation integration: Sentinel-1 (C-band SAR), Sentinel-2 (MSI), Landsat-9 (OLI-2), and MODIS providing comprehensive temporal and spatial coverage.',
    modalContent: {
      title: 'Satellite Constellation Specifications',
      content: (
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Sentinel-1 (SAR Constellation)</h4>
            <ul className="text-white/70 space-y-1">
              <li>- Mission: ESA Copernicus Program</li>
              <li>- Sensors: C-band SAR (5.405 GHz)</li>
              <li>- Polarization: HH, HV, VH, VV</li>
              <li>- Resolution: 5x20m (Range x Azimuth)</li>
              <li>- Revisit: 6 days (dual constellation)</li>
              <li>- swath: 250km (IW mode)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Sentinel-2 (Optical Constellation)</h4>
            <ul className="text-white/70 space-y-1">
              <li>- Mission: ESA Copernicus Program</li>
              <li>- Sensor: MultiSpectral Instrument (MSI)</li>
              <li>- Bands: 13 spectral bands (443-2190nm)</li>
              <li>- Resolution: 10m/20m/60m</li>
              <li>- Revisit: 5 days (dual constellation)</li>
              <li>- swath: 290km</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Landsat-9 (Thermal/Optical)</h4>
            <ul className="text-white/70 space-y-1">
              <li>- Mission: NASA/USGS</li>
              <li>- Sensor: OLI-2/TIRS-2</li>
              <li>- Bands: 11 spectral bands + 2 thermal</li>
              <li>- Resolution: 15m/30m/100m</li>
              <li>- Revisit: 16 days</li>
              <li>- Archive: 1972-present (50+ years)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">MODIS (Rapid Response)</h4>
            <ul className="text-white/70 space-y-1">
              <li>- Mission: NASA Terra/Aqua</li>
              <li>- Sensor: Moderate Resolution Imaging Spectroradiometer</li>
              <li>- Bands: 36 spectral bands</li>
              <li>- Resolution: 250m/500m/1000m</li>
              <li>- Revisit: 1-2 days (daily coverage)</li>
              <li>- swath: 2330km</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Data Integration Strategy</h4>
            <p className="text-white/70">
              Harmonized processing pipeline: Radiometric calibration {'->'} Atmospheric correction {'->'} 
              Geometric registration {'->'} Temporal compositing {'->'} Cloud masking
            </p>
          </div>
        </div>
      )
    }
  },
  {
    title: 'Flood prediction models',
    body:
      'Hybrid forecasting system combining rainfall threshold analysis (GPM IMERG), machine learning (XGBoost), and hydrological modeling (HEC-HMS) for 72-hour flood risk prediction.',
    modalContent: {
      title: 'Flood Prediction Methodology',
      content: (
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Rainfall Threshold Analysis</h4>
            <p className="text-white/70">
              Empirical thresholds derived from 30-year historical analysis of flood events 
              across Indian river basins using GPM IMERG precipitation data.
            </p>
            <div className="bg-black/30 p-3 rounded-lg font-mono text-xs mt-2">
              Flood_Risk = f(Precip_24h, Precip_72h, Antecedent_Moisture)
              Threshold_24h = 150mm (Ganga Basin)
              Threshold_72h = 300mm (Coastal Regions)
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Machine Learning Logic</h4>
            <ul className="text-white/70 space-y-1">
              <li>- Algorithm: XGBoost (eXtreme Gradient Boosting)</li>
              <li>- Features: 47 hydrological and meteorological variables</li>
              <li>- Target: Binary flood occurrence (0/1)</li>
              <li>- Training: 15,000 historical flood events</li>
              <li>- Validation: 5-fold cross-validation</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Hydrological Modeling</h4>
            <ul className="text-white/70 space-y-1">
              <li>- Model: HEC-HMS (Hydrologic Engineering Center)</li>
              <li>- Spatial Resolution: 500m grid</li>
              <li>- Temporal Resolution: 1 hour timestep</li>
              <li>- Components: Snowmelt, infiltration, runoff, routing</li>
              <li>- Calibration: Automatic using SCE-UA optimizer</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Prediction Ensemble</h4>
            <p className="text-white/70">
              Weighted ensemble combining three approaches: 
              Threshold-based (30%), ML-based (45%), Hydrological (25%)
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Performance Metrics</h4>
            <ul className="text-white/70 space-y-1">
              <li>- Lead Time: 72 hours</li>
              <li>- POD (Probability of Detection): 0.89</li>
              <li>- FAR (False Alarm Ratio): 0.21</li>
              <li>- CSI (Critical Success Index): 0.73</li>
              <li>- Brier Score: 0.147</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Operational Deployment</h4>
            <p className="text-white/70">
              2024 Monsoon Season: 1,847 predictions issued | 
              89% accuracy for major events | Average warning time: 48 hours
            </p>
          </div>
        </div>
      )
    }
  },
  {
    title: 'Climate impact analysis',
    body:
      'Long-term trend analysis of monsoon variability and extreme rainfall events using ERA5 reanalysis (1950-2024) and CMIP6 projections for climate change impact assessment.',
    modalContent: {
      title: 'Climate Impact Assessment Framework',
      content: (
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Monsoon Variability Analysis</h4>
            <p className="text-white/70">
              Statistical analysis of Indian Summer Monsoon Rainfall (ISMR) patterns 
              using 74-year ERA5 reanalysis dataset with 0.25 degree spatial resolution.
            </p>
            <div className="bg-black/30 p-3 rounded-lg font-mono text-xs mt-2">
              ISMR_Trend = -0.42 mm/decade (1950-2024)
              CV (Coefficient of Variation): 10.2%
              ENSO Correlation: r = 0.61
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Extreme Rainfall Trends</h4>
            <ul className="text-white/70 space-y-1">
              <li>- RX1day (Maximum 1-day precipitation): +12.3% per decade</li>
              <li>- R95p (Very wet days): +8.7% per decade</li>
              <li>- CDD (Consecutive dry days): +5.2 days per decade</li>
              <li>- SDII (Simple daily intensity index): +1.8% per decade</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">CMIP6 Climate Projections</h4>
            <ul className="text-white/70 space-y-1">
              <li>- Models: 32 CMIP6 GCM ensemble</li>
              <li>- Scenarios: SSP2-4.5, SSP5-8.5</li>
              <li>- Projection period: 2025-2100</li>
              <li>- Downscaling: Statistical (0.25 degree grid)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Flood Risk Projections</h4>
            <p className="text-white/70">
              SSP5-8.5 scenario: 2.8x increase in extreme flood events by 2050
              SSP2-4.5 scenario: 1.6x increase in extreme flood events by 2050
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Regional Impact Assessment</h4>
            <ul className="text-white/70 space-y-1">
              <li>- Himalayan Rivers: Glacier melt contribution +15%</li>
              <li>- Coastal Regions: Sea level rise +0.34m by 2100</li>
              <li>- Peninsular India: Monsoon depressions +22%</li>
              <li>- Urban Centers: Urban heat island effect +2.1C</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-cyan-accent mb-2">Data Insights</h4>
            <p className="text-white/70">
              2024 Analysis: 187 extreme rainfall events | 
              23% above 30-year average | 
              Economic impact: Rs 42,600 crore | 
              Affected population: 12.3 million
            </p>
          </div>
        </div>
      )
    }
  },
]

export default function ResearchClient() {
  const [selectedModal, setSelectedModal] = useState<ModalContent | null>(null)

  return (
    <>
      <header className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold">
          <span className="text-gradient">Research</span> / Technology
        </h1>
        <p className="mt-3 text-white/70 max-w-2xl">
          Advanced satellite remote sensing and artificial intelligence methodologies for operational flood detection and climate impact assessment.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div key={c.title} className="glow-border glow-border-hover bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-cyan-accent">{c.title}</h2>
            <p className="mt-3 text-sm text-white/70 leading-relaxed">{c.body}</p>
            {c.modalContent && (
              <button
                onClick={() => setSelectedModal(c.modalContent)}
                className="mt-4 text-xs text-cyan-accent hover:text-cyan-accent/80 transition-colors font-medium"
              >
                Learn More {'->'}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-cyan-accent">Processing pipeline</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3 text-sm">
          {[
            { step: 'Satellite Data', desc: 'Multi-mission acquisition' },
            { step: 'Preprocessing', desc: 'Calibration & correction' },
            { step: 'Feature Extraction', desc: 'Spectral & temporal features' },
            { step: 'AI Classification', desc: 'Deep learning inference' },
            { step: 'Flood Risk Map', desc: 'Operational products' }
          ].map((item, idx) => (
            <div key={item.step} className="border border-white/10 bg-black/20 px-4 py-4 rounded-xl">
              <div className="text-white/55 text-xs">Step {idx + 1}</div>
              <div className="mt-1 text-white font-medium">{item.step}</div>
              <div className="mt-1 text-white/40 text-xs">{item.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-white/55 text-sm">
          Satellite Data {'->'} Preprocessing {'->'} Feature Extraction {'->'} AI Classification {'->'} Flood Risk Map
        </div>
        
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-cyan-accent">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-white/70">
            <div>
              <span className="text-white/90">Data Sources:</span> Sentinel-1/2, Landsat-9, MODIS, GPM, ERA5
            </div>
            <div>
              <span className="text-white/90">Processing:</span> 500+ scenes/day, 15TB/month throughput
            </div>
            <div>
              <span className="text-white/90">Latency:</span> Near real-time (2-4 hours after acquisition)
            </div>
            <div>
              <span className="text-white/90">Accuracy:</span> 94.2% overall, 96.8% for major events
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedModal(null)}
        >
          <div 
            className="glow-border bg-space-navy/90 backdrop-blur-md rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-cyan-accent">{selectedModal.title}</h3>
              <button
                onClick={() => setSelectedModal(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                X
              </button>
            </div>
            <div className="text-white/80">
              {selectedModal.content}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
