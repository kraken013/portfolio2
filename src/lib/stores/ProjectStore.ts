import { writable, get } from "svelte/store";
import { supabase } from "../supabase";

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  created_at: Date;
}

function createProjectStore() {
  const { subscribe, set, update } = writable<Project[]>([]);

  return {
    subscribe,

    async loadProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      set(
        data.map((project) => ({
          ...project,
          created_at: new Date(project.created_at),
        }))
      );
    },

    async addProject(project: Omit<Project, "id" | "created_at">) {
      try {
        console.log("Tentative d'ajout du projet:", project);

        const { data, error } = await supabase
          .from("projects")
          .insert([
            {
              title: project.title,
              description: project.description,
              technologies: project.technologies,
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (error) {
          console.error("Erreur lors de l'insertion du projet:", error);
          throw error;
        }

        console.log("Projet ajouté avec succès:", data);

        update((projects) => [
          ...projects,
          {
            ...data,
            created_at: new Date(data.created_at),
          },
        ]);
      } catch (error) {
        console.error("Erreur dans addProject:", error);
        throw error;
      }
    },
    async deleteProject(id: string) {
      try {
        const { error } = await supabase.from("projects").delete().eq("id", id);

        if (error) throw error;

        update((projects) => projects.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
      }
    },

    async updateProject(project: Project) {
      try {
        const { error } = await supabase
          .from("projects")
          .update({
            title: project.title,
            description: project.description,
            technologies: project.technologies,
          })
          .eq("id", project.id);

        if (error) throw error;

        update((projects) =>
          projects.map((p) => (p.id === project.id ? { ...p, ...project } : p))
        );
      } catch (error) {
        console.error("Error updating project:", error);
        throw error;
      }
    },
  };
}

export const projectStore = createProjectStore();
