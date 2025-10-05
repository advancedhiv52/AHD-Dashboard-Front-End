"use client";

import ReactCountryFlag from "react-country-flag";
import { statusToHex } from "../map/Mapbox";

const PolicyTable = ({
  policyData,
}: {
  policyData: DashboardWithCountryWisePolicyData[number]["country_wise_policy_data"];
}) => {
  const policyNames = Array.from(
    new Set(
      policyData.flatMap((country) =>
        country.policies.map((policy) => policy.name),
      ),
    ),
  );

  return (
    <table className="mt-40 w-full bg-white">
      <thead className="relative">
        <tr className=" border-b font-bold">
          <th className=" z-10 h-12 pl-3 pr-4  text-right ">Country</th>
          {policyNames.map((policyName, idx) => (
            <th
              key={policyName + idx}
              className="  min-w-[100px] origin-top-left rotate-[-60deg]   border-b border-l  p-0  text-start text-sm"
            >
              <span
                className=" absolute left-0 right-5 top-0 min-w-[200px] border-t  pt-4   "
                title={policyName}
              >
                {policyName}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {policyData.map((countryWithPolicies, idx) => (
          <tr
            className="opacity-100"
            key={countryWithPolicies.country_code_3_digit + idx}
          >
            <td className=" z-10 max-w-[180px] px-4 py-2 font-medium ">
              <div className="flex w-full items-center  justify-end gap-2 text-right ">
                {countryWithPolicies.country}
                <ReactCountryFlag
                  countryCode={countryWithPolicies.country_code_2_digit}
                  svg
                />
              </div>
            </td>
            {countryWithPolicies.policies.map(({ policy_status, name }) => (
              <td
                key={name}
                className="max-w-[50px] border-l  px-4 py-2 text-xs "
              >
                <div
                  className="mx-auto aspect-square w-4 rounded-full"
                  style={{
                    backgroundColor: statusToHex(policy_status),
                  }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default PolicyTable;
