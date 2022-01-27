<script lang="ts">
  import { pigmentCode } from '$lib/utility';
  import { afterUpdate, onMount } from 'svelte';

  export let pigmentsOnPaints;

  $: pigmentsOnPaints = pigmentsOnPaints;
  $: pigments = [];

  // Todo: Are both of these onMount & afterUpdate needed? Is this code flailing?
  // Experiment with some tidying when you have a moment.
  onMount(() => {
    updatePigments();
    pigments = pigments;
  });

  afterUpdate(() => {
    updatePigments();
    pigments = pigments;
  });

  function updatePigments() {
    pigments = pigmentsOnPaints.map((pop) => {
      pop.pigment.colorCode = pop.pigment.color.code;
      return pop.pigment;
    });
  }
</script>

{#if pigments.length < 1}
  <span class="block my-4 text-gray-400 font-light"
    >No pigments added yet.</span>
{/if}

{#each pigments as pigment}
  <a class="flex my-4" href={`/pigments/${pigment.color.slug}/${pigment.slug}`}>
    <div class="mr-4">
      <div class="border-2 border-black p-0.5 relative">
        <div
          class="w-12 h-12"
          style={`background: ${
            pigment.hex ? pigment.hex : pigment.color.hex
          }`} />
      </div>
    </div>
    <div>
      <span
        class="transition text-teal-600 font-semibold hover:text-black inline-block leading-tight"
        >{pigmentCode(pigment.type, pigment.number, pigment.color?.code, {
          html: false,
        })}
        {pigment.name}</span>
      <span class="block text-gray-500 text-xs">{pigment.color?.label}</span>
    </div>
  </a>
{/each}
