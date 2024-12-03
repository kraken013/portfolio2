import { writable } from "svelte/store";
import { supabase } from "../supabase";

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
  is_approved: boolean;
}

// Define a type for the raw data from Supabase that might have slightly different properties
interface RawTestimonial {
  id?: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
  is_approved?: boolean;
}

function createTestimonialStore() {
  const { subscribe, set, update } = writable<Testimonial[]>([]);

  return {
    subscribe,

    async loadTestimonials() {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Type assertion to ensure data is an array and of the correct type
      const testimonials = ((data as RawTestimonial[]) || []).map(
        (testimonial): Testimonial => ({
          id: testimonial.id || "",
          name: testimonial.name,
          rating: testimonial.rating,
          comment: testimonial.comment,
          created_at: new Date(testimonial.created_at).toISOString(),
          is_approved: testimonial.is_approved || false,
        })
      );

      set(testimonials);
    },

    async loadApprovedTestimonials() {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Similar type assertion and mapping as in loadTestimonials
      const testimonials = ((data as RawTestimonial[]) || []).map(
        (testimonial): Testimonial => ({
          id: testimonial.id || "",
          name: testimonial.name,
          rating: testimonial.rating,
          comment: testimonial.comment,
          created_at: new Date(testimonial.created_at).toISOString(),
          is_approved: testimonial.is_approved || false,
        })
      );

      set(testimonials);
    },

    async approveTestimonial(id: string) {
      const { error } = await supabase
        .from("testimonials")
        .update({ is_approved: true })
        .eq("id", id);

      if (error) throw error;

      update((testimonials) =>
        testimonials.map((testimonial) =>
          testimonial.id === id
            ? { ...testimonial, is_approved: true }
            : testimonial
        )
      );
    },

    async rejectTestimonial(id: string) {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);

      if (error) throw error;

      update((testimonials) =>
        testimonials.filter((testimonial) => testimonial.id !== id)
      );
    },

    // New method to permanently delete a testimonial by ID
    async deleteTestimonial(id: string) {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Remove the deleted testimonial from the store
      update((testimonials) =>
        testimonials.filter((testimonial) => testimonial.id !== id)
      );
    },

    async addTestimonial({
      name,
      rating,
      comment,
    }: {
      name: string;
      rating: number;
      comment: string;
    }) {
      const { data, error } = await supabase
        .from("testimonials")
        .insert([{ name, rating, comment, is_approved: false }])
        .single();

      if (error) throw error;

      // Type assertion for data
      if (data) {
        const newTestimonial: Testimonial = {
          id: (data as RawTestimonial).id || "",
          name: (data as RawTestimonial).name,
          rating: (data as RawTestimonial).rating,
          comment: (data as RawTestimonial).comment,
          created_at: new Date(
            (data as RawTestimonial).created_at
          ).toISOString(),
          is_approved: false,
        };

        update((testimonials) => [newTestimonial, ...testimonials]);
      }
    },
  };
}

export const testimonialStore = createTestimonialStore();
