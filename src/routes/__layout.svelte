<script lang="ts" context="module">
  import '../styles/global.css';
  import Search from '$lib/components/Search.svelte';

  export function load() {
    return {
      props: {
        menuOpen: false,
      },
    };
  }
</script>

<script lang="ts">
  import { session } from '$app/stores';
  import { goto } from '$app/navigation';
  import { clickOutside } from '$lib/actions';
  import Notification from '$lib/components/Notification.svelte';

  export let menuOpen: boolean;

  $: menuOpen = false;

  async function logout() {
    const response = await fetch('/auth/logout', {
      method: 'post',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({}),
    });
    if (response.ok) {
      goto('/');
    }
  }

  async function logoutHandler() {
    await logout();
    menuOpen = false;

    $session.user = null;
  }
</script>

<svelte:head>
  <title>Paint Library</title>
</svelte:head>

<div class="bg-white">
  <div class="relative">
    <header class="relative border-b-2 border-black">
      <div class="py-6">
        <nav
          class="relative mx-auto flex items-center justify-between px-4 sm:px-6"
          aria-label="Global">
          <div class="flex items-center">
            <div class="flex items-center justify-between w-full md:w-auto">
              <a href="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </a>
            </div>
          </div>
          <div class="hidden flex-1 md:flex md:items-center md:space-x-6 px-6">
            <Search reverse={false} />
          </div>
          <div class="md:flex md:items-center md:space-x-6 px-3 text-sm">
            <a href="/pigments" class="decorate-link">Pigments</a>
          </div>
          <div class="md:flex md:items-center md:space-x-6 px-3 text-sm">
            <a href="/palettes" class="decorate-link">Palettes</a>
          </div>
          {#if $session?.user}
            <div class="relative inline-block text-left">
              <div
                use:clickOutside={{
                  enabled: menuOpen,
                  cb: () => (menuOpen = false),
                }}>
                <button
                  type="button"
                  id="menu-button"
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                  on:click={() => (menuOpen = !menuOpen)}
                  class="pop inline-flex justify-center px-2 py-1 text-sm {menuOpen
                    ? 'text-pink-400 active'
                    : 'text-black'}">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
              {#if menuOpen}
                <div
                  class="light transition ease-out duration-100 {menuOpen
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95'} z-10 border-2 border-black origin-top-right absolute right-0 mt-2 w-48 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabindex="-1">
                  <div class="py-1" role="none">
                    <div class="block px-4 pt-2 pb-4 border-b border-gray-300">
                      <a
                        href={`/@${$session.user.username}`}
                        class="decorate-link text-sm"
                        role="menuitem"
                        tabindex="-1"
                        on:click={() => (menuOpen = false)}
                        >@{$session.user.username}</a>
                    </div>
                    {#if $session.user?.role === 'ADMIN'}
                      <div class="block px-4 py-2 text-sm"
                        ><a
                          href="/creator"
                          class="decorate-link"
                          role="menuitem"
                          tabindex="-1"
                          on:click={() => (menuOpen = false)}>Create Paint</a
                        ></div>
                      <div class="block px-4 py-2 text-sm">
                        <a
                          href="/register"
                          class="decorate-link"
                          role="menuitem"
                          tabindex="-1"
                          on:click={() => (menuOpen = false)}>Register User</a>
                      </div>
                    {/if}
                    <div class="block px-4 py-2 text-sm">
                      <a
                        href="/account"
                        class="decorate-link"
                        role="menuitem"
                        tabindex="-1"
                        on:click={() => (menuOpen = false)}>Account</a>
                    </div>
                    <div
                      class="block px-4 pb-2 pt-2 text-sm border-t border-gray-300">
                      <span
                        class="decorate-link cursor-pointer"
                        role="menuitem"
                        tabindex="-1"
                        on:click={logoutHandler}>Sign Out</span>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          {:else}
            <div class="bg-gray-300 h-8 w-px mx-3" />
            <div class="md:flex md:items-center md:space-x-6 px-3 text-sm">
              <a href="/login" class="decorate-link">Login</a>
            </div>
          {/if}
        </nav>
      </div>
    </header>
    <main>
      <Notification />

      <slot />
    </main>
    <footer aria-labelledby="footerHeading">
      <h2 id="footerHeading" class="sr-only">Footer</h2>
      <div
        class="max-w-md mx-auto pt-12 px-4 sm:max-w-7xl sm:px-6 lg:pt-16 lg:px-8">
        <div class="mt-12 border-t border-gray-200 py-8">
          <p class="text-base text-gray-400 xl:text-center">
            Paint Library. No rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</div>
