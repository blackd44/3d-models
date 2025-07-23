export interface TObject {
  id: number;
  title: string;
  description: string;
  category: string;
  model_url: string;
  model_public_id: string;
  thumbnail_url: string | null;
  thumbnail_public_id: string | null;
  tags: string[];
  software: string | null;
  render_engine: string | null;
  poly_count: string | null;
  views: number;
  status: string;
  created_at: string;
  updated_at: string;
}
