<script>
  export let similarProducts;
  export let paintType;
</script>

<section>
  <h2>Similar {paintType}{similarProducts.length > 1 ? 's' : ''}</h2>

  {#each similarProducts as similarProduct}
    <div class="product">
      <div><img src={similarProduct.image_url} alt={similarProduct.product_color_name}/></div>
      <div>{similarProduct.product_color_name} <small>{similarProduct.manufacturer_name}</small></div>
    </div>
  {/each}
</section>

<style>
  .product {
    display: flex;
  }
</style>
