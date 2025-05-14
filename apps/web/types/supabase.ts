export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

type linkStatus = "active" | "inactive";
export type Database = {
  public: {
    Tables: {
      link: {
        Row: {
          id: string;
          long: string;
          short: string;
          userId: string;
          status: linkStatus
          created_at: string;
          title: string;
        };
        Insert: {
            long: string;
            short: string;
            userId: string;
            status: linkStatus
            created_at: string;
            title: string;
        };
        Update: {
            long: string;
            short: string;
            status: linkStatus
            title: string;
        };
      };
    };
    Views: {};
    Functions: {};
  };
};