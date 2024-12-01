<script lang="ts">
    type Experience = {
      title: string;
      company: string;
      date: string;
      description?: string;
      status: 'current' | 'completed';
      technologies?: string[];
      mention?: string;
    };
  
    const professionalExperiences: Experience[] = [
      { 
        title: 'Développeur Frontend',
        company: 'Touchify', 
        date: '2023-2024',
        status: 'completed',
        technologies: ['Svelte', 'TypeScript', 'Tailwind']
      },
      { 
        title: 'Développeur Full Stack', 
        company: 'Erevo', 
        date: '2023',
        status: 'completed',
        technologies: ['React', 'Node.js', 'Monorepo', 'Docker']
      }
    ];
    
    const studyExperiences: Experience[] = [
      { 
        title: 'Master Pro - Architecte Logiciel',
        company: 'Epitech',
        date: '2023-2025',
        status: 'current'
      },
      { 
        title: 'RNCP - Concepteur Développeur d\'Applications',
        company: 'Le Wagon',
        date: '2023',
        status: 'completed',
      },
      { 
        title: 'RNCP - Développeur web et mobile',
        company: 'Simplon',
        date: '2022-2023',
        status: 'completed',
      },
      { 
        title: 'Bac Pro SEN - Systèmes Électroniques Numériques',
        company: 'Lycée Ampère',
        date: '2011-2014',
        status: 'completed',
      }
    ];
  
    
  
    const achievements: Experience[] = [
      { 
        title: 'Hackathon - Premier Prix',
        company: 'Epitech - Iris Conseil',
        date: 'Novembre 2024',
        description: 'Développement d\'une solution innovante exploitant l\'intelligence artificielle pour répondre à divers défis liés à la gestion du stationnement et de la circulation',
        status: 'completed'
      },
    ];
  
    function renderIcon(status: 'current' | 'completed') {
      if (status === 'current') {
        return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`;
      }
      return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />`;
    }
  </script>
  
  <div class="flex flex-col items-center min-h-screen p-8 bg-gray-50">
    <h1 class="mb-12 text-2xl font-bold text-gray-800">Mon Parcours</h1>
    
    <section class="w-full max-w-2xl mb-12">
        <h2 class="mb-8 text-xl font-semibold text-gray-800">Expériences Professionnelles</h2>
        {#each professionalExperiences as exp}
            <div class="relative pl-8 border-l-4 {exp.status === 'current' ? 'border-blue-500' : 'border-green-500'} mb-6">
            <div class="absolute -left-[26px] top-0 w-12 h-12 rounded-full flex items-center justify-center 
                        {exp.status === 'current' ? 'bg-blue-100' : 'bg-green-100'}">
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-6 w-6 {exp.status === 'current' ? 'text-blue-500' : 'text-green-500'}" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                >
                {@html renderIcon(exp.status)}
                </svg>
            </div>
            
            <div class="p-6 bg-white rounded-lg shadow-md">
                <h2 class="mb-2 font-semibold text-gray-800 text-md">{exp.title}</h2>
                <h3 class="mb-3 text-gray-600 text-md">{exp.company} | {exp.date}</h3>
                
                {#if exp.technologies}
                <div class="flex flex-wrap gap-2">
                    {#each exp.technologies as tech}
                    <span class="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full">
                        {tech}
                    </span>
                    {/each}
                </div>
                {/if}
            </div>
            </div>
        {/each}
    </section>
    
    <section class="w-full max-w-2xl">
    <h2 class="mb-8 text-xl font-semibold text-gray-800">Réalisations & Certifications</h2>
    {#each achievements as achievement}
        <div class="relative pl-8 mb-6 border-l-4 border-green-500">
        <div class="absolute -left-[26px] top-0 w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="w-6 h-6 text-green-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            >
            {@html renderIcon(achievement.status)}
            </svg>
        </div>
        
        <div class="p-6 bg-white rounded-lg shadow-md">
            <h2 class="mb-2 font-semibold text-gray-800 text-md">{achievement.title}</h2>
            <h3 class="mb-3 text-gray-600 text-md">{achievement.company} | {achievement.date}</h3>
            <p class="text-gray-700">{achievement.description}</p>
        </div>
        </div>
    {/each}
    </section>
      
    <section class="w-full max-w-2xl mb-12">
      <h2 class="mb-8 text-xl font-semibold text-gray-800">Études</h2>
      {#each studyExperiences as exp}
        <div class="relative pl-8 mb-6 border-l-4 border-green-500">
          <div class="absolute -left-[26px] top-0 w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="w-6 h-6 text-green-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {@html renderIcon(exp.status)}
            </svg>
          </div>
          
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h2 class="mb-2 font-semibold text-gray-800 text-md">{exp.title}</h2>
            <h3 class="mb-3 text-gray-600 text-md">{exp.company} | {exp.date}</h3>
            {#if exp.mention}
              <div class="mb-4">
                <span class="px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                  {exp.mention}
                </span>
              </div>
            {/if}
            
            {#if exp.technologies}
              <div class="flex flex-wrap gap-2">
                {#each exp.technologies as tech}
                  <span class="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full">
                    {tech}
                  </span>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </section>
  </div>