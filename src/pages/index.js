import Head from 'next/head';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Map from '@components/Map';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss';
import {useState} from "react";
import {useData} from '@hooks/useData';

const DEFAULT_CENTER = {
    lat: 51.48165,
    lng: 7.21648
};

function LanguageButton({name, activeName, flag, setName}){
    return <a onClick={() => setName(name)} className={`${styles.flag} ${activeName === name ? styles.active : styles.inactive}`}>{flag}</a>
}

export default function Home() {
    const [language, setLanguage] = useState("de");
    const [city, setCity] = useState("bochum");
    
    // Use the new dynamic data loading hook
    const {
        cityData,
        loading,
        error,
        availableCities,
        switchCity,
        hasData
    } = useData(city);

    // Calculate center point
    let center = DEFAULT_CENTER;
    if (cityData) {
        center = cityData.viewRoot || DEFAULT_CENTER;
    }

    // Handle city switching
    const handleCityChange = (newCity) => {
        if (newCity !== city) {
            setCity(newCity);
            switchCity(newCity);
        }
    }

    return (
        <Layout>
            <Head>
                <title>Trans.NRW Map</title>
                <meta name="description"
                      content="Find and connect with other transpeople in NRW - this is your guide to trans life hotspots"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <Section>
                <Container>
                    {/* Language selector */}
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <LanguageButton name="de" activeName={language} flag="🇩🇪" setName={setLanguage}/>
                        <LanguageButton name="en" activeName={language} flag="🇬🇧" setName={setLanguage}/>
                    </div>
                    
                    {/* City selector (for future use when multiple cities are available) */}
                    {availableCities.length > 1 && (
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="city-select">Select City: </label>
                            <select 
                                id="city-select" 
                                value={city} 
                                onChange={(e) => handleCityChange(e.target.value)}
                            >
                                {availableCities.map(cityName => (
                                    <option key={cityName} value={cityName}>
                                        {cityName.charAt(0).toUpperCase() + cityName.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                    {/* Loading state */}
                    {loading && (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <p>Loading city data...</p>
                        </div>
                    )}
                    
                    {/* Error state */}
                    {error && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
                            <p>Error loading data: {error}</p>
                            <button onClick={() => window.location.reload()}>
                                Retry
                            </button>
                        </div>
                    )}
                </Container>
                
                {/* Map component - full width */}
                {hasData && cityData && (
                    <div className={styles.mapWrapper}>
                        <Map className={styles.homeMap} center={center} zoom={13}>
                            {({TileLayer, Marker, Popup}) => {
                                const markers = cityData.locations.map(location => (
                                    <Marker key={location.name} position={location.location}>
                                        <Popup>
                                            <div className={styles.popupContent}>
                                                <h3 style={{ 
                                                    margin: '0 0 0.5rem 0', 
                                                    fontSize: '1.2rem',
                                                    fontWeight: 'bold',
                                                    color: '#333'
                                                }}>{location.name}</h3>
                                            {location.metadata?.verified && (
                                                <div style={{ marginBottom: '8px', fontSize: '0.8em', color: '#28a745', fontStyle: 'italic' }}>
                                                    ✓ {language === 'de' ? 'Verifizierter Ort' : 'Verified location'}
                                                </div>
                                            )}
                                            
                                            {/* Address */}
                                            {location.location.address && (
                                                <div style={{ marginBottom: '8px', fontSize: '0.9em', color: '#666' }}>
                                                    <strong>{language === 'de' ? 'Adresse:' : 'Address:'}</strong><br/>
                                                    {location.location.address.street} {location.location.address.number}<br/>
                                                    {location.location.address.postalCode} {language === 'de' && cityData.metadata.cityNameLocalized.de 
                                                        ? cityData.metadata.cityNameLocalized.de 
                                                        : cityData.metadata.cityName}<br/>
                                                    {language === 'de' && cityData.metadata.countryLocalized.de 
                                                        ? cityData.metadata.countryLocalized.de 
                                                        : cityData.metadata.country}
                                                </div>
                                            )}
                                            
                                            <div>{location.description[language] || location.description.en || (language === 'de' ? 'Keine Beschreibung verfügbar' : 'No description available')}</div>

                                            {/* Contact Information */}
                                            {location.metadata?.contact && (
                                                <div style={{ marginTop: '8px', fontSize: '0.9em', color: '#666' }}>
                                                    <strong>{language === 'de' ? 'Kontakt:' : 'Contact:'}</strong><br/>
                                                    {location.metadata.contact.phone && (
                                                        <div>{language === 'de' ? 'Telefon:' : 'Phone:'} {location.metadata.contact.phone}</div>
                                                    )}
                                                    {location.metadata.contact.email && (
                                                        <div>{language === 'de' ? 'E-Mail:' : 'Email:'} <a href={`mailto:${location.metadata.contact.email}`} style={{ color: '#007bff' }}>{location.metadata.contact.email}</a></div>
                                                    )}
                                                    {location.metadata.contact.website && (
                                                        <div>{language === 'de' ? 'Website:' : 'Website:'} <a href={location.metadata.contact.website} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>{location.metadata.contact.website}</a></div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Accessibility Information */}
                                            {location.metadata?.accessibility && (
                                                <div style={{ marginTop: '8px', fontSize: '0.9em', color: '#666' }}>
                                                    <strong>{language === 'de' ? 'Barrierefreiheit:' : 'Accessibility:'}</strong><br/>
                                                    <div>
                                                        {language === 'de' ? 'Rollstuhlgerecht' : 'Wheelchair accessible'}
                                                        {location.metadata.accessibility.wheelchairAccessible === 'unknown' && 
                                                            (language === 'de' ? <>: <strong>unbekannt</strong></> : <>: <strong>unknown</strong></>)}
                                                    </div>
                                                    <div>
                                                        {language === 'de' ? 'Genderneutrale Toiletten' : 'Gender-neutral bathrooms'}
                                                        {location.metadata.accessibility.genderNeutralBathrooms === 'unknown' && 
                                                            (language === 'de' ? <>: <strong>unbekannt</strong></> : <>: <strong>unknown</strong></>)}
                                                    </div>
                                                    <div>
                                                        {language === 'de' ? 'Ruhiger Bereich' : 'Quiet space available'}
                                                        {location.metadata.accessibility.quietSpace === 'unknown' && 
                                                            (language === 'de' ? <>: <strong>unbekannt</strong></> : <>: <strong>unknown</strong></>)}
                                                    </div>
                                                </div>
                                            )}
                                            </div>
                                        </Popup>
                                    </Marker>
                                ));
                                return (<>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                                    />
                                    { markers }
                                </>);
                            }}
                        </Map>
                    </div>
                )}
            </Section>
        </Layout>
    )
}
