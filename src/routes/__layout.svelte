<script lang="ts" context="module">
  import '../styles/global.css';
  import Search from './_Search.svelte';

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
    <header class="relative">
      <div class="bg-gray-900 py-6">
        <nav
          class="relative container mx-auto flex items-center justify-between px-4 sm:px-6"
          aria-label="Global">
          <div class="flex items-center">
            <div class="flex items-center justify-between w-full md:w-auto">
              <a href="/">
                <svg
                  width="52"
                  height="52"
                  viewBox="0 0 52 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <rect
                    x="2.6131"
                    y="1.95981"
                    width="29.7889"
                    height="48.0804"
                    fill="#F54564" />
                  <rect
                    x="32.402"
                    y="2.61307"
                    width="16.9849"
                    height="28.0905"
                    fill="#A8243C" />
                  <rect
                    width="16.9849"
                    height="20.1206"
                    transform="matrix(1 0 0 -1 32.402 50.8241)"
                    fill="#F9B3C0" />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.05528 0H44.9447C48.8412 0 52 3.15875 52 7.05528V44.9447C52 48.8412 48.8412 52 44.9447 52H7.05528C3.15876 52 0 48.8412 0 44.9447V7.05528C0 3.15876 3.15875 0 7.05528 0ZM7.05528 2.61307C4.60191 2.61307 2.61307 4.60191 2.61307 7.05528V44.9447C2.61307 47.3981 4.60191 49.3869 7.05528 49.3869H44.9447C47.3981 49.3869 49.3869 47.3981 49.3869 44.9447V7.05528C49.3869 4.60191 47.3981 2.61307 44.9447 2.61307H7.05528Z"
                    fill="black" />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M31.3568 49.387L31.4587 1.82914L34.0717 1.83835L33.9698 49.3962L31.3568 49.387Z"
                    fill="black" />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M49.3869 32.1407H31.4874V29.5276H49.3869V32.1407Z"
                    fill="black" />
                </svg>
              </a>
            </div>
          </div>
          <div class="hidden flex-1 md:flex md:items-center md:space-x-6 px-6">
            <Search reverse={true} />
          </div>

          {#if $session?.user}
            <div class="md:flex md:items-center md:space-x-6 text-white px-2">
              <span class="text-gray-400 font-light"
                >Hi, {$session?.user?.displayName}!</span>
            </div>

            <div class="relative inline-block text-left">
              <div
                use:clickOutside={{
                  enabled: menuOpen,
                  cb: () => (menuOpen = false),
                }}>
                <button
                  type="button"
                  class="inline-flex justify-center w-full p-1 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                  id="menu-button"
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                  on:click={() => (menuOpen = true)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-menu"
                    ><line x1="3" y1="12" x2="21" y2="12" /><line
                      x1="3"
                      y1="6"
                      x2="21"
                      y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                </button>
              </div>
              <div
                class="transition ease-out duration-100 {menuOpen
                  ? 'transform opacity-100 scale-100'
                  : 'transform opacity-0 scale-95'} z-10 border border-white origin-top-right absolute right-0 mt-2 w-56 bg-black ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabindex="-1">
                <div class="py-1" role="none">
                  {#if $session.user?.role === 'ADMIN'}
                    <a
                      href="/creator"
                      class="text-white hover:text-black hover:bg-white block px-4 py-2 text-sm"
                      role="menuitem"
                      tabindex="-1"
                      id="menu-item-0"
                      on:click={() => (menuOpen = false)}>Create Paint</a>
                    <a
                      href="/register"
                      class="text-white border-t border-white hover:text-black hover:bg-white block px-4 py-2 text-sm"
                      role="menuitem"
                      tabindex="-1"
                      id="menu-item-1"
                      on:click={() => (menuOpen = false)}>Register User</a>
                  {/if}
                  <a
                    href="/account"
                    class="text-white border-t border-white hover:text-black hover:bg-white block px-4 py-2 text-sm"
                    role="menuitem"
                    tabindex="-1"
                    id="menu-item-1"
                    on:click={() => (menuOpen = false)}>Account</a>
                  <span
                    class="text-white border-t border-white hover:text-black hover:bg-white block px-4 py-2 text-sm"
                    role="menuitem"
                    tabindex="-1"
                    on:click={logoutHandler}>Sign Out</span>
                </div>
              </div>
            </div>
          {:else}
            <div class="md:flex md:items-center md:space-x-6 text-white">
              <a href="/login">Login</a>
            </div>
          {/if}
        </nav>
      </div>
    </header>
    <main>
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
