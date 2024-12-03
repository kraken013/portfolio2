<script lang="ts">
    import { spring } from 'svelte/motion';
  
    interface Skill {
      name: string;
      level: number;
      category: string;
    }
  
    const skills: Skill[] = [
      // Technologies Frontend
      { name: 'React', level: 85, category: 'Frontend' },
      { name: 'Vue.js', level: 75, category: 'Frontend' },
      { name: 'Svelte', level: 90, category: 'Frontend' },
      { name: 'TypeScript', level: 80, category: 'Frontend' },
      { name: 'Tailwind CSS', level: 85, category: 'Frontend' },
  
      // Technologies Backend
      { name: 'Node.js', level: 80, category: 'Backend' },
      { name: 'Python', level: 75, category: 'Backend' },
      { name: 'Express.js', level: 70, category: 'Backend' },
      { name: 'PostgreSQL', level: 75, category: 'Backend' },
      { name: 'MongoDB', level: 65, category: 'Backend' },
  
      // Outils et DevOps
      { name: 'Docker', level: 65, category: 'DevOps' },
      { name: 'Git', level: 85, category: 'DevOps' },
      { name: 'CI/CD', level: 60, category: 'DevOps' },
      { name: 'AWS', level: 55, category: 'DevOps' }
    ];
  
    // Regrouper les compétences par catégorie
    const skillCategories = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
  
    let activeSkill: Skill | null = null;
  
    function getSkillColor(level: number) {
      if (level > 85) return 'from-green-500 to-green-700';
      if (level > 70) return 'from-green-400 to-green-600';
      if (level > 55) return 'from-yellow-400 to-yellow-600';
      return 'from-red-400 to-red-600';
    }
  
    function handleSkillHover(skill: Skill) {
      activeSkill = skill;
    }
  
    function handleSkillLeave() {
      activeSkill = null;
    }
  </script>
  
  <div class="container p-6 mx-auto rounded-lg shadow-lg bg-gray-50">
    <h2 class="mb-8 text-3xl font-bold text-center text-gray-800">
      Mes Compétences Techniques
    </h2>
  
    {#each Object.entries(skillCategories) as [category, categorySkills]}
      <div class="mb-8">
        <h3 class="mb-4 text-2xl font-semibold text-gray-700">{category}</h3>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {#each categorySkills as skill}
            <div 
              class="p-4 transition-all duration-300 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-xl hover:scale-105"
              on:mouseenter={() => handleSkillHover(skill)}
              on:mouseleave={handleSkillLeave}
            >
              <div class="flex items-center mb-2">
                <span class="mr-4 text-lg font-medium text-gray-700">{skill.name}</span>
                <span class="text-sm text-gray-500">{skill.level}%</span>
              </div>
              <div class="w-full h-4 overflow-hidden bg-gray-200 rounded-full">
                <div 
                  class={`h-full rounded-full bg-gradient-to-r ${getSkillColor(skill.level)}`} 
                  style="width: {skill.level}%"
                ></div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  
    {#if activeSkill}
      <div 
        class="fixed z-50 px-4 py-2 text-white transition-all duration-300 transform -translate-x-1/2 bg-gray-800 rounded-lg shadow-lg bottom-6 left-1/2"
      >
        <div class="flex items-center">
          <span class="mr-2 font-bold">{activeSkill.name}</span>
          <span class="text-sm text-gray-300">({activeSkill.level}%)</span>
        </div>
        <div class="text-sm text-gray-400">{activeSkill.category}</div>
      </div>
    {/if}
  </div>
  
  <style>
    .skill-gauge {
      transition: all 0.3s ease;
    }
  </style>