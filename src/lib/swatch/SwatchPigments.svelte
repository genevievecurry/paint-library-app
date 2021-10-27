<script>
  export let pigments;
</script>

<section>
  <h2>Pigments</h2>

  {#each pigments as pigment}
    <div class="pigment">
      <div><img src={pigment.image_url} alt={pigment.name}/></div>
      <div>{pigment.code} {pigment.name}</div>
    </div>
  {/each}
</section>

<style>
  .pigment {
    display: flex;
  }
</style>
