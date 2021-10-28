<script>
  export let similarProducts;
  export let paintType;
</script>

<section class="similar-products">
  <h2>Similar {paintType}{similarProducts.length > 1 ? 's' : ''}</h2>

  {#each similarProducts as similarProduct}
    <div class="product">
      <div><img src={similarProduct.image_url} alt={similarProduct.product_color_name}/></div>
      <div>{similarProduct.product_color_name} <small>{similarProduct.manufacturer_name}</small></div>
    </div>
  {/each}
</section>

<style>
  .similar-products {
    padding: 10px;
		border: 1px solid black;
		margin: 10px;
  }
  .product {
    display: flex;
  }
</style>
