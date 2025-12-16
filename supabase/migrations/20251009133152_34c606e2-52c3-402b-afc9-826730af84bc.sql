-- Create sensor_data table
CREATE TABLE public.sensor_data (
  id BIGSERIAL PRIMARY KEY,
  pressure DOUBLE PRECISION,
  temperature DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sensor_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read sensor data (adjust based on your needs)
CREATE POLICY "Allow public read access to sensor data"
ON public.sensor_data
FOR SELECT
USING (true);

-- Create policy to allow inserts (adjust based on your needs - you may want to restrict this)
CREATE POLICY "Allow insert access to sensor data"
ON public.sensor_data
FOR INSERT
WITH CHECK (true);

-- Create index on created_at for better query performance
CREATE INDEX idx_sensor_data_created_at ON public.sensor_data(created_at DESC);