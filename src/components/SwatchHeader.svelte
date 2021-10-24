<script>
	export let title;
	export let manufacturer_name;
</script>

<header>
	<div>
		<h1>
			{title}
		</h1>
		{manufacturer_name}
	</div>
	<div>
		<button>
			Add to Palette
		</button>
	</div>
</header>
<hr/>

<style>
	header {
		display: flex;
	}
</style>