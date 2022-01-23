<script context="module" lang="ts">
  export async function load({ session, fetch, url }) {
    if (session.user?.role === 'ADMIN' && session.user?.status === 'ACTIVE') {
      const { pathname } = url;
      const response = await fetch('/admin/pigments.json');

      if (response.ok) {
        return {
          props: {
            pigments: await response.json(),
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
  import { timeAgo } from '$lib/utility';
  export let pathname;
  export let pigments;
</script>

<Header title="Pigments" {pathname} />

<section>
  <table class="table-auto border-collapse w-full text-sm mb-10">
    <thead>
      <tr class="border-b-2 border-black">
        <td class="p-1"><input type="checkbox" /></td>
        <td class="font-bold p-1">ID</td>
        <td class="font-bold p-1" />

        <td class="font-bold p-1">CI Name</td>
        <td class="font-bold p-1">Name</td>
        <td class="font-bold p-1">Color</td>
        <td class="font-bold p-1 leading-tight">In<br />Paints</td>
        <td class="font-bold p-1 leading-tight">Created</td>
        <td class="font-bold p-1 leading-tight">Updated</td>
        <td class="font-bold p-1" />
        <td />
      </tr>
    </thead>
    <tbody>
      {#each pigments as pigment}
        <tr class="border-b border-gray-300">
          <td class="p-1"><input type="checkbox" /></td>
          <td class="p-1">{pigment.id}</td>
          <td>
            <div class="w-5 mr-2">
              <div
                class="aspect-w-16 aspect-h-16"
                style={`background-color: ${pigment.hex};`} />
            </div>
          </td>
          <td class="p-1">{pigment.slug}</td>
          <td class="p-1">{pigment.name}</td>
          <td class="p-1">{pigment.color.label}</td>
          <td class="p-1" class:muted={pigment._count.paints === 0}
            >{pigment._count.paints}</td>

          <td class="p-1">{timeAgo(pigment.createdAt)}</td>
          <td class="p-1">{timeAgo(pigment.updatedAt)}</td>
          <td class="p-1">
            <a
              href={`/pigments/${pigment.color.slug}/${pigment.slug}`}
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
