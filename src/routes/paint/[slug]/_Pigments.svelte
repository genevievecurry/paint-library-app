<script lang="ts">
  import type { Color, Pigment } from '.prisma/client';

  export let pigmentsOnPaints: { pigment: Pigment }[];

  interface PigmentComponent extends Pigment {
    color?: Color;
  }

  const pigments: PigmentComponent[] = pigmentsOnPaints.map((pop) => pop.pigment);

  // Todo: Move this into a utility?
  function pigmentCode(pigmentType: string, pigmentNumber: number, colorCode: string) {
    let convertedType: string;

    switch (pigmentType) {
      case 'CIPIGMENT':
        convertedType = 'P';
        break;
      case 'CINATURAL':
        convertedType = 'N';
        break;
      default:
        convertedType = '';
    }

    return convertedType + colorCode + pigmentNumber.toString();
  }
</script>

<section class="mt-8">
  <h2 class="font-bold text-2xl">Pigments</h2>

  {#if pigments.length < 1}<span class="block my-4 text-gray-400">No pigments added yet.</span>{/if}

  {#each pigments as pigment}
    <div class="flex my-4">
      <div class="mr-4"
        ><img
          class="border border-black"
          src="https://placekitten.com/50/50"
          alt="{pigment.name}"
        /></div
      >
      <div>
        {pigmentCode(pigment.type, pigment.number, pigment.color?.code)}
        <span>{pigment.name}</span>
        <span class="block text-gray-500 text-xs">{pigment.color?.label}</span>
      </div>
    </div>
  {/each}
</section>
