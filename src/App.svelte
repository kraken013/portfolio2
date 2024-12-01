<script lang="ts">
  import Router from 'svelte-spa-router';
  import Nav from './components/Nav.svelte';
  import Home from './routes/Home.svelte';
  import Projects from './routes/Projects.svelte';
  import Admin from './routes/Admin.svelte';
  import Login from './routes/Login.svelte';
  import Experience from './routes/Experience.svelte';
  import Register from './routes/Register.svelte';
  import { authStore } from './lib/stores/AuthStore';
  import { statsStore } from './lib/stores/StatsStore';
  import { replace } from 'svelte-spa-router';

  const routes = {
    '/': Home,
    '/projects': Projects,
    '/experience': Experience,
    '/admin': Admin,
    '/login': Login,
    '/register': Register
  };

  // Record page view on route change
  function handleRouteLoaded(event: CustomEvent) {
    statsStore.recordPageView(event.detail.location);
  }

  // Protect admin route
  function conditionsFailed(event: CustomEvent) {
    if (event.detail.route === '/admin' && (!$authStore || !$authStore.isAdmin)) {
      replace('/login');
    }
  }
</script>
<div class="w-full">

  <Nav />
</div>
<Router 
  {routes} 
  on:routeLoaded={handleRouteLoaded}
  on:conditionsFailed={conditionsFailed}
/>

<style>
  @font-face {
    font-family: 'Inter'; 
    src: url('/fonts/Inter.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  body {
    font-family: 'Inter', sans-serif;
  }
</style>
