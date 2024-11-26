import { writable, get } from 'svelte/store';
import { supabase } from '../supabase';

export interface Project {
  id: string;
  title: string;
  description: string;
  logo: string;
  localLogo: string;
  images: string[];
  localImages: string[];
  technologies: string[];
  created_at: Date;
}

function createProjectStore() {
  const { subscribe, set, update } = writable<Project[]>([]);

  return {
    subscribe,
    
    async loadProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      set(data.map(project => ({
        ...project,
        created_at: new Date(project.created_at)
      })));
    },

    async addProject(project: Omit<Project, 'id' | 'created_at' | 'logo' | 'images' | 'localLogo' | 'localImages'> & { logo: File, images: File[] }) {
      try {
        // Upload logo
        const logoPath = `logos/${Date.now()}-${project.logo.name}`;
        const { error: logoError } = await supabase.storage
          .from('project-images')
          .upload(logoPath, project.logo);

        if (logoError) throw logoError;

        // Upload images
        const imagePaths = await Promise.all(
          project.images.map(async (image) => {
            const path = `images/${Date.now()}-${image.name}`;
            const { error: imageError } = await supabase.storage
              .from('project-images')
              .upload(path, image);

            if (imageError) throw imageError;
            return path;
          })
        );

        // Get public URLs
        const { data: { publicUrl: logoUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(logoPath);

        const imageUrls = imagePaths.map(path => {
          const { data: { publicUrl } } = supabase.storage
            .from('project-images')
            .getPublicUrl(path);
          return publicUrl;
        });

        // Insert project data
        const { data, error } = await supabase
          .from('projects')
          .insert([{
            title: project.title,
            description: project.description,
            technologies: project.technologies,
            logo: logoUrl,
            images: imageUrls,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) throw error;

        update(projects => [...projects, {
          ...data,
          created_at: new Date(data.created_at)
        }]);

      } catch (error) {
        console.error('Error adding project:', error);
        throw error;
      }
    },

    async deleteProject(id: string) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);

        if (error) throw error;

        update(projects => projects.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
      }
    }
  };
}

export const projectStore = createProjectStore();