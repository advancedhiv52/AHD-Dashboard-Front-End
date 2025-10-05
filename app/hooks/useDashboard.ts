import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL, QUERY_CACHE_TIME } from "../components/common/constants";

const fetchDashboardDetails = async ({
  slug,
  year,
}: {
  slug: string;
  year?: number;
}) =>
  axios
    .get(
      API_BASE_URL + `dashboards/?name=${slug}${year ? `&year=${year}` : ""}`,
    )
    .then((res) => res.data) as Promise<
    Array<DashboardWithPolicyWiseCountryData>
  >;

const useDashboardDetails = ({
  dashboardSlug,
  year,
}: {
  dashboardSlug: string;
  year?: number;
}) =>
  useQuery({
    queryKey: ["policyWiseDashboardData", dashboardSlug, year],
    queryFn: () => fetchDashboardDetails({ slug: dashboardSlug, year }),
    staleTime: QUERY_CACHE_TIME,
    retry: 1,
  });

// const {
//     data: dashboardData,
//     isLoading,
//     isError: isCurrentDashboardAPIError,
//   } = useQuery({
//     queryKey: ["policyWiseDashboardData", dashboardName],
//     queryFn: () =>
//       axios
//         .get(API_BASE_URL + `/dashboards/?name=${dashboardName}`)
//         .then((res) => res.data) as Promise<
//         Array<DashboardWithPolicyWiseCountryData>
//       >,
//     staleTime: QUERY_CACHE_TIME,
//     retry: 1,
//   });

export { useDashboardDetails };
