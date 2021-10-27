<script>
	export let swatchCards;
</script>

<section class="swatche-cards">
	{#each swatchCards as swatchCard}
		<div class="swatch-card">
			<img src={swatchCard.image_url} alt={swatchCard.description} />
			<div class="meta">
				<p>
					{swatchCard.swatch_type || swatchCard.custom_swatch_type}
				</p>
				{#if swatchCard?.description}
					<p>
						{swatchCard.description}
					</p>
				{/if}
				<p>
					Paper: {swatchCard.paper.description} ({swatchCard.paper.weight_in_lbs})  by {swatchCard.paper.manufacturer}
				</p>
				<p>
					Uploaded by {swatchCard.author.display_name}
				</p>
			</div>
		</div>
	{/each}
</section>


<style>
	.swatche-cards{
		display: flex;
	}

	.swatch-card {
		padding: 10px;
	}
	.meta{
		font-size: .8rem;
	}
	p{
		margin: 0;
	}
</style>
