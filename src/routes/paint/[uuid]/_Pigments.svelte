<script lang="ts">
  import { pigmentCode } from '$lib/utility';
  import type { Color, Pigment } from '.prisma/client';

  export let pigmentsOnPaints: { pigment: Pigment }[];
  interface PigmentComponent extends Pigment {
    color?: Color;
    slug: string;
  }

  const pigments: PigmentComponent[] = pigmentsOnPaints.map(
    (pop) => pop.pigment,
  );
</script>

<section class="mt-8">
  <h2 class="font-bold text-2xl">Pigments</h2>

  {#if pigments.length < 1}
    <span class="block my-4 text-gray-400">No pigments added yet.</span>
  {/if}

  {#each pigments as pigment}
    <a
      class="flex my-4"
      href={`/pigments/${pigment.color.slug}/${pigment.slug}`}>
      <div class="mr-4">
        <div class="border-2 border-black p-0.5 relative">
          <div class="w-12 h-12" style={`background: ${pigment.hex}`} />
        </div>
      </div>
      <div>
        <span class="decorate-link"
          >{pigmentCode(pigment.type, pigment.number, pigment.color?.code)}
          {pigment.name}</span>
        <span class="block text-gray-500 text-xs">{pigment.color?.label}</span>
      </div>
    </a>
  {/each}
</section>
