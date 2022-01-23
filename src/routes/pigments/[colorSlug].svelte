<script context="module">
  export async function load({ params, fetch, url }) {
    const response = await fetch(`/pigments/${params.colorSlug}.json`);
    const { pathname } = url;

    if (response.ok) {
      return {
        props: {
          results: await response.json(),
          slug: params.colorSlug,
          pathname,
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
  import Header from '$lib/components/Header.svelte';

  export let results: { pigments: ListPigment[]; currentColor: string };
  export let slug: string;
  export let pathname: string;

  const { pigments, currentColor } = results;
</script>

<Header title="{currentColor} Pigments" {pathname} />

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
