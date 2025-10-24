import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';

export const getServices = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('services').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('services').insert([req.body]);
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
};
