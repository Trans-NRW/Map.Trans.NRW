import Head from 'next/head';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Map from '@components/Map';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss';
import {useState} from "react";

const DEFAULT_CENTER = {
    lat: 51.48165,
    lng: 7.21648
};

function LanguageButton({name, activeName, flag, setName}){
    return <a onClick={() => setName(name)} className={activeName === name ? "flag active" : "flag inactive"} >{flag}</a>
}

export default function Home() {
    const [city, setCity] = useState("bochum");
    const [language, setLanguage] = useState("de");
    const [locations, setLocations] = useState();
    let center = DEFAULT_CENTER;

    if (locations) {
        center = locations.viewRoot || DEFAULT_CENTER;
    }

    if (!locations || locations.label !== city) {
        let path = "/" + city + ".json";
        fetch(path).then(r => r.json().then(setLocations)).catch(reject => console.error("Error fetching data: ", path, reject));
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
                    <LanguageButton name="de" activeName={language} flag="🇩🇪" setName={setLanguage}/>
                    <LanguageButton name="en" activeName={language} flag="🇬🇧" setName={setLanguage}/>
                    <Map className={styles.homeMap} width="800" height="400" center={center} zoom={13}>
                        {({TileLayer, Marker, Popup}) => {
                            const markers = locations.locations.map(location =>  (<Marker key={location.name} position={location.location}>
                                    <Popup>
                                        <h3>{location.name}</h3>
                                        <div>{location.description[language]}</div>
                                    </Popup>
                                </Marker>)
                            );
                            return (<>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                                />
                                { markers }
                            </>);
                        }}
                    </Map>
                </Container>
            </Section>
        </Layout>
    )
}
