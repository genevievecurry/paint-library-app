<script context="module" lang="ts">
  export async function load({ session, fetch, url }) {
    if (session.user?.role === 'ADMIN' && session.user?.status === 'ACTIVE') {
      const { pathname } = url;
      const response = await fetch('/admin/palettes.json');

      if (response.ok) {
        return {
          props: {
            palettes: await response.json(),
            pathname,
          },
        };
      }

      return {
        status: response.status,
        error: new Error('Could not load.'),
      };
    } else {
      return { redirect: '/', status: 302 };
    }
  }
</script>

<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import { generateUrl } from '$lib/generate';
  import { timeAgo } from '$lib/utility';
  export let pathname;
  export let palettes;
</script>

<Header title="Palettes" {pathname} />

<section>
  <table class="table-auto border-collapse w-full text-sm mb-10">
    <thead>
      <tr class="border-b-2 border-black">
        <td class="p-1"><input type="checkbox" /></td>
        <td class="font-bold p-1">ID</td>
        <td class="font-bold p-1" />

        <td class="font-bold p-1">Name</td>
        <td class="font-bold p-1">Owner</td>
        <td class="font-bold p-1">Public</td>
        <td class="font-bold p-1 leading-tight">Saved by<br />Users</td>
        <td class="font-bold p-1 leading-tight">Paints</td>
        <td class="font-bold p-1 leading-tight">Created</td>
        <td class="font-bold p-1 leading-tight">Updated</td>
        <td class="font-bold p-1" />
        <td />
      </tr>
    </thead>
    <tbody>
      {#each palettes as palette}
        <tr class="border-b border-gray-300">
          <td class="p-1"><input type="checkbox" /></td>
          <td class="p-1">{palette.id}</td>
          <td>
            <div class="w-5 mr-2">
              <div
                class="aspect-w-16 aspect-h-16"
                style={`background-color: ${palette.hex};`} />
            </div>
          </td>
          <td class="p-1">{palette.title}</td>
          <td class="p-1">@{palette.owner.username}</td>
          <td class="p-1">{palette.visible}</td>
          <td class="p-1" class:muted={palette._count.savedByUsers === 0}
            >{palette._count.savedByUsers}</td>
          <td class="p-1" class:muted={palette._count.paintsInPalette === 0}
            >{palette._count.paintsInPalette}</td>
          <td class="p-1">{timeAgo(palette.createdAt)}</td>
          <td class="p-1">{timeAgo(palette.updatedAt)}</td>
          <td class="p-1">
            <a
              href={generateUrl({ prefix: 'palette', target: palette })}
              class="decorate-link">Public Link</a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>

<style>
  .muted {
    @apply text-gray-300;
  }
</style>
