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
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          locale: string;
          units: string;
          role: string;
          plan: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subscription_status: string;
          current_period_end: string | null;
          is_early_bird: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          locale?: string;
          units?: string;
          role?: string;
          plan?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string;
          current_period_end?: string | null;
          is_early_bird?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          locale?: string;
          units?: string;
          role?: string;
          plan?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string;
          current_period_end?: string | null;
          is_early_bird?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      bikes: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: string;
          manufacturer: string | null;
          model: string | null;
          year: number | null;
          weight_kg: number | null;
          total_distance_km: number;
          photo_url: string | null;
          notes: string | null;
          strava_gear_id: string | null;
          shop_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: string;
          manufacturer?: string | null;
          model?: string | null;
          year?: number | null;
          weight_kg?: number | null;
          total_distance_km?: number;
          photo_url?: string | null;
          notes?: string | null;
          strava_gear_id?: string | null;
          shop_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          type?: string;
          manufacturer?: string | null;
          model?: string | null;
          year?: number | null;
          weight_kg?: number | null;
          total_distance_km?: number;
          photo_url?: string | null;
          notes?: string | null;
          strava_gear_id?: string | null;
          shop_id?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'bikes_shop_id_fkey';
            columns: ['shop_id'];
            isOneToOne: false;
            referencedRelation: 'shops';
            referencedColumns: ['id'];
          },
        ];
      };
      component_categories: {
        Row: {
          id: string;
          key: string;
          default_max_distance_km: number | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          key: string;
          default_max_distance_km?: number | null;
          sort_order?: number;
        };
        Update: {
          key?: string;
          default_max_distance_km?: number | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      components: {
        Row: {
          id: string;
          bike_id: string;
          user_id: string;
          category_id: string | null;
          name: string;
          brand: string | null;
          model: string | null;
          distance_at_install_km: number;
          current_distance_km: number;
          max_distance_km: number | null;
          installed_at: string;
          notes: string | null;
          is_active: boolean;
          rotation_status: string;
          rotation_threshold_km: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          bike_id: string;
          user_id: string;
          category_id?: string | null;
          name: string;
          brand?: string | null;
          model?: string | null;
          distance_at_install_km?: number;
          current_distance_km?: number;
          max_distance_km?: number | null;
          installed_at?: string;
          notes?: string | null;
          is_active?: boolean;
          rotation_status?: string;
          rotation_threshold_km?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          bike_id?: string;
          category_id?: string | null;
          name?: string;
          brand?: string | null;
          model?: string | null;
          distance_at_install_km?: number;
          current_distance_km?: number;
          max_distance_km?: number | null;
          installed_at?: string;
          notes?: string | null;
          is_active?: boolean;
          rotation_status?: string;
          rotation_threshold_km?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'components_bike_id_fkey';
            columns: ['bike_id'];
            isOneToOne: false;
            referencedRelation: 'bikes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'components_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'component_categories';
            referencedColumns: ['id'];
          },
        ];
      };
      component_history: {
        Row: {
          id: string;
          component_id: string;
          from_bike_id: string | null;
          to_bike_id: string | null;
          action: string;
          distance_at_action_km: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          component_id: string;
          from_bike_id?: string | null;
          to_bike_id?: string | null;
          action: string;
          distance_at_action_km?: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          component_id?: string;
          from_bike_id?: string | null;
          to_bike_id?: string | null;
          action?: string;
          distance_at_action_km?: number;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'component_history_component_id_fkey';
            columns: ['component_id'];
            isOneToOne: false;
            referencedRelation: 'components';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'component_history_from_bike_id_fkey';
            columns: ['from_bike_id'];
            isOneToOne: false;
            referencedRelation: 'bikes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'component_history_to_bike_id_fkey';
            columns: ['to_bike_id'];
            isOneToOne: false;
            referencedRelation: 'bikes';
            referencedColumns: ['id'];
          },
        ];
      };
      service_intervals: {
        Row: {
          id: string;
          bike_id: string;
          user_id: string;
          name: string;
          interval_type: string;
          interval_value: number;
          last_performed_at: string | null;
          last_performed_distance_km: number | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          bike_id: string;
          user_id: string;
          name: string;
          interval_type: string;
          interval_value: number;
          last_performed_at?: string | null;
          last_performed_distance_km?: number | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          interval_type?: string;
          interval_value?: number;
          last_performed_at?: string | null;
          last_performed_distance_km?: number | null;
          notes?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'service_intervals_bike_id_fkey';
            columns: ['bike_id'];
            isOneToOne: false;
            referencedRelation: 'bikes';
            referencedColumns: ['id'];
          },
        ];
      };
      service_records: {
        Row: {
          id: string;
          service_interval_id: string | null;
          bike_id: string;
          user_id: string;
          title: string;
          performed_at: string;
          distance_at_service_km: number | null;
          cost: number | null;
          consumables: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          service_interval_id?: string | null;
          bike_id: string;
          user_id: string;
          title: string;
          performed_at: string;
          distance_at_service_km?: number | null;
          cost?: number | null;
          consumables?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          service_interval_id?: string | null;
          title?: string;
          performed_at?: string;
          distance_at_service_km?: number | null;
          cost?: number | null;
          consumables?: string | null;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'service_records_bike_id_fkey';
            columns: ['bike_id'];
            isOneToOne: false;
            referencedRelation: 'bikes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'service_records_service_interval_id_fkey';
            columns: ['service_interval_id'];
            isOneToOne: false;
            referencedRelation: 'service_intervals';
            referencedColumns: ['id'];
          },
        ];
      };
      bike_setup: {
        Row: {
          id: string;
          bike_id: string;
          user_id: string;
          tire_pressure_front: number | null;
          tire_pressure_rear: number | null;
          tire_width_front: number | null;
          tire_width_rear: number | null;
          tire_type: string | null;
          fork_pressure: number | null;
          fork_rebound: number | null;
          fork_compression: number | null;
          fork_sag_percent: number | null;
          fork_travel_mm: number | null;
          shock_pressure: number | null;
          shock_rebound: number | null;
          shock_compression: number | null;
          shock_sag_percent: number | null;
          shock_travel_mm: number | null;
          seat_height_mm: number | null;
          stem_length_mm: number | null;
          stem_angle: number | null;
          handlebar_width_mm: number | null;
          crank_length_mm: number | null;
          stack_mm: number | null;
          reach_mm: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          bike_id: string;
          user_id: string;
          tire_pressure_front?: number | null;
          tire_pressure_rear?: number | null;
          tire_width_front?: number | null;
          tire_width_rear?: number | null;
          tire_type?: string | null;
          fork_pressure?: number | null;
          fork_rebound?: number | null;
          fork_compression?: number | null;
          fork_sag_percent?: number | null;
          fork_travel_mm?: number | null;
          shock_pressure?: number | null;
          shock_rebound?: number | null;
          shock_compression?: number | null;
          shock_sag_percent?: number | null;
          shock_travel_mm?: number | null;
          seat_height_mm?: number | null;
          stem_length_mm?: number | null;
          stem_angle?: number | null;
          handlebar_width_mm?: number | null;
          crank_length_mm?: number | null;
          stack_mm?: number | null;
          reach_mm?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          tire_pressure_front?: number | null;
          tire_pressure_rear?: number | null;
          tire_width_front?: number | null;
          tire_width_rear?: number | null;
          tire_type?: string | null;
          fork_pressure?: number | null;
          fork_rebound?: number | null;
          fork_compression?: number | null;
          fork_sag_percent?: number | null;
          fork_travel_mm?: number | null;
          shock_pressure?: number | null;
          shock_rebound?: number | null;
          shock_compression?: number | null;
          shock_sag_percent?: number | null;
          shock_travel_mm?: number | null;
          seat_height_mm?: number | null;
          stem_length_mm?: number | null;
          stem_angle?: number | null;
          handlebar_width_mm?: number | null;
          crank_length_mm?: number | null;
          stack_mm?: number | null;
          reach_mm?: number | null;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'bike_setup_bike_id_fkey';
            columns: ['bike_id'];
            isOneToOne: true;
            referencedRelation: 'bikes';
            referencedColumns: ['id'];
          },
        ];
      };
      strava_connections: {
        Row: {
          id: string;
          user_id: string;
          strava_athlete_id: number;
          access_token: string;
          refresh_token: string;
          token_expires_at: string;
          last_sync_at: string | null;
          exclude_indoor: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          strava_athlete_id: number;
          access_token: string;
          refresh_token: string;
          token_expires_at: string;
          last_sync_at?: string | null;
          exclude_indoor?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          access_token?: string;
          refresh_token?: string;
          token_expires_at?: string;
          last_sync_at?: string | null;
          exclude_indoor?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      rides: {
        Row: {
          id: string;
          user_id: string;
          bike_id: string | null;
          strava_activity_id: number | null;
          title: string | null;
          distance_km: number;
          duration_seconds: number | null;
          elevation_m: number | null;
          date: string;
          source: string;
          is_indoor: boolean;
          sport_type: string | null;
          average_speed_kmh: number | null;
          file_path: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bike_id?: string | null;
          strava_activity_id?: number | null;
          title?: string | null;
          distance_km: number;
          duration_seconds?: number | null;
          elevation_m?: number | null;
          date: string;
          source?: string;
          is_indoor?: boolean;
          sport_type?: string | null;
          average_speed_kmh?: number | null;
          file_path?: string | null;
          created_at?: string;
        };
        Update: {
          bike_id?: string | null;
          strava_activity_id?: number | null;
          title?: string | null;
          distance_km?: number;
          duration_seconds?: number | null;
          elevation_m?: number | null;
          date?: string;
          source?: string;
          is_indoor?: boolean;
          sport_type?: string | null;
          average_speed_kmh?: number | null;
          file_path?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'rides_bike_id_fkey';
            columns: ['bike_id'];
            isOneToOne: false;
            referencedRelation: 'bikes';
            referencedColumns: ['id'];
          },
        ];
      };
      ride_tracks: {
        Row: {
          id: string;
          ride_id: string;
          user_id: string;
          track_geojson: Record<string, unknown>;
          bounds_ne_lat: number | null;
          bounds_ne_lng: number | null;
          bounds_sw_lat: number | null;
          bounds_sw_lng: number | null;
          point_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          ride_id: string;
          user_id: string;
          track_geojson: Record<string, unknown>;
          bounds_ne_lat?: number | null;
          bounds_ne_lng?: number | null;
          bounds_sw_lat?: number | null;
          bounds_sw_lng?: number | null;
          point_count?: number;
          created_at?: string;
        };
        Update: {
          track_geojson?: Record<string, unknown>;
          bounds_ne_lat?: number | null;
          bounds_ne_lng?: number | null;
          bounds_sw_lat?: number | null;
          bounds_sw_lng?: number | null;
          point_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'ride_tracks_ride_id_fkey';
            columns: ['ride_id'];
            isOneToOne: true;
            referencedRelation: 'rides';
            referencedColumns: ['id'];
          },
        ];
      };
      shops: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          website: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          website?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          website?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      inventory_items: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category_id: string | null;
          brand: string | null;
          model: string | null;
          quantity: number;
          purchased_at: string | null;
          price: number | null;
          suitable_bike_ids: string[];
          notes: string | null;
          ean_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category_id?: string | null;
          brand?: string | null;
          model?: string | null;
          quantity?: number;
          purchased_at?: string | null;
          price?: number | null;
          suitable_bike_ids?: string[];
          notes?: string | null;
          ean_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          category_id?: string | null;
          brand?: string | null;
          model?: string | null;
          quantity?: number;
          purchased_at?: string | null;
          price?: number | null;
          suitable_bike_ids?: string[];
          notes?: string | null;
          ean_code?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'inventory_items_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'component_categories';
            referencedColumns: ['id'];
          },
        ];
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          bike_id: string | null;
          component_id: string | null;
          name: string;
          file_path: string;
          file_type: string;
          document_type: string;
          file_size_bytes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bike_id?: string | null;
          component_id?: string | null;
          name: string;
          file_path: string;
          file_type: string;
          document_type?: string;
          file_size_bytes: number;
          created_at?: string;
        };
        Update: {
          bike_id?: string | null;
          component_id?: string | null;
          name?: string;
          document_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'documents_bike_id_fkey';
            columns: ['bike_id'];
            isOneToOne: false;
            referencedRelation: 'bikes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_component_id_fkey';
            columns: ['component_id'];
            isOneToOne: false;
            referencedRelation: 'components';
            referencedColumns: ['id'];
          },
        ];
      };
      feedback: {
        Row: {
          id: string;
          user_id: string;
          page: string | null;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          page?: string | null;
          message: string;
          created_at?: string;
        };
        Update: {
          message?: string;
        };
        Relationships: [];
      };
      bike_type_wear_defaults: {
        Row: {
          id: string;
          bike_type: string;
          category_key: string;
          max_distance_km: number;
        };
        Insert: {
          id?: string;
          bike_type: string;
          category_key: string;
          max_distance_km: number;
        };
        Update: {
          bike_type?: string;
          category_key?: string;
          max_distance_km?: number;
        };
        Relationships: [];
      };
      maintenance_plans: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          description: string | null;
          bike_type: string | null;
          service_interval_id: string | null;
          is_system: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          description?: string | null;
          bike_type?: string | null;
          service_interval_id?: string | null;
          is_system?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          bike_type?: string | null;
          service_interval_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'maintenance_plans_service_interval_id_fkey';
            columns: ['service_interval_id'];
            isOneToOne: false;
            referencedRelation: 'service_intervals';
            referencedColumns: ['id'];
          },
        ];
      };
      maintenance_plan_items: {
        Row: {
          id: string;
          plan_id: string;
          title: string;
          description: string | null;
          sort_order: number;
          is_required: boolean;
          section: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          title: string;
          description?: string | null;
          sort_order?: number;
          is_required?: boolean;
          section?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          sort_order?: number;
          is_required?: boolean;
          section?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'maintenance_plan_items_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'maintenance_plans';
            referencedColumns: ['id'];
          },
        ];
      };
      maintenance_executions: {
        Row: {
          id: string;
          plan_id: string;
          bike_id: string;
          user_id: string;
          service_record_id: string | null;
          started_at: string;
          completed_at: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          bike_id: string;
          user_id: string;
          service_record_id?: string | null;
          started_at?: string;
          completed_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          service_record_id?: string | null;
          completed_at?: string | null;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'maintenance_executions_plan_id_fkey';
            columns: ['plan_id'];
            isOneToOne: false;
            referencedRelation: 'maintenance_plans';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'maintenance_executions_bike_id_fkey';
            columns: ['bike_id'];
            isOneToOne: false;
            referencedRelation: 'bikes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'maintenance_executions_service_record_id_fkey';
            columns: ['service_record_id'];
            isOneToOne: false;
            referencedRelation: 'service_records';
            referencedColumns: ['id'];
          },
        ];
      };
      maintenance_execution_items: {
        Row: {
          id: string;
          execution_id: string;
          plan_item_id: string;
          checked: boolean;
          checked_at: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          execution_id: string;
          plan_item_id: string;
          checked?: boolean;
          checked_at?: string | null;
          notes?: string | null;
        };
        Update: {
          checked?: boolean;
          checked_at?: string | null;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'maintenance_execution_items_execution_id_fkey';
            columns: ['execution_id'];
            isOneToOne: false;
            referencedRelation: 'maintenance_executions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'maintenance_execution_items_plan_item_id_fkey';
            columns: ['plan_item_id'];
            isOneToOne: false;
            referencedRelation: 'maintenance_plan_items';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      recalculate_bike_distance: {
        Args: { bike_id_input: string };
        Returns: undefined;
      };
      recalculate_component_wear: {
        Args: { component_id_input: string };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
