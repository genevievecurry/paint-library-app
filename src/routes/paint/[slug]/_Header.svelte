<script lang="ts">
  export let title: string;
  export let manufacturerName: string;
</script>

<header class="my-7">
  <div>
    <div class="mb-4 font-light">
      <a
        href="/"
        class="underline text-gray-500 hover:text-white hover:bg-black inline-block pr-2"
        >Paint Library</a>
      <span class="text-gray-400">/</span>
      <span class="inline-block ml-2">{title}</span>
    </div>
    <h1 class="font-extrabold text-5xl">
      {title}
    </h1>
    <span class="block mt-2">{manufacturerName}</span>
  </div>
</header>
