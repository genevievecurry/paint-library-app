<script>
  export let pigments;

  // Todo: Move this into a utility?
  function pigmentCode(pigmentType, pigmentNumber, colorCode) {
    let convertedType;

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

    return convertedType + colorCode + pigmentNumber;
  }
</script>

<section class="mt-8">
  <h2 class="font-bold text-2xl">Pigments</h2>

  {#each pigments as item}
    <div class="flex my-4">
      <div class="mr-4"
        ><img
          class="border border-black"
          src="https://placekitten.com/50/50"
          alt="{item.pigment.name}"
        /></div
      >
      <div>
        {pigmentCode(item.pigment.type, item.pigment.number, item.pigment.color?.code)}
        <span>{item.pigment.name}</span>
        <span class="block text-gray-500 text-xs">{item.pigment.color?.label}</span>
      </div>
    </div>
  {/each}
</section>
