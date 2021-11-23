<script lang="ts" context="module">
  import '../styles/global.css';
</script>

<svelte:head>
  <title>Paint Library</title>
</svelte:head>

<div class="bg-white">
  <div class="relative overflow-hidden">
    <header class="relative">
      <div class="bg-gray-900 py-6 mb-8">
        <nav
          class="relative container mx-auto flex items-center justify-between px-4 sm:px-6"
          aria-label="Global"
        >
          <div class="flex items-center flex-1">
            <div class="flex items-center justify-between w-full md:w-auto">
              <a href="/"><span class="text-white font-extrabold text-4xl">Paint Library</span></a>
            </div>
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
      <div class="container mx-auto px-4 sm:px-6">
        <slot />
      </div>
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
