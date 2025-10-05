"use client";
import PolicyPage from "../../components/PolicyPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const reactQueryClient = new QueryClient();

export default function PolicyPageWrapper({ params }) {
  return (
    <QueryClientProvider client={reactQueryClient}>
      <PolicyPage dashboardName={params.slug} />
    </QueryClientProvider>
  );
}
