import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import PolicyDetails from "./PolicyPage";
import DashboardSkelton from "./common/DashboardSkelton";
import { API_BASE_URL, QUERY_CACHE_TIME } from "./common/constants";

type Props = {};

function FirstPolicyInDashboard({}: Props) {
  // TODO: Remove use query,
  const allDashboardsQuery = useQuery({
    queryKey: ["dashboards"],
    queryFn: () => axios.get(API_BASE_URL + "dashboards"),
    // 10 minutes in milliseconds
    staleTime: QUERY_CACHE_TIME,
  });

  const searchParams = useSearchParams();

  const dashboardNameFromUrl = searchParams.get("name");

  const dashboardToRender = useMemo(
    () =>
      dashboardNameFromUrl
        ? { name: dashboardNameFromUrl }
        : (allDashboardsQuery?.data?.data[0] as { name: string }),
    [allDashboardsQuery, dashboardNameFromUrl],
  );

  useEffect(() => {
    if (document && dashboardToRender) {
      document.title = dashboardToRender?.name;
    }
  }, [dashboardToRender]);

  if (allDashboardsQuery?.isLoading || !dashboardToRender)
    return <DashboardSkelton />;

  return <PolicyDetails dashboardName={dashboardToRender.name} />;
}

export default FirstPolicyInDashboard;
