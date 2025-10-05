import React from "react";

function DashboardSkelton() {
  return (
    <div className="container mx-auto  mt-12 grid h-full w-full">
      <div
        role="status"
        className="shadowmd:p-6 w-full animate-pulse space-y-4 divide-y divide-gray-200 rounded  border p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 "></div>
            <div className="h-2 w-32 rounded-full bg-gray-200 "></div>
          </div>
          <div className="h-2.5 w-12 rounded-full bg-gray-300 "></div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div>
            <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 "></div>
            <div className="h-2 w-32 rounded-full bg-gray-200 "></div>
          </div>
          <div className="h-2.5 w-12 rounded-full bg-gray-300 "></div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div>
            <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 "></div>
            <div className="h-2 w-32 rounded-full bg-gray-200 "></div>
          </div>
          <div className="h-2.5 w-12 rounded-full bg-gray-300 "></div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div>
            <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 "></div>
            <div className="h-2 w-32 rounded-full bg-gray-200 "></div>
          </div>
          <div className="h-2.5 w-12 rounded-full bg-gray-300 "></div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div>
            <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 "></div>
            <div className="h-2 w-32 rounded-full bg-gray-200 "></div>
          </div>
          <div className="h-2.5 w-12 rounded-full bg-gray-300 "></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default DashboardSkelton;
