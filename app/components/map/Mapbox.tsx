"use client";

import mapboxgl, { LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React from "react";
import Map, { type MapRef, Popup } from "react-map-gl";
// import { LngLat, MapMouseEvent } from "react-map-gl/dist/esm/types";
import { MapMouseEvent } from "react-map-gl/dist/esm/types";
import { statusToHexMap } from "../common/constants";
import CountryDetailedStats from "./Popup";

export function statusToHex(status: number) {
  return statusToHexMap[status];
}

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYW1hbmhjb2RlIiwiYSI6ImNsa3IxODFocDFlb28zam9jMzZoMG00MnUifQ.Kf9903YpG_m0m4D_3lsNLg"; // Set your mapbox token here

type Props = {
  selectedPolicyCountryData: PolicyWithCountryWiseStatus;
  countryWisePolicyData: DashboardWithCountryWisePolicyData[number]["country_wise_policy_data"];
};

export function Mapbox({
  selectedPolicyCountryData,
  countryWisePolicyData,
}: Props) {
  const [country, setCountry] = React.useState("");

  const selectedCountryData = countryWisePolicyData.find(
    (countryWiseData) => countryWiseData.country_code_2_digit === country,
  );

  const mapRef = React.useRef<MapRef>();
  const [showPopup, setShowPopup] = React.useState(false);
  const [clickedLatLng, setClickedLatLng] = React.useState<{
    lng: number;
    lat: number;
  }>({
    lng: 0,
    lat: 0,
  });

  const loadCountryLayer = (map: mapboxgl.MapboxEvent) => {
    map.target?.addSource("countries", {
      type: "vector",
      url: "mapbox://mapbox.country-boundaries-v1",
    });

    const matchExpression = ["match2", ["get", "iso_3166_1_alpha_3"]];

    // Calculate color values for each country based on 'hdi' value
    for (const country of selectedPolicyCountryData.countries_with_policy_status) {
      const [code, hex] = [
        country["country_3_digit"],
        statusToHex(country.policy_status),
      ];
      if (code && hex) {
        matchExpression.push(code, hex);
      }
    }

    // Last value is the default, used where there is no data
    matchExpression.push("rgba(0, 0, 0, 0)");

    const WORLDVIEW = "US";
    const worldview_filter = [
      "all",
      ["==", ["get", "disputed"], "false"],
      [
        "any",
        ["==", "all", ["get", "worldview"]],
        ["in", WORLDVIEW, ["get", "worldview"]],
      ],
    ];
    map.target.addLayer(
      {
        interactive: true,
        id: "countries-join",
        type: "fill",
        // type: 'fill-extrusion',
        source: "countries",
        "source-layer": "country_boundaries",
        paint: {
          "fill-color": [
            "match",
            ["get", "iso_3166_1_alpha_3"],
            ...matchExpression.slice(2),
          ],
        },
        filter: worldview_filter,
      },
      "admin-1-boundary-bg",
    );
  };

  const handleOnClick = (e: MapMouseEvent<mapboxgl.Map>) => {
    console.log("e", e);
    setShowPopup(false);
    setClickedLatLng(e.lngLat);
    setShowPopup(true);
    // @ts-ignore
    const capturedLayers = e.target.queryRenderedFeatures(e.point);

    // Extract Country Name
    // const countryName = capturedLayers[0].properties.name_en;
    const countryName = capturedLayers[0].properties.iso_3166_1;

    setCountry(countryName);
  };

  return (
    <Map
      // @ts-ignore
      projection={"equirectangular"}
      ref={mapRef}
      initialViewState={{
        latitude: 7.544223,
        longitude: 21.551783,
        zoom: 2,
      }}
      maxBounds={[
        [33.163816, -10.154068], // Southwest coordinates (Lat, Lng)
        [-22.902672, 47.776785], // Northeast coordinates
      ]}
      onClick={handleOnClick}
      onLoad={loadCountryLayer}
      style={{ width: "100%", height: "80vh" }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
      minZoom={2}
      maxZoom={5}
    >
      {showPopup && selectedCountryData && (
        <Popup
          style={{ minWidth: "350px" }}
          className="  border border-gray-300 shadow-lg"
          key={clickedLatLng.lng + clickedLatLng.lat}
          closeButton={false}
          longitude={clickedLatLng.lng}
          latitude={clickedLatLng.lat}
          onClose={() => setShowPopup(false)}
        >
          {selectedCountryData && (
            <CountryDetailedStats
              selectedPolicyId={selectedPolicyCountryData.id}
              selectedPolicyName={selectedPolicyCountryData.name}
              countryPolicyData={selectedCountryData}
            />
          )}
        </Popup>
      )}
    </Map>
  );
}

export default Mapbox;
