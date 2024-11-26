import { writable } from 'svelte/store';
import { supabase } from '../supabase';

export interface SocialLink {
  name: string;
  icon: string;
  url: string;
  color: string;
}

export interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
  };
  about: {
    title: string;
    description: string;
    experience: string;
  };
  contact: {
    title: string;
    description: string;
  };
  socials: SocialLink[];
}

const defaultContent: HomeContent = {
  hero: {
    title: "Développeur Passionné",
    subtitle: "Transformez vos idées en réalité numérique"
  },
  about: {
    title: "À Propos",
    description: "Développeur web passionné par la création d'applications modernes",
    experience: "5"
  },
  contact: {
    title: "Contactez-moi",
    description: "Discutons de votre projet"
  },
  socials: [
    {
      name: 'LinkedIn',
      icon: 'fa-linkedin-in',
      url: 'https://linkedin.com/in/votre-profil',
      color: 'bg-[#0077b5]'
    },
    {
      name: 'Malt',
      icon: 'fa-m',
      url: 'https://www.malt.fr/profile/votre-profil',
      color: 'bg-[#FC5757]'
    },
    {
      name: 'GitHub',
      icon: 'fa-github',
      url: 'https://github.com/votre-profil',
      color: 'bg-[#333333]'
    }
  ]
};

function createContentStore() {
  const { subscribe, set } = writable<HomeContent>(defaultContent);

  return {
    subscribe,
    
    async loadContent() {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', 'home')
        .single();

      if (error || !data) {
        await this.initializeContent();
      } else {
        set(data.content as HomeContent);
      }
    },

    async initializeContent() {
      const { error } = await supabase
        .from('content')
        .insert([{
          id: 'home',
          content: defaultContent
        }]);

      if (error) throw error;
      set(defaultContent);
    },

    async updateContent(content: Partial<HomeContent>) {
      const { error } = await supabase
        .from('content')
        .update({ content })
        .eq('id', 'home');

      if (error) throw error;
      set({ ...defaultContent, ...content });
    }
  };
}

export const contentStore = createContentStore();