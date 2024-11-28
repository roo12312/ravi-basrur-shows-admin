export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      access_roles: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ads: {
        Row: {
          ad_content: Json;
          created_at: string;
          description: string;
          id: string;
          is_draft: boolean;
          name: string;
          updated_at: string;
        };
        Insert: {
          ad_content: Json;
          created_at?: string;
          description: string;
          id?: string;
          is_draft?: boolean;
          name: string;
          updated_at?: string;
        };
        Update: {
          ad_content?: Json;
          created_at?: string;
          description?: string;
          id?: string;
          is_draft?: boolean;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bank_account_details: {
        Row: {
          account_ifsc: string | null;
          account_name: string | null;
          account_number: string | null;
          created_at: string;
          id: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          account_ifsc?: string | null;
          account_name?: string | null;
          account_number?: string | null;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          account_ifsc?: string | null;
          account_name?: string | null;
          account_number?: string | null;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bank_account_details_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      campaign_ads: {
        Row: {
          ad_id: string;
          ad_start_time: number;
          campaign_id: string;
          created_at: string;
          duration: number;
          id: string;
          updated_at: string;
        };
        Insert: {
          ad_id: string;
          ad_start_time: number;
          campaign_id: string;
          created_at?: string;
          duration?: number;
          id?: string;
          updated_at?: string;
        };
        Update: {
          ad_id?: string;
          ad_start_time?: number;
          campaign_id?: string;
          created_at?: string;
          duration?: number;
          id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaign_ads_ad_id_fkey";
            columns: ["ad_id"];
            isOneToOne: false;
            referencedRelation: "ads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "campaign_ads_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          }
        ];
      };
      campaigns: {
        Row: {
          amount: number;
          created_at: string;
          description: string;
          end_date: string;
          id: string;
          is_draft: boolean;
          movie_id: string;
          name: string;
          pay_per_view: number;
          reserved_amount: number;
          start_date: string;
          updated_at: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          description: string;
          end_date: string;
          id?: string;
          is_draft?: boolean;
          movie_id: string;
          name: string;
          pay_per_view: number;
          reserved_amount?: number;
          start_date: string;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          description?: string;
          end_date?: string;
          id?: string;
          is_draft?: boolean;
          movie_id?: string;
          name?: string;
          pay_per_view?: number;
          reserved_amount?: number;
          start_date?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaign_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "campaign_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies_details";
            referencedColumns: ["id"];
          }
        ];
      };
      cast_information: {
        Row: {
          biography: string | null;
          birth_date: string | null;
          created_at: string;
          first_name: string;
          id: string;
          last_name: string;
          profile_picture: string | null;
          updated_at: string;
        };
        Insert: {
          biography?: string | null;
          birth_date?: string | null;
          created_at?: string;
          first_name: string;
          id?: string;
          last_name: string;
          profile_picture?: string | null;
          updated_at?: string;
        };
        Update: {
          biography?: string | null;
          birth_date?: string | null;
          created_at?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          profile_picture?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      cast_roles: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          priority: number | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          priority?: number | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          priority?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      certificates: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      constants: {
        Row: {
          created_at: string;
          id: string;
          updated_at: string;
          value: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          updated_at?: string;
          value: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          updated_at?: string;
          value?: string;
        };
        Relationships: [];
      };
      content_access: {
        Row: {
          created_at: string;
          end_date: string;
          id: string;
          is_watched: boolean;
          movie_id: string;
          payment_id: string | null;
          start_date: string;
          updated_at: string;
          user_id: string;
          watch_count: number | null;
        };
        Insert: {
          created_at?: string;
          end_date: string;
          id?: string;
          is_watched?: boolean;
          movie_id?: string;
          payment_id?: string | null;
          start_date: string;
          updated_at?: string;
          user_id?: string;
          watch_count?: number | null;
        };
        Update: {
          created_at?: string;
          end_date?: string;
          id?: string;
          is_watched?: boolean;
          movie_id?: string;
          payment_id?: string | null;
          start_date?: string;
          updated_at?: string;
          user_id?: string;
          watch_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "content_access_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_access_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies_details";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_access_payment_id_fkey";
            columns: ["payment_id"];
            isOneToOne: false;
            referencedRelation: "payment_transactions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_access_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      coupons: {
        Row: {
          applicable_for: string[];
          coupon: string;
          coupon_amount: number | null;
          coupon_max_discount: number | null;
          coupon_percentage: number | null;
          created_at: string;
          id: string;
          is_draft: boolean;
          max_uses: number;
          updated_at: string;
          valid_until: string;
        };
        Insert: {
          applicable_for?: string[];
          coupon: string;
          coupon_amount?: number | null;
          coupon_max_discount?: number | null;
          coupon_percentage?: number | null;
          created_at?: string;
          id?: string;
          is_draft?: boolean;
          max_uses?: number;
          updated_at?: string;
          valid_until: string;
        };
        Update: {
          applicable_for?: string[];
          coupon?: string;
          coupon_amount?: number | null;
          coupon_max_discount?: number | null;
          coupon_percentage?: number | null;
          created_at?: string;
          id?: string;
          is_draft?: boolean;
          max_uses?: number;
          updated_at?: string;
          valid_until?: string;
        };
        Relationships: [];
      };
      episodes: {
        Row: {
          created_at: string;
          episode_number: number;
          id: string;
          season_number: number;
          title: string;
          tv_show_id: string | null;
          updated_at: string;
          video_url: string | null;
        };
        Insert: {
          created_at?: string;
          episode_number: number;
          id?: string;
          season_number: number;
          title: string;
          tv_show_id?: string | null;
          updated_at?: string;
          video_url?: string | null;
        };
        Update: {
          created_at?: string;
          episode_number?: number;
          id?: string;
          season_number?: number;
          title?: string;
          tv_show_id?: string | null;
          updated_at?: string;
          video_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "episodes_tv_show_id_fkey";
            columns: ["tv_show_id"];
            isOneToOne: false;
            referencedRelation: "tv_shows";
            referencedColumns: ["id"];
          }
        ];
      };
      feedback: {
        Row: {
          created_at: string;
          id: string;
          movie_id: string | null;
          profile_id: string;
          rating: number;
          session_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          profile_id?: string;
          rating: number;
          session_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          profile_id?: string;
          rating?: number;
          session_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "feedback_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feedback_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies_details";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feedback_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feedback_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "viewing_history";
            referencedColumns: ["id"];
          }
        ];
      };
      genres: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      home_slider: {
        Row: {
          created_at: string;
          id: string;
          is_draft: boolean;
          movies_id: string | null;
          tv_shows_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_draft?: boolean;
          movies_id?: string | null;
          tv_shows_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_draft?: boolean;
          movies_id?: string | null;
          tv_shows_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "home_slider_movies_id_fkey";
            columns: ["movies_id"];
            isOneToOne: true;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "home_slider_movies_id_fkey";
            columns: ["movies_id"];
            isOneToOne: true;
            referencedRelation: "movies_details";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "home_slider_tv_shows_id_fkey";
            columns: ["tv_shows_id"];
            isOneToOne: false;
            referencedRelation: "tv_shows";
            referencedColumns: ["id"];
          }
        ];
      };
      languages: {
        Row: {
          code: string;
          created_at: string;
          id: string;
          name: string;
          native_name: string;
          updated_at: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          id?: string;
          name: string;
          native_name: string;
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          id?: string;
          name?: string;
          native_name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      movie_cast: {
        Row: {
          cast_id: string | null;
          created_at: string;
          id: string;
          movie_id: string | null;
          role_id: string | null;
          updated_at: string;
        };
        Insert: {
          cast_id?: string | null;
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          role_id?: string | null;
          updated_at?: string;
        };
        Update: {
          cast_id?: string | null;
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          role_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "movie_cast_cast_id_fkey";
            columns: ["cast_id"];
            isOneToOne: false;
            referencedRelation: "cast_information";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_cast_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_cast_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies_details";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_cast_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "cast_roles";
            referencedColumns: ["id"];
          }
        ];
      };
      movie_certificates: {
        Row: {
          certificate_id: string | null;
          created_at: string;
          id: string;
          movie_id: string | null;
          updated_at: string;
        };
        Insert: {
          certificate_id?: string | null;
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          updated_at?: string;
        };
        Update: {
          certificate_id?: string | null;
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "movie_certificates_certificate_id_fkey";
            columns: ["certificate_id"];
            isOneToOne: false;
            referencedRelation: "certificates";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_certificates_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_certificates_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies_details";
            referencedColumns: ["id"];
          }
        ];
      };
      movie_genres: {
        Row: {
          created_at: string;
          genre_id: string | null;
          id: string;
          movie_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          genre_id?: string | null;
          id?: string;
          movie_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          genre_id?: string | null;
          id?: string;
          movie_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "movie_genres_genre_id_fkey";
            columns: ["genre_id"];
            isOneToOne: false;
            referencedRelation: "genres";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_genres_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_genres_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies_details";
            referencedColumns: ["id"];
          }
        ];
      };
      movie_languages: {
        Row: {
          created_at: string;
          id: string;
          language_id: string | null;
          movie_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          language_id?: string | null;
          movie_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          language_id?: string | null;
          movie_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "movie_languages_language_id_fkey";
            columns: ["language_id"];
            isOneToOne: false;
            referencedRelation: "languages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_languages_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_languages_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies_details";
            referencedColumns: ["id"];
          }
        ];
      };
      movie_posters: {
        Row: {
          created_at: string;
          id: string;
          movie_id: string | null;
          type: string | null;
          updated_at: string;
          url: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          type?: string | null;
          updated_at?: string;
          url: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          type?: string | null;
          updated_at?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "movie_posters_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_posters_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies_details";
            referencedColumns: ["id"];
          }
        ];
      };
      movie_tags: {
        Row: {
          created_at: string;
          id: string;
          movie_id: string | null;
          tag_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          tag_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          tag_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "movie_tags_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_tags_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies_details";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      movie_videos: {
        Row: {
          content: Json;
          created_at: string;
          id: string;
          movie_id: string | null;
          provider: string;
          type: string | null;
          updated_at: string;
        };
        Insert: {
          content: Json;
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          provider: string;
          type?: string | null;
          updated_at?: string;
        };
        Update: {
          content?: Json;
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          provider?: string;
          type?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "movie_videos_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_videos_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies_details";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_videos_provider_fkey";
            columns: ["provider"];
            isOneToOne: false;
            referencedRelation: "video_providers";
            referencedColumns: ["id"];
          }
        ];
      };
      movies: {
        Row: {
          created_at: string;
          description: string | null;
          discounted_pricing_amount: number;
          duration: number | null;
          id: string;
          is_draft: boolean | null;
          is_released: boolean | null;
          pricing_amount: number;
          release_date: string | null;
          scheduled_release: string | null;
          slug: string | null;
          title: string;
          updated_at: string;
          watching_option: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          discounted_pricing_amount?: number;
          duration?: number | null;
          id?: string;
          is_draft?: boolean | null;
          is_released?: boolean | null;
          pricing_amount?: number;
          release_date?: string | null;
          scheduled_release?: string | null;
          slug?: string | null;
          title: string;
          updated_at?: string;
          watching_option: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          discounted_pricing_amount?: number;
          duration?: number | null;
          id?: string;
          is_draft?: boolean | null;
          is_released?: boolean | null;
          pricing_amount?: number;
          release_date?: string | null;
          scheduled_release?: string | null;
          slug?: string | null;
          title?: string;
          updated_at?: string;
          watching_option?: string;
        };
        Relationships: [];
      };
      payment_transactions: {
        Row: {
          amount: number;
          created_at: string | null;
          device_info: Json;
          id: string;
          ip_address: string;
          movie_id: string;
          payment_gateway: string;
          payment_method: string | null;
          response: Json | null;
          status: Database["public"]["Enums"]["payment_status"];
          transaction_id: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          device_info?: Json;
          id?: string;
          ip_address: string;
          movie_id?: string;
          payment_gateway: string;
          payment_method?: string | null;
          response?: Json | null;
          status?: Database["public"]["Enums"]["payment_status"];
          transaction_id?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          device_info?: Json;
          id?: string;
          ip_address?: string;
          movie_id?: string;
          payment_gateway?: string;
          payment_method?: string | null;
          response?: Json | null;
          status?: Database["public"]["Enums"]["payment_status"];
          transaction_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payment_transactions_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payment_transactions_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies_details";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payment_transactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      payment_transactions_history: {
        Row: {
          amount: number;
          created_at: string | null;
          device_info: Json;
          id: string;
          ip_address: string;
          movie_id: string;
          operation_timestamp: string | null;
          operation_type: string;
          payment_gateway: string;
          payment_method: string | null;
          payment_transaction_id: string;
          response: Json | null;
          status: Database["public"]["Enums"]["payment_status"];
          transaction_id: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          device_info: Json;
          id?: string;
          ip_address: string;
          movie_id: string;
          operation_timestamp?: string | null;
          operation_type: string;
          payment_gateway: string;
          payment_method?: string | null;
          payment_transaction_id: string;
          response?: Json | null;
          status: Database["public"]["Enums"]["payment_status"];
          transaction_id?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          device_info?: Json;
          id?: string;
          ip_address?: string;
          movie_id?: string;
          operation_timestamp?: string | null;
          operation_type?: string;
          payment_gateway?: string;
          payment_method?: string | null;
          payment_transaction_id?: string;
          response?: Json | null;
          status?: Database["public"]["Enums"]["payment_status"];
          transaction_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      payout_transactions: {
        Row: {
          all_ads_watched: boolean;
          amount: number;
          campaign_id: string | null;
          created_at: string | null;
          http_response: Json | null;
          id: string;
          is_flagged: boolean;
          movie_id: string;
          qualified: boolean | null;
          session_id: string;
          status: Database["public"]["Enums"]["payout_status"];
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          all_ads_watched?: boolean;
          amount: number;
          campaign_id?: string | null;
          created_at?: string | null;
          http_response?: Json | null;
          id?: string;
          is_flagged?: boolean;
          movie_id: string;
          qualified?: boolean | null;
          session_id: string;
          status?: Database["public"]["Enums"]["payout_status"];
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          all_ads_watched?: boolean;
          amount?: number;
          campaign_id?: string | null;
          created_at?: string | null;
          http_response?: Json | null;
          id?: string;
          is_flagged?: boolean;
          movie_id?: string;
          qualified?: boolean | null;
          session_id?: string;
          status?: Database["public"]["Enums"]["payout_status"];
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payout_transactions_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payout_transactions_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payout_transactions_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies_details";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payout_transactions_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "viewing_history";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payout_transactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar: string | null;
          created_at: string;
          email: string | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          phone_number: string | null;
          profile_name: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          avatar?: string | null;
          created_at?: string;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          phone_number?: string | null;
          profile_name?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          avatar?: string | null;
          created_at?: string;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          phone_number?: string | null;
          profile_name?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      push_notifications: {
        Row: {
          body: string | null;
          created_at: string;
          data: Json | null;
          failure_count: number | null;
          id: string;
          success_count: number | null;
          title: string | null;
          ttl: string | null;
          updated_at: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          data?: Json | null;
          failure_count?: number | null;
          id?: string;
          success_count?: number | null;
          title?: string | null;
          ttl?: string | null;
          updated_at?: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          data?: Json | null;
          failure_count?: number | null;
          id?: string;
          success_count?: number | null;
          title?: string | null;
          ttl?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      push_notifications_token: {
        Row: {
          created_at: string;
          id: string;
          platform: string | null;
          push_data: string | null;
          push_url: string | null;
          token: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          platform?: string | null;
          push_data?: string | null;
          push_url?: string | null;
          token?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          platform?: string | null;
          push_data?: string | null;
          push_url?: string | null;
          token?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "push_notifications_token_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      rental: {
        Row: {
          created_at: string;
          id: string;
          movie_id: string | null;
          price: number;
          profile_id: string | null;
          rental_expiry_date: string | null;
          rental_start_date: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          price: number;
          profile_id?: string | null;
          rental_expiry_date?: string | null;
          rental_start_date?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          price?: number;
          profile_id?: string | null;
          rental_expiry_date?: string | null;
          rental_start_date?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rental_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rental_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies_details";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rental_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      reviewers: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          reviewer_url: string | null;
          source: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          reviewer_url?: string | null;
          source?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          reviewer_url?: string | null;
          source?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          created_at: string;
          id: string;
          movie_id: string | null;
          rating: number | null;
          review_text: string | null;
          review_url: string | null;
          reviewer_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          rating?: number | null;
          review_text?: string | null;
          review_url?: string | null;
          reviewer_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          rating?: number | null;
          review_text?: string | null;
          review_url?: string | null;
          reviewer_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies_details";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey";
            columns: ["reviewer_id"];
            isOneToOne: false;
            referencedRelation: "reviewers";
            referencedColumns: ["id"];
          }
        ];
      };
      role_permissions: {
        Row: {
          created_at: string;
          id: string;
          permission_type: string | null;
          role_id: string | null;
          table_name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          permission_type?: string | null;
          role_id?: string | null;
          table_name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          permission_type?: string | null;
          role_id?: string | null;
          table_name?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "access_roles";
            referencedColumns: ["id"];
          }
        ];
      };
      session_ads: {
        Row: {
          ad_id: string;
          campaign_id: string;
          created_at: string;
          id: string;
          is_link_clicked: boolean;
          is_watched: boolean;
          session_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          ad_id: string;
          campaign_id: string;
          created_at?: string;
          id?: string;
          is_link_clicked?: boolean;
          is_watched?: boolean;
          session_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          ad_id?: string;
          campaign_id?: string;
          created_at?: string;
          id?: string;
          is_link_clicked?: boolean;
          is_watched?: boolean;
          session_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "session_ads_ad_id_fkey";
            columns: ["ad_id"];
            isOneToOne: false;
            referencedRelation: "ads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_ads_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_ads_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "viewing_history";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_ads_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      tags: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tv_shows: {
        Row: {
          created_at: string;
          description: string | null;
          genre: string | null;
          id: string;
          poster_url: string | null;
          seasons: number | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          genre?: string | null;
          id?: string;
          poster_url?: string | null;
          seasons?: number | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          genre?: string | null;
          id?: string;
          poster_url?: string | null;
          seasons?: number | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role_id: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role_id?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          role_id?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "access_roles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_roles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      video_providers: {
        Row: {
          created_at: string;
          fields: Json | null;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          fields?: Json | null;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          fields?: Json | null;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      viewing_history: {
        Row: {
          completed: boolean;
          content: Json;
          content_access_id: string | null;
          created_at: string;
          current_time: number;
          device_info: Json | null;
          id: string;
          ip_address: string | null;
          movie_id: string | null;
          others: Json | null;
          player_event: Database["public"]["Enums"]["player_events"];
          profile_id: string | null;
          tv_show_episode_id: string | null;
          type: string;
          updated_at: string;
        };
        Insert: {
          completed?: boolean;
          content: Json;
          content_access_id?: string | null;
          created_at?: string;
          current_time?: number;
          device_info?: Json | null;
          id?: string;
          ip_address?: string | null;
          movie_id?: string | null;
          others?: Json | null;
          player_event: Database["public"]["Enums"]["player_events"];
          profile_id?: string | null;
          tv_show_episode_id?: string | null;
          type: string;
          updated_at?: string;
        };
        Update: {
          completed?: boolean;
          content?: Json;
          content_access_id?: string | null;
          created_at?: string;
          current_time?: number;
          device_info?: Json | null;
          id?: string;
          ip_address?: string | null;
          movie_id?: string | null;
          others?: Json | null;
          player_event?: Database["public"]["Enums"]["player_events"];
          profile_id?: string | null;
          tv_show_episode_id?: string | null;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "viewing_history_content_access_id_fkey";
            columns: ["content_access_id"];
            isOneToOne: false;
            referencedRelation: "content_access";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "viewing_history_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "viewing_history_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies_details";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "viewing_history_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "viewing_history_tv_show_episode_id_fkey";
            columns: ["tv_show_episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          }
        ];
      };
      viewing_history_logs: {
        Row: {
          completed: boolean;
          content_access_id: string | null;
          created_at: string;
          current_time: number;
          device_info: Json | null;
          id: string;
          ip_address: string | null;
          movie_id: string | null;
          others: Json | null;
          player_event: Database["public"]["Enums"]["player_events"];
          profile_id: string | null;
          tv_show_episode_id: string | null;
          type: string | null;
          updated_at: string;
          viewing_history_id: string;
        };
        Insert: {
          completed?: boolean;
          content_access_id?: string | null;
          created_at: string;
          current_time?: number;
          device_info?: Json | null;
          id?: string;
          ip_address?: string | null;
          movie_id?: string | null;
          others?: Json | null;
          player_event: Database["public"]["Enums"]["player_events"];
          profile_id?: string | null;
          tv_show_episode_id?: string | null;
          type?: string | null;
          updated_at: string;
          viewing_history_id: string;
        };
        Update: {
          completed?: boolean;
          content_access_id?: string | null;
          created_at?: string;
          current_time?: number;
          device_info?: Json | null;
          id?: string;
          ip_address?: string | null;
          movie_id?: string | null;
          others?: Json | null;
          player_event?: Database["public"]["Enums"]["player_events"];
          profile_id?: string | null;
          tv_show_episode_id?: string | null;
          type?: string | null;
          updated_at?: string;
          viewing_history_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "viewing_history_logs_viewing_history_id_fkey";
            columns: ["viewing_history_id"];
            isOneToOne: false;
            referencedRelation: "viewing_history";
            referencedColumns: ["id"];
          }
        ];
      };
      watchlists: {
        Row: {
          created_at: string;
          id: string;
          item_type: string | null;
          movie_id: string | null;
          profile_id: string;
          tv_show_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          item_type?: string | null;
          movie_id?: string | null;
          profile_id: string;
          tv_show_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          item_type?: string | null;
          movie_id?: string | null;
          profile_id?: string;
          tv_show_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "watchlists_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "watchlists_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies_details";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "watchlists_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "watchlists_tv_show_id_fkey";
            columns: ["tv_show_id"];
            isOneToOne: false;
            referencedRelation: "tv_shows";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      movies_details: {
        Row: {
          cast: Json | null;
          certificates: string[] | null;
          content_access: boolean | null;
          created_at: string | null;
          description: string | null;
          discounted_pricing_amount: number | null;
          duration: number | null;
          genres: string[] | null;
          home_slider: boolean | null;
          id: string | null;
          is_draft: boolean | null;
          is_released: boolean | null;
          languages: string[] | null;
          movie_posters: Json | null;
          movie_videos: Json | null;
          pay_per_view: number | null;
          pricing_amount: number | null;
          release_date: string | null;
          scheduled_release: string | null;
          slug: string | null;
          tags: string[] | null;
          title: string | null;
          updated_at: string | null;
          watch_list: boolean | null;
          watching_option: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      gbt_bit_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_bool_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_bool_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_bpchar_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_bytea_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_cash_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_cash_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_date_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_date_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_decompress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_enum_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_enum_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_float4_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_float4_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_float8_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_float8_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_inet_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_int2_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_int2_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_int4_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_int4_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_int8_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_int8_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_intv_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_intv_decompress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_intv_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_macad_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_macad_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_macad8_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_macad8_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_numeric_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_oid_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_oid_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_text_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_time_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_time_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_timetz_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_ts_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_ts_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_tstz_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_uuid_compress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_uuid_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_var_decompress: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbt_var_fetch: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey_var_in: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey_var_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey16_in: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey16_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey2_in: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey2_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey32_in: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey32_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey4_in: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey4_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey8_in: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      gbtreekey8_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      get_current_time: {
        Args: {
          p_profile_id: string;
          p_movie_id: string;
          p_content_access_id: string;
          p_asset_id: string;
        };
        Returns: number;
      };
      update_payout_status: {
        Args: {
          session_id_prop: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      payment_status:
        | "initiated"
        | "pending"
        | "success"
        | "failed"
        | "refunded";
      payout_status:
        | "initial"
        | "not qualified"
        | "processing"
        | "processed"
        | "success"
        | "failed";
      player_events:
        | "pause"
        | "play"
        | "completed"
        | "error"
        | "seek"
        | "subtitle"
        | "current_time"
        | "initial"
        | "back"
        | "ad_shown"
        | "ad_closed"
        | "ad_link_clicked";
      watching_options: "rental" | "paid" | "free";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
