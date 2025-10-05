"use client";

export const LEGEND_STATUS_COLOR_MAP = {
  Adopted: { hex: "#3479A2" },
  "Not Adopted": { hex: "#F68D3F" },
  "Partially Adopted": { hex: "#FAE595" },
  "Data not yet available": { hex: "#838383" },
};
export const policyStatusNameToCode = {
  "data not available": 0,
  "not adopted": 1,
  "partially adopted": 2,
  adopted: 3,
};

export const PolicyStatus = {
  "Data not available": 0,
  "Not adopted": 1,
  "Partially adopted": 2,
  Adopted: 3,
} as const;

export const statusToHexMap = {
  0: "#838383",
  1: "#F68D3F",
  2: "#FAE595",
  3: "#3479A2",
};

const useOldBaseURL = (() => {
  try {
    if (typeof window === "undefined") return false;
    return window?.localStorage?.getItem("is_local") === "true";
  } catch (e) {
    return false;
  }
})();

export const BE_BASE_URL = "https://advancedhiv.uis.georgetown.edu/";
export const BE_BASE_URL_1 = "https://advancedhiv.uis.georgetown.edu";

export const API_BASE_URL = BE_BASE_URL + "api/";

// 10 minutes
export const QUERY_CACHE_TIME = 1000 * 60 * 10;
