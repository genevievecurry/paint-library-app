<script lang="ts">
  export let title;
  export let subtitle = null;
  export let description = null;
  export let owner = null;
</script>

<header class="my-7 md:flex justify-between">
  <div class="mb-4">
    <div class="mb-4 font-light">
      <a href="/" class="link inline-block pr-2">Paint Library</a>
      <span class="text-gray-400">/</span>
      <span class="inline-block ml-2">{title}</span>
    </div>
    <h1 class="font-extrabold text-5xl">
      {title}
    </h1>
    {#if description}
      <div class="my-5 max-w-xl">{description}</div>
    {/if}
    {#if subtitle}
      <span class="block mt-2 font-light">{subtitle}</span>
    {/if}
    {#if owner}
      By <a href="/@{owner.username}" class="link">@{owner.username}</a>
    {/if}
  </div>
  <div>
    <slot />
  </div>
</header>
