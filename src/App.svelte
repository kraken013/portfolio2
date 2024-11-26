<script lang="ts">
  import Router from 'svelte-spa-router';
  import Nav from './components/Nav.svelte';
  import Home from './routes/Home.svelte';
  import Projects from './routes/Projects.svelte';
  import Admin from './routes/Admin.svelte';
  import Login from './routes/Login.svelte';
  import Register from './routes/Register.svelte';
  import { authStore } from './lib/stores/AuthStore';
  import { statsStore } from './lib/stores/StatsStore';
  import { replace } from 'svelte-spa-router';

  const routes = {
    '/': Home,
    '/projects': Projects,
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

<Nav />
<Router 
  {routes} 
  on:routeLoaded={handleRouteLoaded}
  on:conditionsFailed={conditionsFailed}
/>