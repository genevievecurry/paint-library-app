<script context="module">
  export async function load({ page, fetch }) {
    const url = `/pigments/${page.params.colorSlug}.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          results: await response.json(),
          slug: page.params.colorSlug,
        },
      };
    }

    return {
      status: response.status,
      error: new Error(response.error),
    };
  }
</script>

<script lang="ts">
  export let results;
  export let slug: string;

  const { currentColor, pigments } = results;
</script>

<header class="my-7">
  <div>
    <div class="mb-4 font-light">
      <a href="/" class="underline text-gray-500 hover:text-white hover:bg-black inline-block pr-2"
        >Paint Library</a
      >
      <span class="text-gray-400">/</span>
      <a
        href="/pigments"
        class="underline text-gray-500 hover:text-white hover:bg-black inline-block px-2"
        >Pigments</a
      >
      <span class="text-gray-400">/</span>
      <span class="inline-block ml-2">{currentColor}</span>
    </div>
    <h1 class="font-extrabold text-5xl">
      {currentColor} Pigments
    </h1>
  </div>
</header>

<section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
  {#each pigments as pigment}
    <div class="border border-black">
      <a
        sveltekit:prefetch
        href="{`/pigments/${slug}/${pigment.slug}`}"
        class="block transition-all bg-white hover:bg-black text-black hover:text-white hover:underline"
      >
        <div class="w-full h-48 border-b border-black" style="{`background-color: ${pigment.hex}`}"
        ></div>
        <div class="p-3">
          <span class="block">{pigment.name}</span>
        </div>
      </a>
    </div>
  {/each}
</section>
