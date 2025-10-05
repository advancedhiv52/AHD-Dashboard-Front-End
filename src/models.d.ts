type Dashboard = {
  id: number;
  name: string;
  description: string;
  codebook_file: string | null;
  codebook_name: string | null;
  policy_brief_description?: string | null;
  policy_brief_file?: string | null;
  codebook_file_description?: string | null;
  codebook_file?: string | null;

  map_title?: string | null;
  map_paragraph?: string | null;
  table_title?: string | null;
  table_paragraph?: string | null;
  extra_info?: Array<{
    extra_info: string;
  }>;
};

type Policy = {
  id: number;
  name: string;
  description: string;
};

type Country = {
  id: number;
  country_2_digit: string;
  country_3_digit: string;
  country: string;
};

type PolicyStatus = {
  policy_status: 0 | 1 | 2 | 3;
  policy_status_display: string;
};

type PolicyWithCountryWiseStatus = Policy & {
  countries_with_policy_status: Array<Country & PolicyStatus>;
};

type DashboardWithPolicyWiseCountryData = Dashboard & {
  policy_wise_countries_data: Array<PolicyWithCountryWiseStatus>;
};

type Country2 = {
  id: number;
  country_code_2_digit: string;
  country_code_3_digit: string;
  country: string;
};

type PolicyWithYear = Policy & {
  year: number;
};

type DashboardWithCountryWisePolicyData = Array<
  Dashboard & {
    country_wise_policy_data: Array<
      Country2 & {
        policies: Array<
          PolicyWithYear &
            PolicyStatus & {
              sub_policies: Array<{
                sub_policy_name: string;
                status: string;
                policy_status_display: string;
              }>;
            }
        >;
      }
    >;
  }
>;
