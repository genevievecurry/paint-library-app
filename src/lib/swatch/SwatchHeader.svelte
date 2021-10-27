<script>
	export let title;
	export let manufacturerName;
</script>

<header>
	<div>
		<h1>
			{title}
		</h1>
		{manufacturerName}
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