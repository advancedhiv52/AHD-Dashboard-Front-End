import React from "react";
import { PolicyStatus } from "../common/constants";
import { statusToHex } from "./Mapbox";
import ReactCountryFlag from "react-country-flag";

function captialized(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const detailJSON = {
  country: "Muritania",
  // TODO: To decide how to store country flags.
  country_flag: "",
  // TODO: Change status.
  adoption: "Few",
  category: "Testing and Prevention",
  question: "How many testing and prevention policies have been adopted?",
  options: [
    { label: "Adopted", value: 0, hex: "#3A79A2" },
    { label: "Partial", value: 2, hex: "#FAE595" },
    { label: "Not adopted", value: 3, hex: "#F68D3F" },
    { label: "Data not available yet.", value: 5, hex: "#838383" },
  ],
};

export const options = {
  indexAxis: "y" as const,
  font: {},
  responsive: true,
};

function getBarWidth(value, policyCount) {
  return (value * 100) / policyCount;
}

function calculatePolicyDisplayStatsByName(
  policyList: DashboardWithCountryWisePolicyData[number]["country_wise_policy_data"][number]["policies"],
): Record<keyof typeof PolicyStatus, number> {
  const optionsObj = {};
  Object.keys(PolicyStatus).forEach((statusName) => {
    optionsObj[statusName] = 0;
  });

  policyList.forEach((policy) => {
    const currentCount = optionsObj[policy.policy_status_display];
    if (typeof currentCount === "number")
      optionsObj[policy.policy_status_display] = currentCount + 1;
  });

  return optionsObj as Record<keyof typeof PolicyStatus, number>;
}
function calculateSubPolicyDisplayStatsByName(
  subPolicyList: DashboardWithCountryWisePolicyData[number]["country_wise_policy_data"][number]["policies"][number]["sub_policies"],
): Record<keyof typeof PolicyStatus, number> {
  const optionsObj = {};
  Object.keys(PolicyStatus).forEach((statusName) => {
    optionsObj[statusName] = 0;
  });

  subPolicyList.forEach((policy) => {
    const currentCount = optionsObj[policy.policy_status_display];
    if (typeof currentCount === "number")
      optionsObj[policy.policy_status_display] = currentCount + 1;
  });

  return optionsObj as Record<keyof typeof PolicyStatus, number>;
}

function CountryDetailedStats({
  selectedPolicyId,
  countryPolicyData,
  selectedPolicyName,
}: {
  selectedPolicyId: number;
  selectedPolicyName: string;
  countryPolicyData: DashboardWithCountryWisePolicyData[number]["country_wise_policy_data"][number];
}) {
  const policesStatusCount = calculatePolicyDisplayStatsByName(
    countryPolicyData.policies,
  );

  const selectedPolicyData = countryPolicyData.policies.find(
    ({ name }) => name === selectedPolicyName,
  );
  const subPoliciesStatusCountForSelectedPolicy =
    calculateSubPolicyDisplayStatsByName(selectedPolicyData.sub_policies);

  const doesSelectedPolicyHaveSubPolicies =
    selectedPolicyData.sub_policies?.length;
  const dataToDisplay = doesSelectedPolicyHaveSubPolicies
    ? subPoliciesStatusCountForSelectedPolicy
    : policesStatusCount;

  return (
    <div className="-mx-2.5 -my-2.5 h-full gap-y-2  ">
      <div className="flex h-full  justify-between space-x-10 bg-gray-100 p-4">
        {/* <span className="flex  justify-between"> */}
        <span className="text-xl font-medium ">
          {countryPolicyData.country}
        </span>
        <ReactCountryFlag
          countryCode={countryPolicyData.country_code_2_digit}
          svg
          style={{ fontSize: "2em" }}
        />
        {/* </span> */}
        {/* <span className="flex flex-col">
          <span>{detailJSON.category}</span>
        </span> */}
      </div>

      {/* Data Section */}
      <div className="mx-5 my-2">
        <div className={`mt-6 items-center  pr-3 ${"space-y-5"}`}>
          {Object.keys(dataToDisplay).map((op, idx) => {
            const barWidth = getBarWidth(
              Number(dataToDisplay[op]),
              doesSelectedPolicyHaveSubPolicies
                ? selectedPolicyData.sub_policies.length
                : countryPolicyData.policies.length,
            );
            return (
              <div key={op} className="flex w-full items-center  gap-x-2">
                <span className="w-1/6 text-right text-xs font-medium text-grey">
                  {captialized(op)}
                </span>
                <span className="relative flex h-8 w-5/6 items-center  rounded-lg">
                  <span className="absolute h-8 w-full rounded-lg bg-gray-200" />
                  <span
                    style={{
                      width: barWidth + "%",
                      backgroundColor: statusToHex(idx),
                    }}
                    className="z-10  h-full rounded-lg"
                  />
                  <span
                    style={{
                      left: barWidth + "%",
                    }}
                    className={`absolute  z-10 ml-2 font-bold`}
                  >
                    {dataToDisplay[op]}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CountryDetailedStats;
