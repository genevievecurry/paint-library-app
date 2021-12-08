<script lang="ts" context="module">
  import '../styles/global.css';
  import Search from './_Search.svelte';
</script>

<script lang="ts">
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
          aria-label="Global"
        >
          <div class="flex items-center flex-1">
            <div class="flex items-center justify-between w-full md:w-auto">
              <a href="/">
                <svg
                  width="52"
                  height="52"
                  viewBox="0 0 52 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="2.6131" y="1.95981" width="29.7889" height="48.0804" fill="#F54564"
                  ></rect>
                  <rect x="32.402" y="2.61307" width="16.9849" height="28.0905" fill="#A8243C"
                  ></rect>
                  <rect
                    width="16.9849"
                    height="20.1206"
                    transform="matrix(1 0 0 -1 32.402 50.8241)"
                    fill="#F9B3C0"></rect>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.05528 0H44.9447C48.8412 0 52 3.15875 52 7.05528V44.9447C52 48.8412 48.8412 52 44.9447 52H7.05528C3.15876 52 0 48.8412 0 44.9447V7.05528C0 3.15876 3.15875 0 7.05528 0ZM7.05528 2.61307C4.60191 2.61307 2.61307 4.60191 2.61307 7.05528V44.9447C2.61307 47.3981 4.60191 49.3869 7.05528 49.3869H44.9447C47.3981 49.3869 49.3869 47.3981 49.3869 44.9447V7.05528C49.3869 4.60191 47.3981 2.61307 44.9447 2.61307H7.05528Z"
                    fill="black"></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M31.3568 49.387L31.4587 1.82914L34.0717 1.83835L33.9698 49.3962L31.3568 49.387Z"
                    fill="black"></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M49.3869 32.1407H31.4874V29.5276H49.3869V32.1407Z"
                    fill="black"></path>
                </svg>
              </a>
            </div>
          </div>
          <div class="hidden md:flex md:items-center">
            <Search />
          </div>

          <!-- <div class="hidden md:flex md:items-center md:space-x-6">
            <a href="#" class="border border-white px-3 py-2 text-base font-medium text-white hover:text-gray-300">
              Log in
            </a>
            <a href="#" class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700">
              Create Account
            </a>
          </div> -->
        </nav>
      </div>
    </header>
    <main>
      <slot />
    </main>
    <footer aria-labelledby="footerHeading">
      <h2 id="footerHeading" class="sr-only">Footer</h2>
      <div class="max-w-md mx-auto pt-12 px-4 sm:max-w-7xl sm:px-6 lg:pt-16 lg:px-8">
        <div class="mt-12 border-t border-gray-200 py-8">
          <p class="text-base text-gray-400 xl:text-center"> Paint Library. No rights reserved. </p>
        </div>
      </div>
    </footer>
  </div>
</div>
