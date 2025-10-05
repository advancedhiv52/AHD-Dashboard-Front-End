"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  API_BASE_URL,
  BE_BASE_URL,
  BE_BASE_URL_1,
  LEGEND_STATUS_COLOR_MAP,
  QUERY_CACHE_TIME,
} from "./common/constants";
import Mapbox from "./map/Mapbox";
import PolicyScroller from "./map/PolicyScroller";
import PolicyTable from "./table/PolicyTable";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDashboardDetails } from "../hooks/useDashboard";
import SkeltonLoader from "./common/SkeltonLoader";
import SelectYearDropdown from "./map/SelectYearDropdown";

const CenterAlignedWrapper = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="grid h-[calc(100vh-160px)] place-items-center">
      {children}
    </div>
  );
};

function PolicyPage({ dashboardName }) {
  const [selectedPolicyId, setSelectedPolicyId] = useState<number>();
  const [showLoadingMap, setShowLoadingMap] = useState(false);

  const [selectedYearForPolicyData, setSelectedYearForPolicyData] = useState<
    number | undefined
  >();

  const {
    data: dashboardDetailsWithPolicyWiseDataForCountries,
    isLoading,
    isError: isCurrentDashboardAPIError,
  } = useDashboardDetails({
    dashboardSlug: dashboardName,
    year: selectedYearForPolicyData,
  });

  const {
    policyWiseCountryDashboardDataWithMeta,
    policyWiseCountryDataDashboard,
  } = useMemo(
    () => ({
      policyWiseCountryDashboardDataWithMeta:
        dashboardDetailsWithPolicyWiseDataForCountries?.[0],
      policyWiseCountryDataDashboard:
        dashboardDetailsWithPolicyWiseDataForCountries?.[0]
          ?.policy_wise_countries_data ?? [],
    }),
    [dashboardDetailsWithPolicyWiseDataForCountries],
  );

  const policiesToShowInMapScroller = policyWiseCountryDataDashboard?.map(
    (policy) => ({
      id: policy.id,
      description: policy.description,
      name: policy.name,
    }),
  );

  // Used for map to highlight the countries.
  const selectedPolicyCountryData = policyWiseCountryDataDashboard?.find(
    (policyData) => policyData.id === selectedPolicyId,
  );

  useEffect(() => {
    if (policyWiseCountryDataDashboard?.length && !selectedPolicyId) {
      setSelectedPolicyId(policyWiseCountryDataDashboard?.[0].id);
    }
  }, [policyWiseCountryDataDashboard, selectedPolicyId]);

  const {
    data: countryWisePolicyDataForDashboard,
    isLoading: isLoadingCountryWiseData,
  } = useQuery({
    queryKey: ["countryWisePolicyData", dashboardName],
    queryFn: () =>
      axios
        .get(
          API_BASE_URL +
            `dashboards-countries-wise/?dashboard_name=${dashboardName}`,
        )
        .then((res) => res.data) as Promise<DashboardWithCountryWisePolicyData>,
    staleTime: QUERY_CACHE_TIME,
    enabled: !isCurrentDashboardAPIError,
  });
  // Used for table data and map.
  const countryWisePolicyData =
    countryWisePolicyDataForDashboard?.[0]?.country_wise_policy_data;

  const yearDropDownOptionsFromCountryWisePolicyData = // unique year list
    Array.from(
      (countryWisePolicyData ?? [])?.reduce((acc, curr) => {
        curr.policies.forEach((policy) => {
          acc.add(policy.year);
        });
        return acc;
      }, new Set<number>()),
    );

  useEffect(() => {
    if (!selectedYearForPolicyData) {
      // Set the latest year as selected year.
      const sortedYears = yearDropDownOptionsFromCountryWisePolicyData.sort(
        (a, b) => b - a,
      );
      if (sortedYears.length) {
        setSelectedYearForPolicyData(sortedYears[0]);
      }
    }
  }, [selectedYearForPolicyData, yearDropDownOptionsFromCountryWisePolicyData]);

  const filteredCountryWiseDataBasedOnSelectedYear = selectedYearForPolicyData
    ? countryWisePolicyData?.reduce((acc, curr) => {
        if (!selectedYearForPolicyData) {
          return acc;
        }
        acc.push({
          ...curr,
          policies: curr.policies.map((policy) => {
            return {
              ...policy,
              ...(policy.year !== selectedYearForPolicyData
                ? {
                    policy_status: "NA",
                    policy_status_display: "NA",
                  }
                : {}),
            };
          }),
        });
        return acc;
      }, [])
    : countryWisePolicyData;

  useEffect(() => {
    if (document && policyWiseCountryDashboardDataWithMeta) {
      document.title = policyWiseCountryDashboardDataWithMeta?.name;
    }
  }, [policyWiseCountryDashboardDataWithMeta]);

  useEffect(() => {
    setShowLoadingMap(true);
    setTimeout(() => {
      setShowLoadingMap(false);
    }, 200);
  }, [selectedPolicyId, selectedYearForPolicyData]);

  const handleChangeSelectedYearForPolicyData = (year: number) => {
    setSelectedYearForPolicyData(year);
  };

  if (isLoading || isLoadingCountryWiseData) return <SkeltonLoader />;

  if (isCurrentDashboardAPIError)
    return <CenterAlignedWrapper>Something went wrong</CenterAlignedWrapper>;

  if (!policyWiseCountryDashboardDataWithMeta)
    return (
      <CenterAlignedWrapper>No data found for dashboard.</CenterAlignedWrapper>
    );

  if (!policyWiseCountryDataDashboard?.length)
    return (
      <CenterAlignedWrapper>
        No attached policies in this dashboard.
      </CenterAlignedWrapper>
    );

  return (
    <div className="mx-auto mt-16 max-w-7xl  px-2 lg:px-6">
      <h1 className="text-3xl font-extrabold  text-[#333333]">
        {policyWiseCountryDashboardDataWithMeta.name}
      </h1>

      <CodebookSection
        link={policyWiseCountryDashboardDataWithMeta?.codebook_file}
        name={policyWiseCountryDashboardDataWithMeta?.codebook_name}
        description={policyWiseCountryDashboardDataWithMeta.description}
        extraInfo={policyWiseCountryDashboardDataWithMeta.extra_info}
        policyBrief={
          policyWiseCountryDashboardDataWithMeta.policy_brief_description
        }
        policyBriefFileLink={
          policyWiseCountryDashboardDataWithMeta.policy_brief_file
        }
        codebookFileDescription={
          policyWiseCountryDashboardDataWithMeta.codebook_file_description
        }
        codebookFileLink={policyWiseCountryDashboardDataWithMeta.codebook_file}
      />

      {/* Maps */}
      <section className="my-10 space-y-4 border-t-4 border-primary pt-10">
        <div className="flex justify-between gap-x-12">
          <div className="flex flex-1 flex-col lg:w-2/3">
            <h2 className="my-1 text-3xl font-extrabold text-primary">
              {policyWiseCountryDashboardDataWithMeta.map_title ||
                "No Map title found for map_title"}
            </h2>
            <p className="mt-2 w-full text-lg  ">
              {policyWiseCountryDashboardDataWithMeta.map_paragraph ||
                `Default Text map_paragraph not found.`}
            </p>
          </div>

          <div className="">
            {/* Dropdown for year */}
            <SelectYearDropdown
              dropdownLabel="Select Year"
              placeholder="Select Year"
              ariaLabel="Select Year"
              options={yearDropDownOptionsFromCountryWisePolicyData}
              currentValue={selectedYearForPolicyData}
              onChange={handleChangeSelectedYearForPolicyData}
            />
          </div>
        </div>
        <div>
          <PolicyScroller
            selectedPolicyId={selectedPolicyId}
            setSelectedPolicyId={setSelectedPolicyId}
            policies={policiesToShowInMapScroller}
          />
          {showLoadingMap ? (
            <div
              style={{
                width: "100%",
                height: "80vh",
                backgroundColor: "#DBDBDC",
              }}
            />
          ) : (
            <Mapbox
              // Used for popup data.
              countryWisePolicyData={filteredCountryWiseDataBasedOnSelectedYear}
              // Used to show map colors based on the policy.
              selectedPolicyCountryData={selectedPolicyCountryData}
            />
          )}
        </div>

        {/* Legend */}
        <div className="mx-auto  flex w-full flex-col justify-between bg-neutral-100 px-8 py-3 lg:w-5/6 lg:flex-row ">
          <p className="font-bold text-primary-light">Adoption Status</p>
          <div className="flex flex-col flex-wrap items-start space-y-2 lg:flex-row  lg:items-center lg:space-x-6  lg:space-y-0  ">
            {Object.keys(LEGEND_STATUS_COLOR_MAP).map((legendKey) => (
              <div key={legendKey} className="flex items-center space-x-2">
                <div
                  style={{
                    backgroundColor: LEGEND_STATUS_COLOR_MAP[legendKey].hex,
                  }}
                  className=" inline aspect-square w-5 border "
                />
                <p className="text-xs font-medium text-black">{legendKey}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="my-8 border-t-4 border-primary">
        <h2 className="mt-6 text-3xl font-extrabold leading-9 text-primary">
          {policyWiseCountryDashboardDataWithMeta.table_title || "NA"}
        </h2>
        <p className="mt-2 w-full text-lg lg:w-2/3 ">
          {policyWiseCountryDashboardDataWithMeta.table_paragraph ||
            `NA table paragraph`}
        </p>
        <div className=" w-full overflow-x-scroll ">
          <PolicyTable
            policyData={filteredCountryWiseDataBasedOnSelectedYear}
          />
        </div>
      </section>
    </div>
  );
}

export default PolicyPage;

const codeBookText =
  "A full list of scoring criteria and methodology for each policy is available from the AHD codebook  ";

// pop last /

const CodebookSection = ({
  name,
  link,
  description,
  extraInfo,
  policyBrief,
  policyBriefFileLink,
  codebookFileDescription,
  codebookFileLink,
}: {
  name?: string;
  link?: string;
  description: string;
  extraInfo?: Array<{
    extra_info?: string;
  }>;
  policyBrief?: string | null;
  policyBriefFileLink?: string | null;
  codebookFileDescription?: string | null;
  codebookFileLink?: string | null;
}) => {
  return (
    <>
      <section>
        <div className="mt-2 border-t-4 border-primary">
          <div
            dangerouslySetInnerHTML={{ __html: description }}
            className=" bg-[#E6F0F7] px-4 py-8 "
          />
        </div>

        {(extraInfo || [])?.map(({ extra_info }) => (
          <div
            key={extra_info}
            dangerouslySetInnerHTML={{ __html: extra_info }}
            className="text-md mb-3 mt-4  bg-blue-100 px-4 py-4 font-medium text-black "
          />
        ))}
      </section>
      <section>
        <div className="mt-2  bg-[#E6F0F7] px-4 py-8">
          <div dangerouslySetInnerHTML={{ __html: policyBrief }} />
          <p>
            The Issue Brief can be found{" "}
            <a
              href={
                link.includes(BE_BASE_URL)
                  ? policyBriefFileLink
                  : BE_BASE_URL_1 + policyBriefFileLink
              }
              target="_blank"
              className="cursor-pointer text-primary underline"
            >
              here.
            </a>
          </p>

          <div className="mt-2 ">
            <div
              dangerouslySetInnerHTML={{ __html: codebookFileDescription }}
            />
            <p>
              Download the complete methodology{" "}
              <a
                href={
                  link.includes(BE_BASE_URL)
                    ? codebookFileLink
                    : BE_BASE_URL_1 + codebookFileLink
                }
                target="_blank"
                className="cursor-pointer text-primary underline"
              >
                here
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
