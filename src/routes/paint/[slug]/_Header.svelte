<script lang="ts">
  export let title: string;
  export let manufacturerName: string;
</script>

<header class="my-6">
  <div>
    <h1 class="font-extrabold text-4xl">
      {title}
    </h1>
    <span class="block mt-2">{manufacturerName}</span>
  </div>
</header>
