import { writable } from 'svelte/store';
import { supabase } from '../supabase';

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: Date;
}

function createTestimonialStore() {
  const { subscribe, set, update } = writable<Testimonial[]>([]);

  return {
    subscribe,
    
    async loadTestimonials() {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      set(data.map(testimonial => ({
        ...testimonial,
        created_at: new Date(testimonial.created_at)
      })));
    },

    async addTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at'>) {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .insert([{
            ...testimonial,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) throw error;

        update(testimonials => [{
          ...data,
          created_at: new Date(data.created_at)
        }, ...testimonials]);

        return data.id;
      } catch (error) {
        console.error('Error adding testimonial:', error);
        throw error;
      }
    }
  };
}

export const testimonialStore = createTestimonialStore();