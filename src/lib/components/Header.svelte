<script lang="ts">
  import { adminIcon } from '$lib/icons';

  export let title;
  export let subtitle = null;
  export let description = null;
  export let owner = null;
  export let pathname = '';

  const pathElements = pathname.slice(1).split('/');

  const breadcrumbs = pathElements.map((el, index) => {
    let url = '';

    for (let i = 0; i < index; i++) {
      url += `/${pathElements[i]}`;
    }

    url += `/${el}`;

    return {
      url,
      title: el,
    };
  });
</script>

<header class="my-7 md:flex justify-between">
  <div class="mb-4">
    <div class="mb-4 font-light">
      <a href="/" class="decorate-link inline-block pr-2">Paint Library</a>
      <span class="text-gray-400">/</span>
      {#each breadcrumbs as breadcrumb, index}
        {#if index < breadcrumbs.length - 1}
          <a
            href={breadcrumb.url}
            class="decorate-link inline-block mx-2 capitalize"
            >{breadcrumb.title}</a>
          <span class="text-gray-400">/</span>
        {:else}
          <span class="inline-block mx-2">{title}</span>
        {/if}
      {/each}
    </div>
    <h1 class="font-extrabold text-5xl mb-2">
      {title}
    </h1>
    {#if description}
      <div class="my-5 max-w-xl">{description}</div>
    {/if}
    {#if subtitle}
      <span class="block mt-2 font-light">{subtitle}</span>
    {/if}
    {#if owner}
      By <a href="/@{owner.username}" class="decorate-link"
        >@{owner.username}</a>
      {#if owner.role === 'ADMIN'}
        {@html adminIcon('h-5 w-5 inline-block')}
      {/if}
    {/if}
  </div>
  <div>
    <slot />
  </div>
</header>
