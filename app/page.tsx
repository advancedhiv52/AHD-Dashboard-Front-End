"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from "next/head";
import FirstPolicyInDashboard from "./components/FirstPolicyInDashboard";

const reactQueryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={reactQueryClient}>
      <div>
        <Head>
          <title>Dashboard</title>
        </Head>
        <FirstPolicyInDashboard />
      </div>
    </QueryClientProvider>
  );
}
