<script context="module" lang="ts">
  export async function load({ session, fetch, url }) {
    const { pathname } = url;

    if (session.user?.role === 'ADMIN' && session.user?.status === 'ACTIVE') {
      return {
        props: {
          pathname,
        },
      };
    } else {
      return { redirect: '/', status: 302 };
    }
  }
</script>

<script lang="ts">
  export let pathname;
</script>

<svelte:head>
  <title>Admin - Paint Library</title>
</svelte:head>

<div class="px-4 sm:px-6">
  <div class="flex">
    <div class="w-48 border-r-2 border-black pr-7 pt-7 relative">
      <ul class="sticky top-7">
        <li class="my-2">
          <a
            href="/admin/paints"
            class="decorate-link"
            class:current={pathname === '/admin/paints'}>Paints</a>
          <ul class="ml-3 my-1 text-sm">
            <li>
              <a
                href="/admin/paints/create"
                class="decorate-link"
                class:current={pathname === '/admin/paints/create'}
                >Create Paint</a>
            </li>
          </ul>
        </li>
        <li class="my-2">
          <a
            href="/admin/pigments"
            class="decorate-link"
            class:current={pathname === '/admin/pigments'}>Pigments</a>
          <ul class="ml-3 my-1 text-sm">
            <li>
              <a
                href="/admin/pigments/create"
                class="decorate-link"
                class:current={pathname === '/admin/pigments/create'}
                >Create Pigment</a>
            </li>
          </ul>
        </li>
        <li class="my-2">
          <a
            href="/admin/palettes"
            class="decorate-link"
            class:current={pathname === '/admin/palettes'}>Palettes</a>
        </li>
        <li class="my-2">
          <a
            href="/admin/manufacturers"
            class="decorate-link"
            class:current={pathname === '/admin/manufacturers'}
            >Manufacturers</a>
          <ul class="ml-3 my-1 text-sm">
            <li>
              <a
                href="/admin/manufacturers/create"
                class="decorate-link"
                class:current={pathname === '/admin/manufacturers/create'}
                >Create Manufacturer</a>
            </li>
          </ul>
        </li>
        <li class="my-2">
          <a
            href="/admin/notes"
            class="decorate-link"
            class:current={pathname === '/admin/notes'}>Notes</a>
          <ul class="ml-3 my-1 text-sm">
            <li>
              <a
                href="/admin/notes/pending"
                class="decorate-link"
                class:current={pathname === '/admin/notes/pending'}
                >Pending Approval</a>
            </li>
          </ul>
        </li>
        <li class="my-2">
          <a
            href="/admin/users"
            class="decorate-link"
            class:current={pathname === '/admin/users'}>Users</a>

          <ul class="ml-3 my-1 text-sm">
            <li>
              <a
                href="/admin/users/pending"
                class="decorate-link"
                class:current={pathname === '/admin/users/pending'}
                >Pending Approval</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="px-7 flex-grow"><slot /></div>
  </div>
</div>

<style>
  .current {
    color: black;
  }
</style>
