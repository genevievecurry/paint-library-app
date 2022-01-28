<script context="module" lang="ts">
  export async function load({ fetch, url }) {
    const response = await fetch('/pigments.json?byColor=true');
    const { pathname } = url;
    let sections = {};
    const colors: PigmentListingByColor[] = await response.json();

    // Setup containers for sections
    colors.forEach((color) => (sections[color.slug] = {}));

    if (response.ok) {
      return {
        props: {
          colors,
          sections,
          pathname,
        },
      };
    }

    return {
      status: response.status,
      error: new Error('Could not load.'),
    };
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Header from '$lib/components/Header.svelte';
  import { pigmentCode } from '$lib/utility';

  export let sections: [];
  export let colors: PigmentListingByColor[];
  export let pathname;

  const sectionKeys = Object.keys(sections);

  let activeSectionId: string;
  let visible = [];
  let observer: IntersectionObserver;

  // Basic "Scroll Spy" to highlight current section
  onMount(() => {
    observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            // To determine if scrolling up or down
            if (sectionKeys.indexOf(id) < sectionKeys.indexOf(visible[0])) {
              // Add it to the beginning of the list
              visible.unshift(id);
            } else {
              // Add it to the end of the list
              visible.push(id);
            }
          } else {
            const visiblePosition = visible.indexOf(id);
            visiblePosition > -1 && visible.splice(visiblePosition, 1);
          }
        });
        // Set the activeSectionID to the first element in the visible array
        activeSectionId = visible[0];
      },
    );

    Object.entries(sections).map((entry) => {
      const target = entry[1];
      observer.observe(target);
    });

    return () => observer.disconnect();
  });
</script>

<svelte:head>
  <title>Pigments - Paint Library</title>
</svelte:head>

<div class="lg:container mx-auto px-4 sm:px-6">
  <Header title="Pigments" {pathname} />

  <div class="grid grid-cols-6">
    <aside class="col-span-1">
      <div class="sticky top-0 py-2">
        <span class="block text-xl font-bold">Color Ways</span>
        <ul class="mt-3 text-lg">
          {#each colors as color}
            <li class="my-1">
              <a
                class={`pr-2 transition-all ${
                  color.slug === activeSectionId
                    ? 'pl-6 font-medium'
                    : 'pl-2 text-gray-500 font-light'
                }`}
                href={`#${color.slug}`}>
                <span class="decorate-link inline-block">
                  {color.label}
                </span>
                <span class="text-sm">{color._count.pigments}</span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </aside>
    <div class="col-span-5">
      {#each colors as color}
        <section id={color.slug} bind:this={sections[color.slug]}>
          <div class="sticky top-0 bg-white py-2"
            ><h2 class="font-bold text-3xl">{color.label}</h2></div>

          <table class="border-collapse border-2 border-black my-4 w-full">
            <thead class="text-left border-b-2 border-black">
              <tr>
                <th class="pl-1 pr-3 py-3" />

                <th class="px-3 py-3 whitespace-nowrap">CI Code</th>
                <th class="px-3 w-full">Common Name</th>
                <th class="px-3 text-xs text-center">Lightfast</th>
                <th class="px-3 text-xs text-center">Transparency</th>
                <th class="px-3 text-xs text-center">Toxicity</th>
              </tr>
            </thead>
            {#each color.pigments as pigment}
              <tr
                class="transition-all border-b border-gray-300 cursor-pointer"
                on:click={() =>
                  goto(`/pigments/${color.slug}/${pigment.slug}`)}>
                <td class="pl-1 pr-3 py-1">
                  <a
                    sveltekit:prefetch
                    href={`/pigments/${color.slug}/${pigment.slug}`}>
                    <div
                      class="w-8 h-8 border border-black"
                      style={`background-color: ${
                        pigment.hex ? pigment.hex : color.hex
                      }`} />
                  </a>
                </td>
                <td class="px-3">
                  <span>
                    {@html pigmentCode(
                      pigment.type,
                      pigment.number,
                      pigment.colorCode,
                      { html: true },
                    )}
                  </span>
                </td>
                <td class="px-3 w-full">
                  <span class="decorate-link">{pigment.name}</span>
                </td>

                <td
                  class="px-3 text-center"
                  title={pigment.lightfastRating.label}
                  >{@html pigment.lightfastRating.code !== 'X' &&
                  pigment.lightfastRating.code !== 'NR'
                    ? pigment.lightfastRating.code
                    : '<span class="text-gray-400">&bull;</span>'}</td>
                <td
                  class="px-3 text-center"
                  title={pigment.transparencyRating.label}
                  >{@html pigment.transparencyRating.code !== 'X'
                    ? pigment.transparencyRating.code
                    : '<span class="text-gray-400">&bull;</span>'}</td>
                <td class="px-3 text-center text-sm">
                  {#if pigment.toxicity === 'A'}
                    Low
                  {:else if pigment.toxicity === 'B'}
                    Possible
                  {:else if pigment.toxicity === 'C'}
                    High
                  {:else if pigment.toxicity === 'D'}
                    Extreme
                  {:else}
                    <span class="text-gray-400">&bull;</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </table>
        </section>
      {/each}
    </div>
  </div>
</div>
