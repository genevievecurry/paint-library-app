<script>
  export let pigmentData;
  // type, name, number, colorLabel, colorSlug, colorCode


  // Todo: Move this into a utility?
  function pigmentCode(type, number, colorCode){
    let convertedType;
    
    switch(type) {
      case 'CIPIGMENT':
        convertedType = 'P';
        break;
      case 'CINATURAL':
        convertedType = 'N';
        break;
      default: convertedType = '';
    }

    return convertedType + colorCode + number;
  }
</script>

<section class="pigments">
  <h2>Pigments</h2>

  {#each pigmentData as pigment}
    <div class="pigment">
      <div><img src="https://placekitten.com/50/50" alt={pigment.name}/></div>
      <div>
        {pigmentCode(pigment.type, pigment.number, pigment.colorCode)} {pigment.name}
        <div>{pigment.colorLabel}</div>
      </div>

    </div>
  {/each}
</section>

<style>
  .pigments {
    padding: 10px;
		border: 1px solid black;
		margin: 10px;
  }
  .pigment {
    display: flex;
  }
</style>
