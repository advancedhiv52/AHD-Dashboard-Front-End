"use client";
import React from "react";
import {
  API_BASE_URL,
  QUERY_CACHE_TIME,
} from "../../components/common/constants";
import axios from "axios";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import DashboardSkelton from "../../components/common/DashboardSkelton";

const queryClient = new QueryClient();

function DashboardListWrapper() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <DashboardsList />
      </QueryClientProvider>
    </div>
  );
}

export default DashboardListWrapper;

function DashboardsList() {
  const allDashboardsQuery = useQuery({
    queryKey: ["dashboards"],
    queryFn: () => axios.get(API_BASE_URL + "dashboards"),
    // 10 minutes in milliseconds
    staleTime: QUERY_CACHE_TIME,
  });

  const policyNames: Array<{ name: string; id: string }> =
    allDashboardsQuery?.data?.data?.map(({ name, id }) => ({ name, id })) || [];

  if (allDashboardsQuery.isLoading) {
    return <DashboardSkelton />;
  }

  return (
    <div className="mx-auto mt-16 max-w-7xl  px-2 lg:px-6">
      <h2 className="font-semibold">Dashboard List</h2>
      <div className=" mt-3 grid   grid-cols-1 place-items-center gap-4">
        {policyNames.map(({ name, id }) => (
          <div
            key={id}
            className="relative  w-full flex-1 items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
          >
            <div className="min-w-0 flex-1">
              <Link
                className="no-underline decoration-black focus:outline-none"
                href={`/policy/${name}`}
              >
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">{name}</p>
                <p className="truncate text-sm text-gray-500">
                  Click here to view
                </p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
