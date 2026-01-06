-- Create stocks table for toy inventory management
CREATE TABLE public.stocks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    item_code TEXT NOT NULL,
    purchase_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    selling_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 0,
    stock_value NUMERIC(12, 2) GENERATED ALWAYS AS (purchase_price * quantity) STORED,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;

-- Users can only view their own stocks
CREATE POLICY "Users can view their own stocks"
ON public.stocks
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own stocks
CREATE POLICY "Users can insert their own stocks"
ON public.stocks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own stocks
CREATE POLICY "Users can update their own stocks"
ON public.stocks
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own stocks
CREATE POLICY "Users can delete their own stocks"
ON public.stocks
FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_stocks_updated_at
BEFORE UPDATE ON public.stocks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create profiles table for user info
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, name, email)
    VALUES (new.id, new.raw_user_meta_data ->> 'name', new.email);
    RETURN new;
END;
$$;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();