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
  import { successNotifier } from '$lib/notifier';
  import { menuIcon, logoIcon } from '$lib/icons';
  import Notifications from '$lib/components/Notifications.svelte';

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
      return true;
    }
  }

  async function logoutHandler() {
    menuOpen = false;

    const response = await logout();

    if (response) {
      successNotifier('Logged out.');
      $session.user = null;
      goto('/');
    }
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
                {@html logoIcon('h-16 w-16')}
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
                  {@html menuIcon()}
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
                          href="/admin"
                          class="decorate-link"
                          role="menuitem"
                          tabindex="-1"
                          on:click={() => (menuOpen = false)}
                          >Paint Library Admin</a
                        ></div>
                      <div class="block px-4 py-2 text-sm"
                        ><a
                          href="/admin/paints/create"
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
      <Notifications />

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
