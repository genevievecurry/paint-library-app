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
  export let results: { pigments: ListPigment[]; currentColor: string };
  export let slug: string;

  const { pigments, currentColor } = results;
</script>

<header class="my-7 md:flex justify-between">
  <div class="mb-4">
    <div class="mb-4 font-light">
      <a href="/" class="decorate-link inline-block pr-2">Paint Library</a>
      <span class="text-gray-400">/</span>
      <a href="/pigments" class="decorate-link inline-block px-2">Pigments</a>
      <span class="text-gray-400">/</span>
      <span class="inline-block ml-2">{currentColor}</span>
    </div>
    <h1 class="font-extrabold text-5xl">
      {currentColor} Pigments
    </h1>
  </div>
</header>

<section
  class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
  {#each pigments as pigment}
    <div class="border-2 border-black p-1">
      <a
        sveltekit:prefetch
        href={`/pigments/${slug}/${pigment.slug}`}
        class="relative">
        <div
          class="aspect-w-16 aspect-h-16"
          style={`background-color: ${pigment.hex}`} />
        <div class="p-2">
          <span class="block font-medium">{pigment.name}</span>
          <span class="block text-sm">{pigment.slug}</span>
        </div>
      </a>
    </div>
  {/each}
</section>
