<script context="module">
  export async function load({ fetch }) {
    const response = await fetch('/pigments.json');
    let sections = {};
    const colors = await response.json();

    // Setup containers for sections
    colors.forEach((color) => (sections[color.slug] = {}));

    if (response.ok) {
      return {
        props: {
          colors,
          sections,
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

  export let sections;
  export let colors;

  const sectionKeys = Object.keys(sections);

  let activeSectionId: string;
  let visible = [];
  let observer;

  // Basic "Scroll Spy" to highlight current section
  onMount(() => {
    observer = new IntersectionObserver((entries) => {
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
    });

    Object.entries(sections).map((entry) => {
      const target = entry[1];
      observer.observe(target);
    });

    return () => observer.disconnect();
  });
</script>

<div class="container mx-auto px-4 sm:px-6">
  <header class="my-7">
    <div>
      <div class="mb-4 font-light">
        <a
          href="/"
          class="underline text-gray-500 hover:text-white hover:bg-black inline-block pr-2"
          >Paint Library</a
        >
        <span class="text-gray-400">/</span>
        <span class="inline-block pl-2">Pigments</span>
      </div>
      <h1 class="font-extrabold text-5xl"> Pigments </h1>
    </div>
  </header>

  <div class="grid grid-cols-6">
    <aside class="col-span-1">
      <div class="sticky top-0 py-2 mt-10">
        <span class="block text-xl font-bold">Color Ways</span>
        <ul class="mt-3 text-lg">
          {#each colors as color}
            <li class="my-1">
              <a
                class="{`hover:text-white hover:bg-black inline-block px-2 ${
                  color.slug === activeSectionId
                    ? 'text-black font-bold'
                    : 'text-gray-500 font-light'
                }`}"
                href="{`#${color.slug}`}"
              >
                {color.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </aside>
    <div class="col-span-5">
      {#each colors as color}
        <section id="{color.slug}" bind:this="{sections[color.slug]}">
          <div class="sticky top-0 bg-white py-2 mt-10"
            ><h2 class="font-bold text-3xl">{color.label}</h2></div
          >

          <table class="border-collapse border border-black mt-4 w-full">
            <thead class="text-left border-b border-black">
              <tr>
                <th class="pl-1 pr-3 py-3"></th>
                <th class="px-3 whitespace-nowrap">CI #</th>
                <th class="px-3 py-3 whitespace-nowrap">CI Code</th>
                <th class="px-3 w-full">Common Name</th>
              </tr>
            </thead>
            {#each color.pigments as pigment}
              <tr
                class="transition-all border-b border-gray-300 cursor-pointer hover:bg-black hover:text-white"
                on:click="{() => goto(`/pigments/${color.slug}/${pigment.slug}`)}"
              >
                <td class="pl-1 pr-3 py-1">
                  <a sveltekit:prefetch href="{`/pigments/${color.slug}/${pigment.slug}`}">
                    <div
                      class="w-8 h-8 border border-black"
                      style="{`background-color: ${pigment.hex}`}"></div>
                  </a>
                </td>
                <td class="px-3">
                  <span>{pigment.number}</span>
                </td>
                <td class="px-3">
                  <span>{pigment.slug}</span>
                </td>
                <td class="px-3 w-full">
                  <span>{pigment.name}</span>
                </td>
              </tr>
            {/each}
          </table>
        </section>
      {/each}
    </div>
  </div>
</div>
